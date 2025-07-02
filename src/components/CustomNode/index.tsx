import { Handle, Position, useReactFlow, Node, Edge } from '@xyflow/react';
import './custom-node.css';
import { Avatar, Badge, Button, Col, Flex, Row, Tag, Tooltip } from 'antd';
import type { FC, MouseEvent } from 'react';
import { useCallback, useMemo, useState } from 'react';
import { UserOutlined, ExpandAltOutlined } from '@ant-design/icons';
import PositionDetails from '@/pages/Positions/PositionDetails';
import NodeDetailsModal from '../NodeDetails/NodeDetailsModal';
import { calculateLayout } from '../NodeDetails/treeLayout';
import type { CustomNodeProps } from './types';



const CustomNode: FC<CustomNodeProps> = ({ data, id, selected }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { getNodes, getEdges } = useReactFlow();

  const findNodeAndChildren = useCallback((nodeId: string, allNodes: Node[], allEdges: Edge[]) => {
    return calculateLayout(nodeId, allNodes, allEdges);
  }, []);

  const { nodes: detailNodes, edges: detailEdges } = useMemo(() => {
    if (!showDetails) return { nodes: [], edges: [] };
    return findNodeAndChildren(id, getNodes(), getEdges());
  }, [id, showDetails, getNodes, getEdges, findNodeAndChildren]);

  const handleExpandClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDetails(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowDetails(false);
  }, []);

  const nodeStyles = useMemo(() => ({
    card: {
      minWidth: 200,
      minHeight: 100,
      maxWidth: 350,
      alignItems: 'center',
      justifyContent: 'center',
      display: 'flex',
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
      position: 'relative' as const,
    },
    tag: {
      backgroundColor: `${data.position?.grade?.color}20`,
      color: data.position?.grade?.color,
      border: `1px solid ${data.position?.grade?.color}40`,
    },
  }), [selected, isHovered, data.position?.grade?.color]);

  const renderNodeContent = () => (
    <div
      className="custom-node"
      style={nodeStyles.card}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Tooltip title="View details" placement="top">
        <Button
          type="default"
          icon={<ExpandAltOutlined />}
          onClick={handleExpandClick}
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '46px',
            zIndex: 10,
      
          }}
        />
      </Tooltip>
      <div role="button" tabIndex={0}>
        {!data?.position?.initial_node && (
          <Handle
            type="target"
            position={Position.Top}
            className="custom-handle"
          />
        )}
        <Row gutter={16}>
          <Col span={6}>
            <Flex justify="center" align="center" style={{ height: '100%' }}>
              <Badge count={data?.position?.quantity}>
                <Avatar 
                  shape="square" 
                  icon={<UserOutlined />} 
                  size={40} 
                  style={{ backgroundColor: data?.position?.grade?.color }}
                />
              </Badge>
            </Flex>
          </Col>
          <Col span={18} >
            <div style={{ textAlign: 'left', marginBottom: '8px', fontWeight: 500, color: '#333' }}>
              {data?.position?.title}
            </div>
            <Flex justify="left" align="start" style={{ height: '100%' }}>
            <Tag style={nodeStyles.tag}>
              {data?.position?.grade?.name}
            </Tag>
            </Flex>
          </Col>
        </Row>
        <Handle
          type="source"
          position={Position.Bottom}
          className="custom-handle"
        />
        <PositionDetails position={data?.position} node={true} />
      </div>
      
      <NodeDetailsModal
        visible={showDetails}
        onClose={handleCloseModal}
        nodes={detailNodes}
        edges={detailEdges}
      />
    </div>
  );

  if (data?.position?.abbreviation) {
    return (
      <Badge.Ribbon 
        text={data.position.abbreviation} 
        color={data.position.grade?.color}
      >
        {renderNodeContent()}
      </Badge.Ribbon>
    );
  }

  return renderNodeContent();
};

export default CustomNode;