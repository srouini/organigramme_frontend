import { Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import { useRef } from "react";
import { API_COMPETENCES_ENDPOINT } from "@/api/api";
import usePost from "@/hooks/usePost";

interface UploadCompetencesProps {
  positionId: number;
  onSuccess: () => void;
}

const UploadCompetences = ({ positionId, onSuccess }: UploadCompetencesProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: uploadCompetences, isLoading } = usePost({
    endpoint: `${API_COMPETENCES_ENDPOINT}bulk_create/`,
    onSuccess: (response) => {
      message.success(`${response.data?.length || 'Plusieurs'} compétences ont été ajoutées avec succès`);
      onSuccess();
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as { competence: string }[];
      
      // Filter out empty rows and validate data
      const competences = jsonData
        .map(row => row.competence?.toString().trim())
        .filter(competence => competence);

      if (competences.length === 0) {
        message.warning("Aucune compétence valide trouvée dans le fichier");
        return;
      }

      // Call bulk create using usePost
      uploadCompetences({
        position: positionId,
        competences: competences
      });
      
    } catch (error) {
      console.error("Error processing file:", error);
      message.error("Une erreur est survenue lors du traitement du fichier");
    } finally {
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <Button 
        icon={<UploadOutlined />}
        onClick={() => fileInputRef.current?.click()}
        loading={isLoading}
        disabled={isLoading}
      >
        données
      </Button>
      <input 
        ref={fileInputRef}
        type="file" 
        accept=".xlsx,.xls" 
        style={{ display: 'none' }} 
        onChange={handleFileUpload}
      />
    </>
  );
};

export default UploadCompetences;
