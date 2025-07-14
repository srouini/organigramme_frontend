import { Card, Button, Tree, Typography } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { TreeProps } from 'antd/es/tree';
import { Structure } from '@/types/reference';

interface StructureHierarchyProps {
  data: Structure | null | undefined;
  currentStructureId?: string;
  onSelect?: (selectedKeys: React.Key[], info: any) => void;
  onShowParent?: (parentId: string) => void;
}

const StructureHierarchy: React.FC<StructureHierarchyProps> = ({
  data,
  currentStructureId,
  onSelect,
  onShowParent,
}) => {
  // Convert structure data to tree format
  const convertToTreeData = (structure: Structure | null | undefined): any => {
    if (!structure) return [];

    return {
      title: (
        <span style={{ fontWeight: structure.id === currentStructureId ? 'bold' : 'normal' }}>
          {structure.name}
        </span>
      ),
      key: structure.id.toString(),
      isLeaf: !structure.children || structure.children.length === 0,
      children: structure.children?.map(convertToTreeData) || [],
    };
  };

  // Get the complete hierarchy including the main structure
  const getCompleteHierarchy = (structure: Structure | null | undefined) => {
    if (!structure) return [];
    return [convertToTreeData(structure)];
  };

  const treeData = getCompleteHierarchy(data);
  const parent = data?.parent;
  const parentId = parent ? (typeof parent === 'object' ? parent.id : parent) : undefined;

  return (
    <Card 
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Structure Hierarchy</span>
          {parentId && (
            <Button 
              type="link" 
              size="small"
              onClick={() => onShowParent?.(parentId.toString())}
            >
              Show Parent
            </Button>
          )}
        </div>
      }
      bordered={false} 
      style={{ height: 'calc(100vh - 250px)', overflow: 'auto' }}
      bodyStyle={{ padding: '16px 0' }}
    >
      <Tree
        showLine={{ showLeafIcon: false }}
        showIcon={false}
        defaultExpandAll
        switcherIcon={<DownOutlined />}
        treeData={treeData}
        onSelect={onSelect}
        selectedKeys={currentStructureId ? [currentStructureId] : []}
        defaultSelectedKeys={currentStructureId ? [currentStructureId] : []}
        style={{ background: 'transparent' }}
      />
    </Card>
  );
};

export default StructureHierarchy;