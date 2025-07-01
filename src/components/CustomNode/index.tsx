import { Handle, Position, useConnection } from '@xyflow/react';
 
export default function CustomNode({ id }: { id: string }) {
  const connection = useConnection(); 
 
  const isTarget = connection.inProgress && connection.fromNode.id !== id;
 
  const label = isTarget ? 'Drop here' : 'Drag to connect';
 
  return (
    <div className="customNode" style={{ backgroundColor: "#000" }}>
 
    </div>
  );
}