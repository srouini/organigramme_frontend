import { PageContainer } from "@ant-design/pro-components";
import type { Connection } from 'reactflow';
import { addEdge, MarkerType, NodeTypes, Edge, SmoothStepEdge } from '@xyflow/react';
import CustomButtonEdge from "@/components/ButtonEdge";
import { ReactFlow, Background, Controls, Panel } from "@xyflow/react";
import axios from "axios";
import "@xyflow/react/dist/style.css";
import { Button, message, Row, Col } from "antd";
import StructureHierarchy from "./components/StructureHierarchy";
import { useParams, useNavigate } from "react-router-dom";
import {
  useStructure,
  useStructureById,
  useAutoOrganize,
  useBulkUpdatePositions,
  useCreateEdge,
  useDiagramPositions,
  useUpdateDiagramPosition,
  DiagramPosition,
} from "@/hooks/useStructure";
import { Position, Structure, OrganigramEdge } from "@/types/reference";
import { useFlow } from "@/context/FlowContext";
import { useEffect, useCallback, Key } from "react";
import { ConnectionLineType } from '@xyflow/react';
import { ZoomSlider } from "@/components/zoom-slider";
import SearchControl from "./components/SearchControl";
import CustomNode from "@/components/CustomNode";
import FloatingEdge from '@/components/FloatingEdge';
import CustomConnectionLine from '@/components/CustomConnectionLine';
import { DownOutlined } from "@ant-design/icons";


// Define node types for React Flow
const nodeTypes = {
  custom: CustomNode,
};

// Define edge types for React Flow
const edgeTypes = {
  floating: FloatingEdge,
  buttonedge: CustomButtonEdge,
  smoothstep: SmoothStepEdge,
};

// Connection line style
const connectionLineStyle = {
  stroke: '#b1b1b7',
  strokeWidth: 2,
};

interface PositionUpdatePayload {
  id: string;
  position_x: number;
  position_y: number;
}

export default () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isPending: isLoading, error } = useStructure(id!);

  // Get parent ID safely, handling both object and number types
  const getParentId = () => {
    if (!data?.parent) return undefined;
    return typeof data.parent === 'object' ? data.parent.id : data.parent;
  };
  
  const parentId = getParentId();
  const { data: parentData, isPending: isParentLoading } = useStructureById(parentId?.toString());
  const { isPending: isAutoOrgLoading, mutate: autoOrg } = useAutoOrganize(id!);
  const { isPending: isBulkLoading, mutate: bulk } = useBulkUpdatePositions();
  const { mutate: updateDiagramPosition } = useUpdateDiagramPosition(id!);
  
  // Get diagram positions for the current structure with loading state
  const { 
    data: diagramPositions = [] as DiagramPosition[],
    isLoading: isLoadingPositions,
    isSuccess: hasPositions
  } = useDiagramPositions(id!);

  const {
    nodes,
    edges,
    setGraph,
    onNodesChange,
    onEdgesChange,
    updateNode,
    onConnect: handleConnect,
  } = useFlow();
  
  // Track if we have all the data needed to render the diagram
  const isDataReady = !!data && hasPositions && !isLoadingPositions;

  /* backend → React Flow nodes/edges */
  useEffect(() => {
    if (!isDataReady) {
      console.log('Waiting for data to be ready...');
      return;
    }
    
    console.log('Rendering diagram with data:', {
      structureId: data?.id,
      positionsCount: data?.positions?.length,
      diagramPositionsCount: diagramPositions?.length
    });

    // Ensure diagramPositions is an array before mapping
    const safeDiagramPositions = Array.isArray(diagramPositions) ? diagramPositions : [];
    
    // Create a map of diagram positions for quick lookup
    // Key format: 'type-id' for current diagram only
    const diagramPositionMap = new Map(
      safeDiagramPositions
        .filter((dp: DiagramPosition) => {
          // Skip if content_type is missing
          if (!dp.content_type) {
            console.warn('Missing content_type in diagram position:', dp);
            return false;
          }
          // Check if this position belongs to the current diagram
          return dp.main_structure.toString() === data.id.toString();
        })
        .map((dp: DiagramPosition) => {
          // Handle both string and object content_type formats
          let type = 'unknown';
          if (typeof dp.content_type === 'string') {
            type = dp.content_type.toLowerCase();
          } else if (typeof dp.content_type === 'object' && dp.content_type !== null) {
            type = (dp.content_type.model || '').toLowerCase();
          }
          
          return [
            `${type}-${dp.object_id}`,
            { x: dp.position_x, y: dp.position_y }
          ] as const;
        })
    );

    // Function to get position with fallback
    const getNodePosition = (type: string, id: string, defaultX: number = 0, defaultY: number = 0) => {
      // Only use positions from the current diagram
      const position = diagramPositionMap.get(`${type}-${id}`);
      return position || { x: defaultX, y: defaultY };
    };

    // Log manager and positions data for debugging
    const currentManagerId = typeof data.manager === 'number' ? data.manager : data.manager?.id;

    // Filter out positions that are managers of any structure (current or children)
    const positionNodes = (data.positions || [])
      .filter((p: Position) => {
        // Check if this position is the manager of the current structure
        const isCurrentManager = currentManagerId === p.id;
        
        // Check if this position is a manager of any child structure
        const isChildManager = data.children?.some((s: Structure) => {
          const childManagerId = typeof s.manager === 'number' ? s.manager : s.manager?.id;
          return childManagerId === p.id;
        }) || false;
        
        // Log filtering decision
        if (isCurrentManager || isChildManager) {
          console.log(`Filtering out position ${p.id} (${p.title}) - isCurrentManager: ${isCurrentManager}, isChildManager: ${isChildManager}`);
        }
        
        // Only include positions that are not managers of any structure
        return !(isCurrentManager || isChildManager);
      })
      .map((p: Position, index: number) => {
        const position = getNodePosition('position', p.id.toString(), index * 200, 100);
        
        return {
          type: 'custom',
          id: `position-${p.id}`,
          position,
          data: {
            position: p,
            type: 'position',
            data: p,
          },
        };
      });

    // Add parent structure node if exists
    const parentNode = parentData ? [{
      type: 'custom',
      id: `structure-${parentData.id}`,
      position: getNodePosition('structure', parentData.id.toString(), 0, 0),
      data: {
        position: { id: parentData.id, title: parentData.name, structure: parentData.id } as Position,
        type: 'structure',
        data: parentData,
      },
      style: { border: '2px solid #1890ff' } // Highlight parent node
    }] : [];

    // Add current structure node
    const currentStructureNode = {
      type: 'custom',
      id: `structure-${data.id}`,
      position: getNodePosition('structure', data.id.toString(), 200, 200),
      data: {
        position: { id: data.id, title: data.name, structure: data.id } as Position,
        type: 'structure',
        data: data,
      },
      style: { border: '2px solid #52c41a' } // Highlight current node
    };

    // Add child structure nodes
    const childStructureNodes = (data.children || []).map((s: Structure) => ({
      type: 'custom',
      id: `structure-${s.id}`,
      position: diagramPositionMap.get(`structure-${s.id}`) || { x: 0, y: 0 },
      data: {
        position: { id: s.id, title: s.name, structure: s.id } as Position,
        type: 'structure',
        data: s,
      },
    }));

    const allNodes = [...parentNode, currentStructureNode, ...positionNodes, ...childStructureNodes];

    // Create edges for parent-child relationships
    const parentEdges = parentData ? [{
      id: `edge-${parentData.id}-${data.id}`,
      source: `structure-${parentData.id}`,
      target: `structure-${data.id}`,
      type: 'buttonedge',  // Changed from 'smoothstep' to 'buttonedge' to enable deletion
      animated: true,
      style: { stroke: '#1890ff' },
      data: { 
        structureId: id,
        // Add metadata to identify this as a structure edge
        isStructureEdge: true,
        sourceId: parentData.id,
        targetId: data.id
      }
    }] : [];

    // Create edges for current structure's children
    const childEdges = (data.children || []).map((child: Structure) => ({
      id: `edge-${data.id}-${child.id}`,
      source: `structure-${data.id}`,
      target: `structure-${child.id}`,
      type: 'buttonedge',  // Changed from 'smoothstep' to 'buttonedge' to enable deletion
      data: { 
        structureId: id,
        // Add metadata to identify this as a structure edge
        isStructureEdge: true,
        sourceId: data.id,
        targetId: child.id
      },
    }));

    // Combine with existing edges (position edges)
    const positionEdges = (data.edges || []).map((e: OrganigramEdge) => ({
      id: String(e.id),
      source: `${e.source.type}-${e.source.id}`,
      target: `${e.target.type}-${e.target.id}`,
      type: 'buttonedge',
      data: { 
        structureId: id,
        // Add metadata to identify this as a position edge
        isPositionEdge: true
      },
    }));

    const allEdges = [
      ...parentEdges,
      ...childEdges,
      ...positionEdges
    ];

    console.log('Updating graph with:', {
      nodes: allNodes.length,
      edges: allEdges.length,
      firstNode: allNodes[0],
      firstEdge: allEdges[0]
    });
    
    setGraph(allNodes, allEdges);
  }, [data, diagramPositions, setGraph, isDataReady]);

  const handleBulkUpdate = async (positions: PositionUpdatePayload[]) => {
    try {
      await bulk(positions);
      message.success('Positions updated successfully');
    } catch (error) {
      message.error('Failed to update positions');
    }
  };

  const handleAutoOrganize = useCallback(async () => {
    try {
      await autoOrg();
      message.success('Organization completed successfully');
    } catch (error) {
      message.error('Failed to auto-organize');
    }
  }, [autoOrg]);

  const onNodeDragStop = useCallback(
    async (_: any, node: any) => {
      if (!data?.id) {
        console.error('No current structure ID available');
        return;
      }

      console.log('Node dragged:', { 
        nodeId: node.id, 
        position: node.position,
        currentStructureId: data.id
      });
      
      updateNode(node.id, node.position);
      
      // Extract ID and type from node ID (format: 'type-id')
      const [type, id] = node.id.split('-')
      
      if (type === 'position' && id) {
        try {
          console.log('Updating position node:', { 
            positionId: id, 
            position: node.position,
            mainStructureId: data.id
          });
          
          // Update diagram position for position node
          await updateDiagramPosition({
            contentObject: {
              id: parseInt(id),
              type: 'position'  // This will be used to look up the content type on the backend
            },
            main_structure: data.id,
            position: node.position
          });
          
          console.log('Successfully updated position node position');
        } catch (error) {
          console.error('Error updating position node position:', error);
          message.error('Failed to save position');
        }
      } else if (type === 'structure' && id) {
        try {
          console.log('Updating structure node position:', { 
            structureId: id, 
            position: node.position,
            mainStructureId: data.id
          });
          
          // Update diagram position for structure
          await updateDiagramPosition({
            contentObject: {
              id: parseInt(id),
              type: 'structure'  // This will be used to look up the content type on the backend
            },
            main_structure: data.id,
            position: node.position
          });
          
          console.log('Successfully updated structure position');
        } catch (error) {
          console.error('Error updating diagram position:', error);
          message.error('Failed to save position');
        }
      }
    },
    [updateNode, updateDiagramPosition, data?.id]
  );

  const { mutate: createEdge } = useCreateEdge(id!);

  const edgeTypes = {
    buttonedge: CustomButtonEdge,
    smoothstep: SmoothStepEdge,
    default: SmoothStepEdge,
  };

  const nodeTypes: NodeTypes = {
    custom: CustomNode as any, // Type assertion to handle the type mismatch
  };
  
  const connectionLineStyle = {
    stroke: '#b1b1b7',
    strokeWidth: 2,
  };

  const defaultEdgeOptions = {
    type: 'smoothstep',
    style: { stroke: '#b1b1b7', strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#b1b1b7',
    },
    interactionWidth: 20,
  };

  const onConnect = useCallback(
    (connection: Connection) => {
      const parseNodeId = (nodeId: string | null) => {
        if (!nodeId) return null;
        const [type, id] = nodeId.split('-');
        if (!type || !id) return null;
        return { type, id: Number(id) };
      };

      const sourceNodeInfo = parseNodeId(connection.source);
      const targetNodeInfo = parseNodeId(connection.target);

      if (!sourceNodeInfo || !targetNodeInfo) {
        console.error('Invalid connection:', connection);
        return;
      }

      createEdge(
        {
          structure: Number(id!),
          source: { type: sourceNodeInfo.type as any, id: sourceNodeInfo.id, name: '' },
          target: { type: targetNodeInfo.type as any, id: targetNodeInfo.id, name: '' },
          edge_type: 'buttonedge',
        },
        {
          onError: (error: any) => {
            console.error('Failed to create edge:', error);
            message.error(
              error.response?.data?.non_field_errors?.[0] ||
              error.response?.data?.detail ||
              'Failed to create connection'
            );
          },
        }
      );
    },
    [createEdge, id],
  );

  const { toggleCollapse } = useFlow();

  // Convert structure data to tree format
  const convertToTreeData = (structure: Structure | null): any => {
    if (!structure) return [];

    const treeNode = {
      title: (
        <span style={{ fontWeight: structure.id === data?.id ? 'bold' : 'normal' }}>
          {structure.name}
        </span>
      ),
      key: structure.id.toString(),
      isLeaf: !structure.children || structure.children.length === 0,
      children: structure.children?.map(convertToTreeData) || [],
    };

    return treeNode;
  };

  // Get the complete hierarchy including the main structure
  const getCompleteHierarchy = (structure: Structure | null) => {
    if (!structure) return [];
    
    // Check if parent exists and is a Structure object (not just an ID)
    const hasParentObject = structure.parent && typeof structure.parent === 'object';
    
    // If this structure has a parent object (not just an ID), we might want to include it
    // For now, we'll just show the current structure and its children
    // In a real app, you might want to fetch the full hierarchy
    return [convertToTreeData(structure)];
  };

  // Get tree data, handling undefined case
  const treeData = data ? getCompleteHierarchy(data) : [];

  // Handle tree node selection
  const handleNodeSelect = (selectedKeys: React.Key[]) => {
    if (selectedKeys.length > 0) {
      navigate(`/structures/${selectedKeys[0]}`);
    }
  };

  const handleShowParent = (parentId: string) => {
    navigate(`/structures/${parentId}`);
  };

  if (!data) {
    return (
      <PageContainer>
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div>Loading structure data...</div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      contentWidth="Fluid"
    >
      
      <Row gutter={16} >
      
        <Col span={24}>
          <div style={{ 
            height: 'calc(100vh - 130px)', 
            width: '100%', 
            border: '1px solid #f0f0f0', 
            borderRadius: 4,
            position: 'relative'
          }}>
            {!isDataReady ? (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                color: '#666',
                fontSize: '16px'
              }}>
                {isLoadingPositions ? 'Loading diagram positions...' : 'Preparing diagram...'}
              </div>
            ) : (
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeDragStop={onNodeDragStop}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                connectionLineComponent={CustomConnectionLine}
                fitView={true}
                fitViewOptions={{ 
                  padding: 0.5,  // Reduced padding for better fit
                  includeHiddenNodes: false,  // Only fit visible nodes
                  duration: 300  // Smooth transition
                }}
                connectionLineStyle={connectionLineStyle}
                connectionLineType={ConnectionLineType.SmoothStep}
                panOnDrag
                minZoom={0.1}
                maxZoom={2}
                defaultViewport={{ x: 0, y: 0, zoom: 0.9 }}  // Slightly zoomed out by default
                proOptions={{ hideAttribution: true }}
                nodesConnectable={true}
                elementsSelectable={true}
                nodesDraggable={true}
                zoomOnScroll={true}
                zoomOnPinch={true}
                panOnScroll={false}
                preventScrolling={true}
              >
              <Background />
              <Controls>
              </Controls>
              <Panel position="top-left">
              <Button
                  type="primary"
                  onClick={handleAutoOrganize}
                  loading={isAutoOrgLoading}
                  style={{ marginLeft: 8 }}
                >
                  Auto-Organize
                </Button>
              </Panel>
              <Panel position="top-right">
                <SearchControl />
              </Panel>
        
              </ReactFlow>
            )}
          </div>
        </Col>
      </Row>
    </PageContainer>
  );
};
