import { Modal } from 'antd';
import { ReactFlowProvider, Node, Edge, ReactFlow, useReactFlow } from '@xyflow/react';
import CustomNode from '../CustomNode';
import CustomButtonEdge from '../ButtonEdge';
import { useEffect } from 'react';

// Helper component to handle the layout
const AutoLayout = () => {
  const { fitView } = useReactFlow();

  useEffect(() => {
    // Use requestAnimationFrame to ensure the nodes are rendered
    const timer = setTimeout(() => {
      fitView({ padding: 0.2, duration: 200 });
    }, 10);

    return () => clearTimeout(timer);
  }, [fitView]);

  return null;
};

interface NodeDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  nodes: Node[];
  edges: Edge[];
  nodeTypes?: any;
  edgeTypes?: any;
  defaultEdgeOptions?: any;
}

export default function NodeDetailsModal({
  visible,
  onClose,
  nodes,
  edges,
  nodeTypes = { custom: CustomNode },
  edgeTypes = { buttonedge: CustomButtonEdge },
  defaultEdgeOptions = {
    type: 'smoothstep',
    style: { stroke: '#b1b1b7', strokeWidth: 2 },
  },
}: NodeDetailsModalProps) {
  return (
    <Modal
      title="Node Details"
      open={visible}
      onCancel={onClose}
      footer={null}
      width="80%"
      style={{ top: 20 }}
      bodyStyle={{ height: '80vh' }}
    >
      <div style={{ width: '100%', height: '100%' }}>
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            defaultEdgeOptions={defaultEdgeOptions}
            fitView
            fitViewOptions={{ 
              padding: 0.5, 
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
          >
            <AutoLayout />
          </ReactFlow>
        </ReactFlowProvider>
      </div>
    </Modal>
  );
}
