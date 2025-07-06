import { Select } from 'antd';
import { useFlow } from '@/context/FlowContext';
import { useReactFlow } from '@xyflow/react';
import { useEffect } from 'react';

const SearchControl = () => {
  const { nodes, searchNodes, searchResults } = useFlow();
  const { getNode, setCenter } = useReactFlow();

  useEffect(() => {
    if (searchResults.length > 0) {
      const firstResultId = searchResults[0];
      const node = getNode(firstResultId);

      if (node) {
        const x = node.position.x + (node.width || 0) / 2;
        const y = node.position.y + (node.height || 0) / 2;
        setCenter(x, y, { zoom: 1.2, duration: 800 });
      }
    } else {
      // Optional: Reset view when search is cleared
      // fitView();
    }
  }, [searchResults, getNode, setCenter]);

  const handleSelect = (nodeId: string) => {
    searchNodes(null, nodeId);
  };

  const handleClear = () => {
    searchNodes(null, null);
  };

  const positionOptions = nodes.map((node) => ({
    value: node.id,
    label: node.data.position.title,
  }));

  return (
    <Select
      showSearch
      placeholder="Search for a position..."
      style={{ width: 300 }}
      onSelect={handleSelect}
      onClear={handleClear}
      options={positionOptions}
      filterOption={(input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
      allowClear
    />
  );
};

export default SearchControl;
