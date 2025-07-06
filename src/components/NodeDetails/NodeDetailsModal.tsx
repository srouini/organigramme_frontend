import { Modal } from 'antd';
import { ReactFlowProvider, Node, Edge } from '@xyflow/react';
import OrgChartView from './OrgChartView';

interface NodeDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  nodes: Node[];
  edges: Edge[];
  title: string;
}

const NodeDetailsModal = ({ visible, onClose, nodes, edges, title }: NodeDetailsModalProps) => {
  return (
    <Modal
      title={title}
      open={visible}
      onCancel={onClose}
      footer={null}
      width="90%"
      style={{ top: 20 }}
      bodyStyle={{ height: '80vh' }}
    >
      <div style={{ width: '100%', height: '100%' }}>
        <ReactFlowProvider>
          <OrgChartView nodes={nodes} edges={edges} />
        </ReactFlowProvider>
      </div>
    </Modal>
  );
};

export default NodeDetailsModal;
