// src/pages/Structure/StructureDetails/components/StructureHierarchy.tsx
import { Card, Button, Tree } from 'antd';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
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
  

  const convertToTreeData = (structure: Structure | null | undefined): any => {
    if (!structure) return [];

    return {
      title: structure.name,
      key: structure.id.toString(),
      isLeaf: !structure.children || structure.children.length === 0,
      children: structure.children?.map(convertToTreeData) || [],
    };
  };

  const treeData = data ? [convertToTreeData(data)] : [];
  const parentId = data?.parent ? (typeof data.parent === 'object' ? data.parent.id : data.parent) : undefined;

  return (
  
      <Tree
        showLine={{ showLeafIcon: false }}
        showIcon={false}
        treeData={treeData}
        onSelect={onSelect}
        selectedKeys={currentStructureId ? [currentStructureId] : []}
        style={{  backgroundColor:"#FBFBFB"}}
      />

  );
};

export default StructureHierarchy;