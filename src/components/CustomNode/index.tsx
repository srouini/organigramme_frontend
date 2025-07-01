import { Handle, Position, useReactFlow } from '@xyflow/react';
import './custom-node.css';
import { Avatar, Badge, Col, Flex, Row, Tag } from 'antd';
import { Position as PositionType } from '@/types/reference';
import { useCallback, useMemo, useState } from 'react';
import { UserOutlined } from '@ant-design/icons';

interface CustomNodeProps {
  data: {
    position: PositionType;
    [key: string]: any;
  };
  id: string;
  selected?: boolean;
}

export default function CustomNode({ data, id, selected }: CustomNodeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { setNodes } = useReactFlow();

  const nodeStyles = useMemo(() => ({
    card: {
      minWidth: 200,
      maxWidth: 350,
      backgroundColor: 'white',
      borderColor: selected ? '#1890ff' : '#d9d9d9',
      borderWidth: selected ? 2 : 1,
      borderRadius: '8px',
      padding: '16px',
      paddingX: '0px',
      boxShadow: selected
        ? '0 4px 12px rgba(24, 144, 255, 0.3)'
        : isHovered
          ? '0 6px 16px rgba(0, 0, 0, 0.1)'
          : 'none',
      transform: isHovered ? 'translateY(-2px)' : 'none',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
    },
    tag: {
      backgroundColor: `${data.position?.grade?.color}20`,
      color: data.position?.grade?.color,
      border: `1px solid ${data.position?.grade?.color}40`,
    },
  }), [selected, isHovered, data.position?.grade?.color]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  return (
    <div
      className="custom-node"
      style={nodeStyles.card}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="custom-handle"

      />
      <Row gutter={16}>
        <Col span={6}>
        <Flex justify="center" align="center" style={{height: '100%'}}>
          <Badge count={data?.position?.quantity} >
            <Avatar shape="square" icon={<UserOutlined />} size={40} style={{backgroundColor: data?.position?.grade?.color}}/>
          </Badge>
        </Flex>
        </Col>
        <Col span={18}>
        <Row>
          <div style={{textAlign: 'left', marginBottom: '8px', fontWeight: 500, color: '#333' }}>
            {data?.position?.title}
          </div>
          <Tag
            style={nodeStyles.tag}
          >
            {data?.position?.grade?.name}
          </Tag>
        </Row>
        </Col>
      </Row>
     
      <Handle
        type="source"
        position={Position.Bottom}
        className="custom-handle"
      />
    </div>
  );
}