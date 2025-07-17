import { Handle, Position as HandlePosition, useReactFlow, Node, Edge, Position } from '@xyflow/react';
import './custom-node.css';
import { Avatar, Badge, Button, Col, Flex, Row, Tag, Tooltip, Typography } from 'antd';
import type { FC } from 'react';
import { useCallback, useMemo, useState } from 'react';
import { UserOutlined, ExpandAltOutlined, ApartmentOutlined, ApiOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PositionDetails from '@/pages/Positions/PositionDetails';
import NodeDetailsModal from '../NodeDetails/NodeDetailsModal';
import { calculateLayout } from '../NodeDetails/treeLayout';
import type { CustomNodeProps } from './types';
import { PositionType, Structure } from '@/types/reference';
import AddConnexion from './AddConnexion';
import { Background } from 'reactflow';
import { WrapText } from 'lucide-react';
import AUForm from '@/pages/Positions/components/AUForm';
import { useReferenceContext } from '@/context/ReferenceContext';
import RemovePositionEdge from './RemovePositionEdge';

const { Title } = Typography;

const CustomNode: FC<CustomNodeProps> = ({ data, id, selected }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { getNodes, getEdges } = useReactFlow();
  const navigate = useNavigate();

  const { structures } = useReferenceContext();


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

  const renderPositionNode = (position: PositionType) => {
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
        fontSize: '15px',
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

        <div role="button" tabIndex={0}>
          {!position.initial_node && (
            <Handle type="target" position={HandlePosition.Top} className="custom-handle" />
          )}
          <Row gutter={16} wrap={false}>
            <Col>
              <Flex justify="center" align="center" style={{ height: '100%' }}>
                <Badge count={position.quantity}>
                  <Avatar shape="square" icon={<UserOutlined />} size={40} style={{ backgroundColor: position.grade?.color }} />
                </Badge>
              </Flex>
            </Col>
            <Col style={{ marginLeft: "8px", display: 'flex', flexDirection: 'column', alignItems: 'start', justifyContent: 'center' }}>
              <div style={{ textAlign: 'left', marginBottom: '8px', fontWeight: 500, color: '#333', fontSize: '20px' }}>
                {position.title}
              </div>
              <Flex justify="left" align="start">
                <Tag style={positionNodeStyles.tag}>{position.grade?.name}</Tag>
              </Flex>
            </Col>
            <Col>
            
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                {/* <Tooltip title="View details" placement="top">
                  <Button
                    type="default"
                    icon={<ExpandAltOutlined />}
                    onClick={handleExpandClick}
                  />
                </Tooltip> */}
                <RemovePositionEdge position={position} />
                <PositionDetails position={position} node={true} />
              </div>
            </Col>
          </Row>
          <NodeDetailsModal visible={showDetails} onClose={handleCloseModal} nodes={detailNodes} edges={detailEdges} title={modalTitle} />

          <Handle type="source" position={HandlePosition.Bottom} className="custom-handle" />
        </div>
      </div>
    );

    if (position.abbreviation) {
      return <Badge.Ribbon text={position.abbreviation} color={position.grade?.color}>{content}</Badge.Ribbon>;
    }
    return content;
  };


  const renderStructureNode = (structure: Structure) => {
    const managerGradeColor = structure.manager?.grade?.color || '#1890ff';

    const structureNodeStyles = {
      card: {
        ...baseCardStyle,
        backgroundColor: '#f0f2f5',
        borderColor: data.isHighlighted ? '#ff4d4f' : (selected ? '#1890ff' : '#d9d9d9'),
        flexDirection: 'column' as const,
        padding: '16px 12px',
        minWidth: '400px',
        position: 'relative' as const,
      },
      managerContainer: {
        marginTop: '12px',
        padding: '10px 10px 10px 10px',
        backgroundColor: 'white',
        minWidth: '100%',
        borderRadius: '6px',
        borderLeft: `3px solid ${managerGradeColor}`,
        position: 'relative' as const,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: '#f9f9f9',
          '&::after': {
            backgroundColor: '#f0f0f0',
          },
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '30px',
          borderTopRightRadius: '6px',
          borderBottomRightRadius: '6px',
          transition: 'background-color 0.2s ease',
        },
      },
      managerHeader: {
        display: 'flex',
        justifyContent: 'space-between',
      },
      managerContent: {
        display: 'flex',
        flexWrap: 'nowrap' as const,
        justifyContent: 'space-between',
        gap: '15px',
      },
      managerName: {
        fontSize: '20px',
        fontWeight: 500,
        color: '#333',
        marginBottom: '4px',
        textAlign: 'left' as const,
      },
      gradeBadge: {
        backgroundColor: `${managerGradeColor}20`,
        color: managerGradeColor,
        border: `1px solid ${managerGradeColor}40`,
        borderRadius: '4px',
        padding: '0 6px',
        fontSize: '18px',
        fontWeight: 500,
        display: 'inline-block',
        textAlign: 'left' as const,
        whiteSpace: 'nowrap',
      },
      detailsButton: {
        position: 'absolute' as const,
        bottom: '4px',
        right: '4px',
        background: 'transparent',
        border: 'none',
        padding: '2px',
        cursor: 'pointer',
        color: '#666',
        '&:hover': {
          color: '#1890ff',
        },
      },
    };

    return (
      <div
        className="custom-node"
        style={structureNodeStyles.card}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onDoubleClick={() => {
          if (data.type === 'structure') {
            const structure = data.data as Structure;
            navigate(`/structures/${structure.id}`);
          }
        }}
      >
        {/* Top handle for incoming connections */}
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
          <Handle
            type="target"
            position={HandlePosition.Top}
            className="custom-handle"
            style={{ position: 'relative', top: '-5px' }}
          />
        </div>


        {/* Main content */}
        <div style={{ pointerEvents: 'none' }}>
          <Tag color={structure?.type?.color} style={{
            position: 'absolute',
            top: '50%',
            left: '0',
            zIndex: 10,
            transform: 'rotate(90deg) translate(-50%, -50%)',
            transformOrigin: 'left top'
          }}> {structure?.type?.name} </Tag>
          <ApartmentOutlined style={{ fontSize: '40px', color: structure?.type?.color }} />
          <Title level={5} style={{ margin: '8px 0', textAlign: 'center',fontSize:'20pt' }}>{structure.name}</Title>
        </div>

        {structure.manager && (
          <div style={{ ...structureNodeStyles.managerContainer, pointerEvents: 'none' }}>
            <div style={structureNodeStyles.managerContent}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={structureNodeStyles.managerName}>
                  {structure.manager.title}
                </div>

                {structure.manager.grade && (
                  <div style={structureNodeStyles.gradeBadge}>
                    {structure.manager.grade.name}
                  </div>
                )}

              </div>
              <div style={{ pointerEvents: 'auto', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '30px' }}>
                <PositionDetails position={structure.manager} node={true} />
              </div>
            </div>
          </div>
        )}

        <AddConnexion source={data.data as Structure} />

        {/* Bottom handle for outgoing connections */}
        <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
          <Handle
            type="source"
            position={HandlePosition.Bottom}
            className="custom-handle"
            style={{ position: 'relative', bottom: '-5px' }}
          />
        </div>
      </div>
    );
  };

  if (data.type === 'position') {
    return renderPositionNode(data.data as PositionType);
  }

  if (data.type === 'structure') {
    return renderStructureNode(data.data as Structure);
  }

  return null;
};

export default CustomNode;