import React, { useEffect, useState } from "react";
import { Button, message, Space, Select, Input, Popover, Radio } from "antd";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import useData from "../hooks/useData";
import useLoading from "../hooks/useLoading";
import { CloudDownloadOutlined } from "@ant-design/icons";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ColumnType {
  title: string;
  dataIndex?: string;
  schema?: string[];
  selected?: boolean;
}

interface ExcelExportProps {
  columns: ColumnType[];
  filters?: any;
  search?: string;
  endpoint: string;
  expand?: string;
  button_text?: string;
  query_params?: any,
}

interface DataRowType {
  [key: string]: any;
}

// Helper function to get nested property value by schema
const getNestedValue = (obj: any, path: string[]): string => {
  const nestedValue = path.reduce((acc, part) => acc && acc[part], obj);
  return nestedValue ? nestedValue.toString() : "-";
};

const Excel: React.FC<ExcelExportProps> = ({
  columns,
  filters,
  search,
  endpoint,
  expand,
  button_text = "Exportez",
  query_params,

}) => {
  const [fileName, setFileName] = useState<string>(() => `data_export_${new Date().toISOString().split("T")[0]}`);
  const [fileFormat, setFileFormat] = useState<'xlsx' | 'csv' | 'pdf'>('xlsx');
  const [pdfOrientation, setPdfOrientation] = useState<'portrait' | 'landscape'>('portrait');

  const {
    refetch: refetchExportData,
    data,
    isLoading: isLoadingData,
    isRefetching,
    isFetching,
  } = useData({
    endpoint,
    name: "Filter_export",
    params: {
      expand,
      all: true,
      search,
      ...filters,
      ...query_params
    },
    enabled: false, // Disable auto-fetch
  });

  const { isLoading } = useLoading({
    loadingStates: [isRefetching, isLoadingData, isFetching],
  });

  const [shouldExport, setShouldExport] = useState(false);

  const exportToPdf = async () => {
    if (!data?.data?.length) {
      message.warning("No data available for export");
      return;
    }

    try {
      const selectedColumns = columns.filter((column) => column.selected);
      const header = selectedColumns.map((column) => column.title);

      const body = data.data.map((row: DataRowType) =>
        selectedColumns.map((column) => {
          const cellData = column.schema
            ? getNestedValue(row, column.schema)
            : row[column.dataIndex as string];
          if (typeof cellData === 'boolean') {
            return cellData ? "OUI" : "NON";
          }
          return cellData?.toString() || "-";
        })
      );

      const doc = new jsPDF({
        orientation: pdfOrientation,
        unit: 'mm',
        format: 'a4'
      });

      // Calculate margins and content width based on orientation
      const pageWidth = pdfOrientation === 'landscape' ? 297 : 210;
      //@ts-ignore
      const pageHeight = pdfOrientation === 'landscape' ? 210 : 297;
      const margin = 14;

      // Add title
      doc.setFontSize(16);
      doc.text(fileName, margin, 15);

      // Add date
      doc.setFontSize(10);

      autoTable(doc, {
        head: [header],
        body: body,
        startY: 30,
        styles: {
          fontSize: 8,
          cellPadding: 2,
          overflow: 'linebreak',
        },
        headStyles: {
          fillColor: [66, 139, 202],
          textColor: 255,
          fontSize: 9,
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        margin: {
          top: 30,
          left: margin,
          right: margin,
        },
        tableWidth: pageWidth - (margin * 2),
      });

      doc.save(`${fileName}.pdf`);
      message.success("PDF export successful!");
    } catch (error) {
      console.error("PDF export error:", error);
      message.error("Failed to export PDF");
    }
  };

  const exportData = async () => {
    if (!data?.data?.length) {
      message.warning("No data available for export");
      return;
    }

    try {
      if (fileFormat === 'pdf') {
        await exportToPdf();
        return;
      }

      const workbook = XLSX.utils.book_new();
      const selectedColumns = columns.filter((column) => column.selected);
      const header = selectedColumns.map((column) => column.title);

      // Prepare worksheet data
      const worksheetData = [
        header,
        ...(data.data.map((row: DataRowType) =>
          selectedColumns.map((column) => {
            const cellData = column.schema
              ? getNestedValue(row, column.schema)
              : row[column.dataIndex as string];
            if (typeof cellData === 'boolean') {
              return cellData ? "OUI" : "NON";
            }
            // Handle decimal numbers
            if (typeof cellData === 'number' || (typeof cellData === 'string' && !isNaN(Number(cellData)))) {
              const num = Number(cellData);
              return isFinite(num) ? num : cellData;
            }
            return cellData;
          })
        ) || []),
      ];

      // Convert array data to worksheet
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

      // Set autofilter for the header row
      worksheet["!autofilter"] = { ref: `A1:${String.fromCharCode(65 + header.length - 1)}1` };

      // Auto-adjust column widths
      //@ts-ignore
      const columnWidths = worksheetData[0].map((_, colIndex) => {
        const maxWidth = worksheetData.reduce((maxWidth, row) => {
          const cell = row[colIndex] ?? "";
          return Math.max(maxWidth, cell.toString().length);
        }, 10);
        return { wch: maxWidth + 2 };
      });
      worksheet["!cols"] = columnWidths;

      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      const buffer = XLSX.write(workbook, {
        bookType: fileFormat as 'xlsx' | 'csv',
        type: "array",
      });
      const dataBlob = new Blob(
        [buffer],
        {
          type: fileFormat === 'xlsx'
            ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            : 'text/csv;charset=utf-8'
        }
      );

      saveAs(dataBlob, `${fileName}.${fileFormat}`);
      message.success("Export successful!");
    } catch (error) {
      console.error("Export error:", error);
      message.error("Failed to export data");
    }
  };

  useEffect(() => {
    if (shouldExport && data?.data?.length) {
      exportData();
      setShouldExport(false);
    }
  }, [data, shouldExport]);

  const handleClick = () => {
    setShouldExport(true);
    refetchExportData();
  };

  const exportContent = (
    <Space direction="vertical" size="small">
      <Input
        placeholder="Enter file name"
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
        style={{ width: '200px' }}
      />
      <Select
        value={fileFormat}
        onChange={setFileFormat}
        style={{ width: '200px' }}
        options={[
          { label: 'Excel (.xlsx)', value: 'xlsx' },
          { label: 'CSV (.csv)', value: 'csv' },
          { label: 'PDF (.pdf)', value: 'pdf' },
        ]}
      />
      {fileFormat === 'pdf' && (
        <Radio.Group
          value={pdfOrientation}
          onChange={(e) => setPdfOrientation(e.target.value)}
          optionType="button"
          buttonStyle="solid"
          style={{ width: '200px' }}
        >
          <Radio.Button value="portrait" style={{ width: '100px', textAlign: 'center' }}>
            Portrait
          </Radio.Button>
          <Radio.Button value="landscape" style={{ width: '100px', textAlign: 'center' }}>
            Landscape
          </Radio.Button>
        </Radio.Group>
      )}
      <Button
        type="primary"
        onClick={handleClick}
        loading={isLoading}
        icon={<CloudDownloadOutlined />}
        style={{ width: '200px' }}
      >
        {button_text}
      </Button>
    </Space>
  );

  return (
    <Popover
      content={exportContent}
      title="Export Options"
      trigger="click"
      placement="bottom"
    >
      <Button
        type="primary"
        icon={<CloudDownloadOutlined />}
        loading={isLoading}
      >
        {button_text}
      </Button>
    </Popover>
  );
};

export default Excel;
