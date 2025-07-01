import { Upload, Button, message, Modal, Typography, Space, Alert } from 'antd';
import { useEffect } from 'react';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import * as XLSX from 'xlsx';
import usePost from '@/hooks/usePost';
import { API_GRADES_ENDPOINT } from '@/api/api';

const { Text } = Typography;

const templateData = [
  {
    name: 'Grade A',
    level: 1,
    color: '#3B82F6',
    category: 'Category1',
    description: 'Description for Grade A'
  },
  {
    name: 'Grade B',
    level: 2,
    color: '#10B981',
    category: 'Category2',
    description: 'Description for Grade B'
  },
  {
    name: 'Grade C',
    level: 3,
    color: '#F59E0B',
    category: 'Category1',
    description: 'Description for Grade C'
  }
];

const requiredFields = ['name', 'level'];

export default function ImportGrades({ refetch }: { refetch: () => void }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const { mutate: bulkCreateGrades, isLoading: isSubmitting } = usePost({
    onSuccess: (response: any) => {
      // Handle success response from the server
      if (response.errors && response.errors.length > 0) {
        // Handle partial success with errors
        setErrors(response.errors);
        message.warning(
          `Imported ${response.created_count} of ${response.total_rows} grades. ${response.errors.length} rows had errors.`
        );
      } else {
        // Handle full success
        message.success(`Successfully created ${response.created_count} grades!`);
        setIsModalOpen(false);
        setFileList([]);
        setErrors([]);
        refetch();
      }
    },
    endpoint: `${API_GRADES_ENDPOINT}bulk_create/`,
  });

  // Update the processing state when submission status changes
  useEffect(() => {
    setIsProcessing(isSubmitting);
  }, [isSubmitting]);

  const downloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Grades Template');
    XLSX.writeFile(wb, 'grades_import_template.xlsx');
  };

  const beforeUpload = (file: any) => {
    const isExcel = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ].includes(file.type);

    if (!isExcel) {
      message.error('You can only upload Excel files!');
      return Upload.LIST_IGNORE;
    }

    setFileList([file]);
    return false;
  };

  const processExcel = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet);
          
          // Validate and transform data
          const validationErrors: string[] = [];
          const validGrades: any[] = [];
          
          jsonData.forEach((row: any, index: number) => {
            const rowErrors: string[] = [];
            const grade: any = {};
            
            // Validate required fields
            if (!row.name || String(row.name).trim() === '') {
              rowErrors.push('Name is required');
            } else {
              grade.name = String(row.name).trim();
            }
            
            if (row.level === undefined || row.level === '') {
              rowErrors.push('Level is required');
            } else {
              const level = Number(row.level);
              if (isNaN(level)) {
                rowErrors.push('Level must be a number');
              } else {
                grade.level = level;
              }
            }
            
            // Optional fields
            if (row.color) grade.color = String(row.color).trim();
            if (row.category) grade.category = String(row.category).trim();
            if (row.description) grade.description = String(row.description).trim();
            
            if (rowErrors.length > 0) {
              validationErrors.push(`Row ${index + 2}: ${rowErrors.join('; ')}`);
            } else {
              validGrades.push(grade);
            }
          });
          
          if (validationErrors.length > 0) {
            setErrors(validationErrors);
            reject(new Error('Validation errors found in the Excel file'));
          } else {
            resolve(validGrades);
          }
          
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

  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.warning('Please select a file to upload');
      return;
    }

    setErrors([]);
    setIsProcessing(true);

    try {
      const grades = await processExcel(fileList[0]);
      if (grades.length > 0) {
        // The error handling is now managed by the usePost hook
        await bulkCreateGrades(grades);
      } else {
        message.warning('No valid grades found in the file');
      }
    } catch (error: any) {
      console.error('Error processing file:', error);
      if (errors.length === 0) {
        message.error('Error processing file. Please check the format and try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Button 
        type="primary" 
        onClick={() => setIsModalOpen(true)}
        style={{ marginRight: 8 }}
      >
        Canvas
      </Button>

      <Modal
        title="Import Grades from Excel"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setFileList([]);
          setErrors([]);
        }}
        footer={[
          <Button key="cancel" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>,
          <Button
            key="download"
            type="text"
            icon={<DownloadOutlined />}
            onClick={downloadTemplate}
          >
            Download Template
          </Button>,
          <Button
            key="upload"
            type="primary"
            onClick={handleUpload}
            disabled={fileList.length === 0 || isProcessing}
            loading={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Import Grades'}
          </Button>,
        ]}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <div>
            <Text>Upload an Excel file to import grades in bulk.</Text>
            <br />
            <Text type="secondary">
              The file should include columns: name (required), level (required), color, category, description
            </Text>
          </div>

          <Upload
            fileList={fileList}
            beforeUpload={beforeUpload}
            onRemove={() => {
              setFileList([]);
              setErrors([]);
              return true;
            }}
            maxCount={1}
            accept=".xlsx,.xls"
          >
            <Button icon={<UploadOutlined />}>
              Select File
            </Button>
          </Upload>

          {errors.length > 0 && (
            <Alert
              message="Validation Errors"
              description={
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {errors.map((error, i) => (
                    <div key={i} style={{ marginBottom: 4 }}>{error}</div>
                  ))}
                </div>
              }
              type="error"
              style={{ marginTop: 16 }}
            />
          )}
        </Space>
      </Modal>
    </>
  );
}
