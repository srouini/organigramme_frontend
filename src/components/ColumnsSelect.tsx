import { useAuth } from "@/context/AuthContext";
import { ensureHashPrefix } from "@/utils/functions";
import { Tag } from "antd";
import React from "react";

interface Column {
  key: string;
  title: string;
  selected?: boolean;
}

interface ColumnsSelectProps {
  columns: any;
  setSelectedColumns: (columns: Column[]) => void;
}



const ColumnsSelect: React.FC<ColumnsSelectProps> = ({
  columns,
  setSelectedColumns,
}) => {

  const {user} = useAuth();
  
  const handleTagClick = (key: string) => {
    const updatedColumns = columns.map((column:any) => {
      if (column.key === key) {
        return { ...column, selected: !column.selected };
      }
      return column;
    });
    setSelectedColumns(updatedColumns);
  };

  return (
    <div style={{paddingBottom:"20px", paddingTop:"10px"}}>
      {columns?.map((column:any) => (
        <Tag
          key={column.key}
          onClick={() => handleTagClick(column.key)}
          color={ensureHashPrefix(user?.profile?.theme_color || "#1890ff")}
          style={{
            marginBottom: "10px",
            paddingTop: "2px",
            paddingBottom: "2px",
            borderRadius: "8px",
            paddingRight: "10px",
            paddingLeft: "10px",
            cursor: "pointer",
            opacity:column.selected ? "100%":"30%"
          }}
        >
          {column.title}
        </Tag>
      ))}
    </div>
  );
};

export default ColumnsSelect;
