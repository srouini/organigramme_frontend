import { Modal } from 'antd';
import { ReactFlowProvider, Node, Edge } from '@xyflow/react';
import OrgChartView from './OrgChartView';

interface NodeDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  nodes: Node[];
  edges: Edge[];
}

const NodeDetailsModal = ({ visible, onClose, nodes, edges }: NodeDetailsModalProps) => {
  return (
    <Modal
      title="Node Details"
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
