import { lazy } from 'react';
import type { NodeTypes } from '@xyflow/react';

// Use dynamic import to break the circular dependency
export const nodeTypes = {
  custom: lazy(() => import('./index').then(mod => ({ default: mod.default }))),
} as unknown as NodeTypes;
