import { Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import { useRef } from "react";
import { API_MISSIONS_ENDPOINT } from "@/api/api";
import usePost from "@/hooks/usePost";

interface UploadMissionsProps {
  positionId: number;
  onSuccess: () => void;
}

const UploadMissions = ({ positionId, onSuccess }: UploadMissionsProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: uploadMissions, isLoading } = usePost({
    endpoint: `${API_MISSIONS_ENDPOINT}bulk_create/`,
    onSuccess: (response) => {
      message.success(`${response.data?.length || 'Plusieurs'} taches ont été ajoutées avec succès`);
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
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as { tache: string }[];
      
      // Filter out empty rows and validate data
      const missions = jsonData
        .map(row => row.tache?.toString().trim())
        .filter(tache => tache);

      if (missions.length === 0) {
        message.warning("Aucune mission valide trouvée dans le fichier");
        return;
      }

      // Call bulk create using usePost
      uploadMissions({
        position: positionId,
        missions: missions
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

export default UploadMissions;
