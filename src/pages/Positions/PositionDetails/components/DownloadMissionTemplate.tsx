import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";

interface DownloadMissionTemplateProps {
  positionTitle?: string;
}

const DownloadMissionTemplate = ({ positionTitle }: DownloadMissionTemplateProps) => {
  const handleDownload = () => {
    const data = [
      { tache: "Exemple de tache 1" },
      { tache: "Exemple de tache 2" },
    ];
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Taches");
    XLSX.writeFile(wb, `modele_taches_${positionTitle || 'poste'}.xlsx`);
  };

  return (
    <Button 
      icon={<DownloadOutlined />} 
      onClick={handleDownload}
    >
      canvas
    </Button>
  );
};

export default DownloadMissionTemplate;
