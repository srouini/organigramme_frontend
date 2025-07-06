import { PageContainer } from "@ant-design/pro-components";

import { API_ORGANIGRAMMES_ENDPOINT } from "@/api/api";
import type { Connection } from 'reactflow';
import { addEdge, MarkerType, NodeTypes, Edge, SmoothStepEdge } from '@xyflow/react';
import CustomButtonEdge from "@/components/ButtonEdge";
import Export from "./components/Export";
import { useCreateEdge } from '@/hooks/useOrganigram' 
import { ReactFlow, Background, Controls, Panel } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Button, message } from "antd";
import { useParams } from "react-router-dom";
import {
  useOrganigram,
  useAutoOrganize,
  useBulkUpdatePositions,
} from "@/hooks/useOrganigram";
import { useFlow } from "@/context/FlowContext";
import { useEffect, useCallback } from "react";
import { ZoomSlider } from "@/components/zoom-slider";
import SearchControl from "./components/SearchControl";
import CustomNode from "@/components/CustomNode";
import FloatingEdge from '@/components/FloatingEdge';
import CustomConnectionLine from '@/components/CustomConnectionLine';

interface PositionUpdatePayload {
  id: string;
  position_x: number;
  position_y: number;
}

export default () => {
  const { id } = useParams<{ id: string }>();
  const { data, isPending: isLoading, error } = useOrganigram(id!);
  const { isPending: isAutoOrgLoading, mutate: autoOrg } = useAutoOrganize(id!);
  const { isPending: isBulkLoading, mutate: bulk } = useBulkUpdatePositions();

  const {
    nodes,
    edges,
    setGraph,
    onNodesChange,
    onEdgesChange,
    updateNode,
  } = useFlow();

  /* backend → React Flow nodes/edges */
  useEffect(() => {
    if (!data) return;
    setGraph(
      data.positions.map((p: any) => ({
        type: 'custom',
        id: String(p.id),
        position: { x: p.position_x, y: p.position_y },
        data: { 
          position:p,
        },
        style: { 
          // Styles are now handled by the CustomNode component
        },
      })),
      data.edges.map((e: any) => ({
        id: String(e.id),
        source: String(e.source),
        target: String(e.target),
        type: "buttonedge",
        data: { organigramId: id },
      }))
    );
  }, [data?.edges, data?.positions, setGraph]);

  const onDragStop = useCallback(
    async (_: any, node: any) => {
      const handleBulkUpdate = async (positions: PositionUpdatePayload[]) => {
        try {
          await bulk(positions);
          message.success('Positions updated successfully');
        } catch (error) {
          message.error('Failed to update positions');
        }
      };
      updateNode(node.id, node.position);
      await handleBulkUpdate([{ id: node.id, ...node.position }]);
    },
    [bulk, updateNode]
  );

  const { mutate: createEdge } = useCreateEdge()

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
      const source = connection.source || '';
      const target = connection.target || '';
      
      if (!source || !target) {
        console.error('Missing source or target in connection:', connection);
        return;
      }

      // Create the edge via API
      createEdge(
        {
          organigram: id!,
          source,
          target,
          edge_type: "buttonedge"
        },
        {
          onSuccess: (edgeResponse: Edge) => {
            try {
              console.log('Edge created:', edgeResponse);
              
              if (!edgeResponse?.id) {
                console.error('Invalid edge response - missing ID:', edgeResponse);
                throw new Error('Invalid edge response from server - missing ID');
              }
              
              // Create the new edge with the data from the server
              const newEdge: Edge = {
                id: edgeResponse.id,
                source: edgeResponse.source,
                target: edgeResponse.target,
                sourceHandle: connection.sourceHandle || undefined,
                targetHandle: connection.targetHandle || undefined,
                type: 'smoothstep',
                data: { 
                  organigramId: id,
                },
                style: { 
                  stroke: '#b1b1b7',
                  strokeWidth: 2,
                },
                markerEnd: {
                  type: MarkerType.ArrowClosed,
                  color: '#b1b1b7',
                },
              };
              
              // Add the new edge to the graph
              setGraph(nodes, [...edges, newEdge]);
              
              console.log('Edge created successfully:', newEdge);
            } catch (error) {
              console.error('Error processing edge creation:', error);
              message.error('Failed to process the created connection');
            }
          },
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
    [createEdge, id, nodes, edges, setGraph],
  )

  const { toggleCollapse } = useFlow()



  return (
    <PageContainer
      contentWidth="Fluid"
      header={{
        title: "Organigrammes",
        extra: [

          <Button
            type="primary"
            onClick={async () => {
              const handleAutoOrganize = async () => {
                try {
                  await autoOrg();
                  message.success('Organization completed successfully');
                } catch (error) {
                  message.error('Failed to auto-organize');
                }
              };
              await handleAutoOrganize();
            }}
            loading={isAutoOrgLoading}
            disabled={isLoading || isBulkLoading}
          >
            Auto-organise
          </Button>,
        ],
      }}
    >
      <div style={{ height: 'calc(100vh - 200px)', width: '100%' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeDragStop={onDragStop}
          onNodeDoubleClick={(e, node) => toggleCollapse(node.id)}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          connectionLineComponent={CustomConnectionLine}
          connectionLineStyle={connectionLineStyle}
          nodesDraggable
          nodesConnectable
          elementsSelectable
          panOnScroll
          zoomOnScroll
          zoomOnPinch
          panOnDrag
          fitView
          minZoom={0.1}  // Allow zooming out more for large organigrams
          maxZoom={2}    // Limit maximum zoom to prevent pixelation
          fitViewOptions={{ 
            padding: 0.2,  // Reduce padding to fit more content
            includeHiddenNodes: false,
            duration: 250  // Smoother transition
          }}
        >
          <Background />
          <Controls />
          <ZoomSlider />
          <Panel position="top-right">
            <SearchControl />
          </Panel>
        </ReactFlow>
      </div>
    </PageContainer>
  );
};
