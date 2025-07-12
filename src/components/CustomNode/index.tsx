import { Handle, Position as HandlePosition, useReactFlow, Node, Edge } from '@xyflow/react';
import './custom-node.css';
import { Avatar, Badge, Button, Col, Flex, Row, Tag, Tooltip, Typography } from 'antd';
import type { FC } from 'react';
import { useCallback, useMemo, useState } from 'react';
import { UserOutlined, ExpandAltOutlined, ApartmentOutlined } from '@ant-design/icons';
import PositionDetails from '@/pages/Positions/PositionDetails';
import NodeDetailsModal from '../NodeDetails/NodeDetailsModal';
import { calculateLayout } from '../NodeDetails/treeLayout';
import type { CustomNodeProps } from './types';
import { Position, Structure } from '@/types/reference';

const { Title } = Typography;

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

  const baseCardStyle = useMemo(() => ({
    minWidth: 200,
    minHeight: 100,
    maxWidth: 350,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    borderWidth: data.isHighlighted || selected ? 2 : 1,
    borderRadius: '8px',
    padding: '16px',
    boxShadow: data.isHighlighted
      ? '0 4px 12px rgba(255, 77, 79, 0.5)'
      : selected
      ? '0 4px 12px rgba(24, 144, 255, 0.3)'
      : isHovered
      ? '0 6px 16px rgba(0, 0, 0, 0.1)'
      : 'none',
    transform: isHovered ? 'translateY(-2px)' : 'none',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    position: 'relative' as const,
  }), [selected, isHovered, data.isHighlighted]);

  const renderPositionNode = (position: Position) => {
    const positionNodeStyles = {
      card: {
        ...baseCardStyle,
        backgroundColor: 'white',
        borderColor: data.isHighlighted ? '#ff4d4f' : (selected ? '#1890ff' : '#d9d9d9'),
      },
      tag: {
        backgroundColor: `${position.grade?.color}20`,
        color: position.grade?.color,
        border: `1px solid ${position.grade?.color}40`,
      },
    };

    const modalTitle = position.initial_node ? `Initial Position: ${position.title}` : position.title;

    const content = (
      <div
        className="custom-node"
        style={positionNodeStyles.card}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Tooltip title="View details" placement="top">
          <Button
            type="default"
            icon={<ExpandAltOutlined />}
            onClick={handleExpandClick}
            style={{ position: 'absolute', bottom: '10px', right: '46px', zIndex: 10 }}
          />
        </Tooltip>
        <div role="button" tabIndex={0}>
          {!position.initial_node && (
            <Handle type="target" position={HandlePosition.Top} className="custom-handle" />
          )}
          <Row gutter={16}>
            <Col span={6}>
              <Flex justify="center" align="center" style={{ height: '100%' }}>
                <Badge count={position.quantity}>
                  <Avatar shape="square" icon={<UserOutlined />} size={40} style={{ backgroundColor: position.grade?.color }} />
                </Badge>
              </Flex>
            </Col>
            <Col span={18}>
              <div style={{ textAlign: 'left', marginBottom: '8px', fontWeight: 500, color: '#333' }}>
                {position.title}
              </div>
              <Flex justify="left" align="start" style={{ height: '100%' }}>
                <Tag style={positionNodeStyles.tag}>{position.grade?.name}</Tag>
              </Flex>
            </Col>
          </Row>
          <Handle type="source" position={HandlePosition.Bottom} className="custom-handle" />
          <PositionDetails position={position} node={true} />
        </div>
        <NodeDetailsModal visible={showDetails} onClose={handleCloseModal} nodes={detailNodes} edges={detailEdges} title={modalTitle} />
      </div>
    );

    if (position.abbreviation) {
      return <Badge.Ribbon text={position.abbreviation} color={position.grade?.color}>{content}</Badge.Ribbon>;
    }
    return content;
  };

  const renderStructureNode = (structure: Structure) => {
    const structureNodeStyles = {
      card: {
        ...baseCardStyle,
        backgroundColor: '#f0f2f5',
        borderColor: data.isHighlighted ? '#ff4d4f' : (selected ? '#1890ff' : '#d9d9d9'),
        flexDirection: 'column' as const,
      },
    };

    return (
      <div
        className="custom-node"
        style={structureNodeStyles.card}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Handle type="target" position={HandlePosition.Top} className="custom-handle" />
        <ApartmentOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
        <Title level={5} style={{ marginTop: '8px', textAlign: 'center' }}>{structure.name}</Title>
        <Handle type="source" position={HandlePosition.Bottom} className="custom-handle" />
      </div>
    );
  };

  if (data.type === 'position') {
    return renderPositionNode(data.data as Position);
  }

  if (data.type === 'structure') {
    return renderStructureNode(data.data as Structure);
  }

  return null;
};

export default CustomNode;