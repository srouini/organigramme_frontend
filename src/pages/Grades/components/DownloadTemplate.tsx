import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";

const DownloadTemplate = () => {
  const downloadTemplate = () => {
    // Sample data for the template
    const templateData = [
      {
        name: "Grade A",
        level: 1,
        color: "#3B82F6",
        category: "Category 1",
        description: "Description for Grade A"
      },
      {
        name: "Grade B",
        level: 2,
        color: "#10B981",
        category: "Category 2",
        description: "Description for Grade B"
      }
    ];

    // Create a new workbook and worksheet
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Grades Template");
    
    // Generate Excel file and trigger download
    XLSX.writeFile(wb, "grades_import_template.xlsx");
  };

  return (
    <Button 
      icon={<DownloadOutlined />} 
      onClick={downloadTemplate}
    >
      Canvas
    </Button>
  );
};

export default DownloadTemplate;
