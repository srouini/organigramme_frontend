import React from "react";
import { CloudDownloadOutlined, PrinterOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { saveAs } from "file-saver";
import { AxiosInstance } from "axios";
import { useAxios } from "@/hooks/useAxios";
import { usePermissions } from "@/utils/permissions";

interface PrintProps {
  id: string | undefined;
  endpoint: string;
  type: "Download" | "View";
  disabled?: boolean,
  button_text?:string,
  endpoint_suffex?:string, 
  permission?:string
}

const Print: React.FC<PrintProps> = ({ endpoint, id, type, disabled=false,button_text,endpoint_suffex,permission }: PrintProps) => {
  const api: AxiosInstance = useAxios();
  const hasPermission = usePermissions();
  const handleDownload = async () => {
    try {

      const response = await api({
        url: `${endpoint}${id}/${endpoint_suffex}`,
        method: "GET",
        responseType: "blob", // Important for handling binary data (PDF)
      });

      // Extract the filename from the content-disposition header
      const contentDisposition = response.headers["content-disposition"];
      const fileName = contentDisposition
        ? contentDisposition.split("filename=")[1].replace(/"/g, "")
        : `DOCUMENT_${id}.pdf`; // Default name if header is missing

      // Create a new Blob and trigger the file download
      const blob = new Blob([response.data], { type: "application/pdf" });
      saveAs(blob, fileName);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  const handleViewPDF = async () => {
    try {
      const response = await api({
        url: `${endpoint}${id}/${endpoint_suffex}`,
        method: "GET",
        responseType: "blob", // Important for handling binary data (PDF)
      });

      // Create a Blob URL for the PDF and open it in a new tab
      const blob = new Blob([response.data], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank"); // Opens the PDF in a new tab
    } catch (error) {
      console.error("Error fetching PDF:", error);
    }
  };

  const handleClick = () => {
    if (type === "Download") {
      handleDownload();
    }

    if (type === "View") {
      handleViewPDF();
    }
  };

  let verifyPermission = permission ? !hasPermission(permission) : false

  return (
    <Button
      type="dashed"
      icon={type==="Download" ? <CloudDownloadOutlined /> : <PrinterOutlined />}
      onClick={handleClick}
      disabled={verifyPermission || disabled}
    >{button_text}</Button>
  );
};

export default Print;
