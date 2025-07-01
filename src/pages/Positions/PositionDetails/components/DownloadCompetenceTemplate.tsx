import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";

interface DownloadCompetenceTemplateProps {
  positionTitle?: string;
}

const DownloadCompetenceTemplate = ({ positionTitle }: DownloadCompetenceTemplateProps) => {
  const handleDownload = () => {
    const data = [
      { competence: "Exemple de compétence 1" },
      { competence: "Exemple de compétence 2" },
    ];
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Compétences");
    XLSX.writeFile(wb, `modele_competences_${positionTitle || 'poste'}.xlsx`);
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

export default DownloadCompetenceTemplate;
