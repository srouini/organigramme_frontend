import type { NodeProps } from '@xyflow/react';
import type { Position as PositionType } from '@/types/reference';

export interface CustomNodeData {
  position: PositionType;
  isModalView?: boolean;
  [key: string]: any; // Allow additional properties
}

export type CustomNodeProps = Omit<NodeProps, 'data' | 'id'> & {
  id: string;
  data: CustomNodeData;
  selected?: boolean;
  isConnectable?: boolean;
};
