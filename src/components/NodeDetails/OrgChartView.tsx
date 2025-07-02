import { Suspense, lazy, useEffect } from 'react';
import { ReactFlow, Node, Edge, useReactFlow } from '@xyflow/react';
import CustomButtonEdge from '../ButtonEdge';
import { nodeTypes } from '../CustomNode/nodeTypes';

type OrgChartViewProps = {
  nodes: Node[];
  edges: Edge[];
};

const edgeTypes = {
  buttonedge: CustomButtonEdge,
};

const LoadingFallback = () => <div>Loading...</div>;

const defaultEdgeOptions = {
  type: 'smoothstep',
  style: { stroke: '#b1b1b7', strokeWidth: 2 },
};

const OrgChartView = ({ nodes, edges }: OrgChartViewProps) => {
  const { fitView } = useReactFlow();

  // Auto-layout when nodes change
  useEffect(() => {
    const timer = setTimeout(() => {
      fitView({ padding: 0.2, duration: 200 });
    }, 10);

    return () => clearTimeout(timer);
  }, [nodes, edges, fitView]);

  return (
    <Suspense fallback={<LoadingFallback />}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        fitViewOptions={{ 
          padding: 0.2,
          includeHiddenNodes: false,
          duration: 200
        }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnScroll
        zoomOnScroll
        zoomOnPinch
        panOnDrag
        proOptions={{ hideAttribution: true }}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
      />
    </Suspense>
  );
};

export default OrgChartView;
