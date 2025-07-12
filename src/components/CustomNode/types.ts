import type { NodeProps } from '@xyflow/react';
import type { Position as PositionType, Structure as StructureType } from '@/types/reference';

export interface CustomNodeData {
  type: 'position' | 'structure';
  data: PositionType | StructureType;
  position: PositionType; // Required by FlowContext, mocked for structures
  isHighlighted?: boolean;
  isModalView?: boolean;
  [key: string]: any; // Allow additional properties
}

export type CustomNodeProps = Omit<NodeProps, 'data' | 'id'> & {
  id: string;
  data: CustomNodeData;
  selected?: boolean;
  isConnectable?: boolean;
};
