// components/Node.tsx
import type { NodeProps } from "@xyflow/react";

export const CustomBaseNode = ({ data, selected }: any) => {
  return (
    <div
      style={{
        padding: "10px",
        borderRadius: "5px",
        background: data.background || "#fff",
        border: selected ? "2px solid #1890ff" : "1px solid #ddd",
        boxShadow: selected ? "0 0 10px rgba(24, 144, 255, 0.5)" : "none",
      }}
    >
      <div style={{ fontWeight: "bold" }}>{data.label}</div>
      {data.description && (
        <div style={{ fontSize: "0.8em", marginTop: "5px" }}>
          {data.description}
        </div>
      )}
    </div>
  );
};