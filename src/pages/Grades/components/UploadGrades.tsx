import { Button, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import * as XLSX from "xlsx";
import usePost from "@/hooks/usePost";

interface UploadGradesProps {
  refetch: () => void;
}

const UploadGrades = ({ refetch }: UploadGradesProps) => {
  const [fileList, setFileList] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const { mutate: bulkCreateGrades } = usePost({
    onSuccess: (response: any) => {
      if (response.errors && response.errors.length > 0) {
        message.warning(
          `Imported ${response.created_count} of ${response.total_rows} grades. ${response.errors.length} rows had errors.`
        );
      } else {
        message.success(`Successfully created ${response.created_count} grades!`);
        setFileList([]);
        refetch();
      }
      setIsProcessing(false);
    },
    endpoint: "/api/grades/bulk_create/",
  });

  const beforeUpload = async (file: any) => {
    const isExcel = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ].includes(file.type);

    if (!isExcel) {
      message.error("You can only upload Excel files!");
      return Upload.LIST_IGNORE;
    }

    setFileList([file]);
    await handleUpload(file);
    return false;
  };

  const processExcel = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet);
          
          const validGrades = jsonData.map((row: any) => ({
            name: String(row.name || "").trim(),
            level: Number(row.level),
            color: String(row.color || "#3B82F6").trim(),
            category: String(row.category || "").trim(),
            description: String(row.description || "").trim(),
          }));
          
          resolve(validGrades);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = (error) => {
        reject(error);
      };
      
      reader.readAsArrayBuffer(file);
    });
  };

  const handleUpload = async (file: File) => {
    setIsProcessing(true);

    try {
      const grades = await processExcel(file);
      if (grades.length > 0) {
        await bulkCreateGrades(grades);
      } else {
        message.warning("No valid grades found in the file");
      }
    } catch (error: any) {
      console.error("Error processing file:", error);
      message.error("Error processing file. Please check the format and try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Upload
      fileList={fileList}
      beforeUpload={beforeUpload}
      onRemove={() => {
        setFileList([]);
        return true;
      }}
      showUploadList={false}
      maxCount={1}
      accept=".xlsx,.xls"
    >
      <Button 
        type="primary" 
        icon={<UploadOutlined />}
        loading={isProcessing}
      >
        {isProcessing ? 'Uploading...' : 'Canvas'}
      </Button>
    </Upload>
  );
};

export default UploadGrades;
