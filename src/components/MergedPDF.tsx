import React, { useState } from "react";
import { Button, message } from "antd";
import { FilePdfOutlined } from "@ant-design/icons";
import useData from "../hooks/useData";
import useLoading from "../hooks/useLoading";
import { useAxios } from "../hooks/useAxios";

interface MergedPDFProps {
  filters?: any;
  search?: string;
  endpoint: string;
  expand?: string;
  button_text?: string;
  query_params?: any;
}

const MergedPDF: React.FC<MergedPDFProps> = ({
  filters,
  search,
  endpoint,
  expand,
  button_text = "Merge as PDF",
  query_params,
}) => {
  const [loading, setLoading] = useState(false);
  const api = useAxios();

  // Get all data without pagination
  const {
    refetch: refetchExportData,
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
    loadingStates: [isLoadingData, isRefetching, isFetching, loading],
  });

  const handleMergedPdfExport = async () => {
    try {
      setLoading(true);
      const result = await refetchExportData();
      
      if (!result.data?.data || result.data.data.length === 0) {
        message.warning("No data available to export");
        return;
      }

      const facture_ids = result.data.data.map((item: any) => item.id);
      
      const response = await api.post(
        `${endpoint}generate_merged_pdf/`,
        { facture_ids },
        { responseType: "blob" }
      );

      // Create a URL for the blob
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link and trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = "merged_factures.pdf";
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      message.success("PDF merge successful");
    } catch (error) {
      console.error("Error merging PDFs:", error);
      message.error("Failed to merge PDFs");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      icon={<FilePdfOutlined />}
      onClick={handleMergedPdfExport}
      loading={isLoading}
      type="primary"
    >
      {button_text}
    </Button>
  );
};

export default MergedPDF;
