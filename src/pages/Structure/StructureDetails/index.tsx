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
  useLazyStructureById, // Import the new hook
  DiagramPosition,
} from "@/hooks/useStructure";
import { Position, Structure, OrganigramEdge } from "@/types/reference";
import { useFlow } from "@/context/FlowContext";
import { useEffect, useCallback, Key, useState } from "react";
import { ConnectionLineType } from '@xyflow/react';
import { ZoomSlider } from "@/components/zoom-slider";
import SearchControl from "./components/SearchControl";
import CustomNode from "@/components/CustomNode";
import FloatingEdge from '@/components/FloatingEdge';
import CustomConnectionLine from '@/components/CustomConnectionLine';


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
  const [displayLevel, setDisplayLevel] = useState(1);
  const { data, isPending: isLoading, error } = useStructure(id!);


  const { isPending: isAutoOrgLoading, mutate: autoOrg } = useAutoOrganize(id!);
  const { isPending: isBulkLoading, mutate: bulk } = useBulkUpdatePositions();
  const { mutate: updateDiagramPosition } = useUpdateDiagramPosition(id!); 
  const [organigramData, setOrganigramData] = useState<Structure | null>(null);
  const [structuresToFetch, setStructuresToFetch] = useState<Set<string>>(new Set());
  const { refetch: fetchStructureById } = useLazyStructureById();
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

  // Effect to initialize the main organigram data
  useEffect(() => {
    if (data && !organigramData) {
      setOrganigramData(data);
    }
  }, [data, organigramData]);

  // Effect to fetch structures that are needed for display
  useEffect(() => {
    if (structuresToFetch.size === 0) return;

    const fetchAll = async () => {
      const fetchedStructures = await Promise.all(
        Array.from(structuresToFetch).map(id => fetchStructureById(id).catch(e => {
          console.error(`Failed to fetch structure ${id}`, e);
          return null; // Return null on error to not break Promise.all
        }))
      );

      const validStructures = fetchedStructures.filter((s): s is Structure => s !== null);

      if (validStructures.length > 0) {
        setOrganigramData(currentData => {
          if (!currentData) return null;

          let updatedData = { ...currentData };

          const replaceChildRecursive = (structures: Structure[], newChild: Structure): Structure[] => {
            return structures.map(s => {
              if (s.id === newChild.id) {
                return newChild;
              }
              if (s.children) {
                return { ...s, children: replaceChildRecursive(s.children, newChild) };
              }
              return s;
            });
          };

          validStructures.forEach(fs => {
            const newChildren = replaceChildRecursive(updatedData.children || [], fs);
            updatedData = { ...updatedData, children: newChildren };
          });

          return updatedData;
        });
      }

      setStructuresToFetch(new Set()); // Clear the set after fetching
    };

    fetchAll();
  }, [structuresToFetch, fetchStructureById]);

  /* backend → React Flow nodes/edges */
  useEffect(() => {
    if (!isDataReady) {
      console.log('Waiting for data to be ready...');
      return;
    }

    const safeDiagramPositions = Array.isArray(diagramPositions) ? diagramPositions : [];
    const diagramPositionMap = new Map(
      safeDiagramPositions
        .filter((dp: DiagramPosition) => {
          if (!dp.content_type) {
            console.warn('Missing content_type in diagram position:', dp);
            return false;
          }
          return dp.main_structure.toString() === data.id.toString();
        })
        .map((dp: DiagramPosition) => {
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

    const getNodePosition = (type: string, id: string, defaultX: number = 0, defaultY: number = 0) => {
      const position = diagramPositionMap.get(`${type}-${id}`);
      return position || { x: defaultX, y: defaultY };
    };

    const getNodesAndEdgesByLevel = (rootStructure: Structure, maxLevel: number) => {
      const nodes: any[] = [];
      const edges: any[] = [];
      const visited = new Set<string>();
      const missingStructures = new Set<string>();

      function traverse(structure: Structure, level: number) {

        if (!structure || level > maxLevel || visited.has(`structure-${structure.id}`)) {
          return;
        }

        visited.add(`structure-${structure.id}`);



        const structurePosition = getNodePosition('structure', structure.id.toString());

        nodes.push({
          type: 'custom',
          id: `structure-${structure.id}`,
          position: structurePosition,
          data: {
            position: { id: structure.id, title: structure.name, structure: structure.id } as Position,
            type: 'structure',
            data: structure,
          },
          style: level === 1 ? { border: '2px solid #52c41a' } : {},
        });

        const currentManagerId = typeof structure.manager === 'number' ? structure.manager : structure.manager?.id;
        const positionNodes = (structure.positions || [])
          .filter(p => {
            const isCurrentManager = currentManagerId === p.id;
            const isChildManager = structure.children?.some(s => (typeof s.manager === 'number' ? s.manager : s.manager?.id) === p.id) || false;
            return !(isCurrentManager || isChildManager);
          })
          .map((p: Position, index: number) => ({
            type: 'custom',
            id: `position-${p.id}`,
            position: getNodePosition('position', p.id.toString(), structurePosition.x + (index * 200), structurePosition.y + 100),
            data: { position: p, type: 'position', data: p },
          }));
        nodes.push(...positionNodes);

        positionNodes.forEach(pNode => {
          edges.push({
            id: `edge-struct-${structure.id}-pos-${pNode.data.position.id}`,
            source: `structure-${structure.id}`,
            target: pNode.id,
            type: 'smoothstep',
          });
        });

        const positionEdges = (structure.edges || []).map((e: OrganigramEdge) => ({
          id: String(e.id),
          source: `${e.source.type}-${e.source.id}`,
          target: `${e.target.type}-${e.target.id}`,
          type: 'buttonedge',
          data: { structureId: id, isPositionEdge: true },
        }));
        edges.push(...positionEdges);

        if (level < maxLevel) {
          (structure.children || []).forEach(child => {
            edges.push({
              id: `edge-${structure.id}-${child.id}`,
              source: `structure-${structure.id}`,
              target: `structure-${child.id}`,
              type: 'buttonedge',
              data: { structureId: id, isStructureEdge: true, sourceId: structure.id, targetId: child.id },
            });

            // If a child is just a reference (e.g., no 'name' or 'positions'), it needs to be fetched.
            if (!child.name || !child.positions) {
              missingStructures.add(child.id.toString());
            } else {
              traverse(child, level + 1);
            }
          });
        }
      }

      if (rootStructure) {
        traverse(rootStructure, 1);
      }

      if (missingStructures.size > 0) {
        setStructuresToFetch(missingStructures);
      }

      return { nodes, edges };
    };

    if (!organigramData) {
      return; // Don't render until the main data is ready
    }

    const { nodes: structureNodes, edges: structureEdges } = getNodesAndEdgesByLevel(organigramData, displayLevel);

    const allNodes = [...structureNodes];
    const allEdges = [...structureEdges];

    console.log('Updating graph with:', {
      nodes: allNodes.length,
      edges: allEdges.length,
      displayLevel,
    });
    
    setGraph(allNodes, allEdges);
  }, [organigramData, diagramPositions, displayLevel]);


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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                      <Button onClick={() => setDisplayLevel(l => l + 1)}>+ Level</Button>
                      <Button onClick={() => setDisplayLevel(l => Math.max(1, l - 1))}>− Level</Button>
                      <SearchControl />
                  </div>
             
                  
                </div>
              </Panel>
        
              </ReactFlow>
            )}
          </div>
        </Col>
      </Row>
    </PageContainer>
  );
};
