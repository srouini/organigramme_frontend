import { ReactNode } from "react";

import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getSmoothStepPath,
  Position,
} from "@xyflow/react";

export const ButtonEdge = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  children,
}: EdgeProps & { children: ReactNode }) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 10,
  });

  const offset = 25;
  let buttonX = labelX;
  let buttonY = labelY;

  if (targetPosition) {
    buttonX = targetX;
    buttonY = targetY;
    switch (targetPosition) {
      case Position.Top:
        buttonY -= offset;
        break;
      case Position.Bottom:
        buttonY += offset;
        break;
      case Position.Left:
        buttonX -= offset;
        break;
      case Position.Right:
        buttonX += offset;
        break;
    }
  }

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          className="nodrag nopan pointer-events-auto absolute"
          style={{
            transform: `translate(-50%, -50%) translate(${buttonX}px,${buttonY}px)`,
          }}
        >
          {children}
        </div>
      </EdgeLabelRenderer>
    </>
  );
};
