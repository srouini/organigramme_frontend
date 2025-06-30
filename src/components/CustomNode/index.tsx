import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Avatar, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './styles.css';

const { Text } = Typography;

// Define the shape of our custom node data
type NodeData = {
  label: string;
  grade?: string;
  avatar?: string;
};

// Export the type for use in other components
export type CustomNodeData = NodeData;

// Props for our custom node component
type CustomNodeProps = {
  data: NodeData;
  selected?: boolean;
  style?: React.CSSProperties;
};

const CustomNode = ({
  data,
  selected = false,
  style,
}: CustomNodeProps) => {
  // Ensure we have data and provide defaults
  const nodeData = data || { label: 'Unnamed' };
  
  return (
    <div 
      className={`custom-node ${selected ? 'selected' : ''}`}
      style={style}
    >
      <div className="node-content">
        <div className="avatar-container">
          {nodeData.avatar ? (
            <Avatar size="large" src={nodeData.avatar} />
          ) : (
            <Avatar size="large" icon={<UserOutlined />} />
          )}
          {nodeData.grade && (
            <Text type="secondary" className="grade">
              {nodeData.grade}
            </Text>
          )}
        </div>
        <div className="label">
          <Text strong>{nodeData.label}</Text>
        </div>
      </div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default memo(CustomNode);
