import { PageContainer } from "@ant-design/pro-components";

import { API_ORGANIGRAMMES_ENDPOINT } from "@/api/api";
import type { Connection } from 'reactflow';
import { addEdge } from 'reactflow';
import CustomButtonEdge from "@/components/ButtonEdge";
import Export from "./components/Export";
import { useCreateEdge } from '@/hooks/useOrganigram' 
import { ReactFlow, Background, Controls } from "@xyflow/react";
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

export default () => {
  const { id } = useParams<{ id: string }>();
  const { data } = useOrganigram(id!);
  const autoOrg = useAutoOrganize(id!);
  const bulk = useBulkUpdatePositions();

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
        id: String(p.id),
        position: { x: p.position_x, y: p.position_y },
        data: { label: p.title },
        style: { background: p.color },

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
      updateNode(node.id, node.position);
      await bulk.mutateAsync([{ id: node.id, ...node.position }]);
    },
    [bulk, updateNode]
  );

  const { mutate: createEdge } = useCreateEdge()

  const edgeTypes = {
    buttonedge: CustomButtonEdge,
  };

  
  const onConnect = useCallback(
  (conn: Connection) => {
    createEdge(
      {
        organigram: id!,              // current chart
        source: conn.source!,         // parent node id
        target: conn.target!,         // child node id
        edge_type:"buttonedge"
      },
      {
        onSuccess: () => {
          // only add to local state *after* the DB succeeds
          setGraph(nodes, addEdge(conn, edges))
        },
        onError: (e: any) =>
          message.error(
            e.response?.data?.non_field_errors?.[0] ||
              e.response?.data?.detail ||
              'Link rejected',
          ),
      },
    )
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
          <Export
            endpoint={API_ORGANIGRAMMES_ENDPOINT}
            expand="type_tc,current_scelle,article.gros,charge_chargement"
            key="ALLCONTAINERS"
          />,
          <Button
            type="primary"
            onClick={() =>
              autoOrg
                .mutateAsync()
                .then(() => message.success("Auto-organised!"))
            }
            loading={autoOrg.isLoading}
          >
            Auto-organise
          </Button>,
        ],
      }}
    >
      <div style={{ height: "80dvh", width: "100%" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          edgeTypes={edgeTypes}
          onConnect={onConnect}
          onNodeDragStop={onDragStop}
          fitView={true}
          onNodeDoubleClick={(e, node) => toggleCollapse(node.id)}
        >
          <Background />
          <Controls />
          <ZoomSlider position="top-left"/>
        </ReactFlow>
      </div>
    </PageContainer>
  );
};
