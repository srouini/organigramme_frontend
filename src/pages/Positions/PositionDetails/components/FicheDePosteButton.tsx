import React from 'react';
import { Button } from 'antd';
import FicheDePoste from './FicheDePostePDF';
import { pdf } from '@react-pdf/renderer';
import { Competence, Mission, Position } from '@/types/reference';

interface FicheDePosteProps {
    position: Position;
    missions: Mission;
    competences: Competence
  }

export const FicheDePosteButton = ({ position, missions, competences }: FicheDePosteProps) => {
    const handleGeneratePdf = async () => {
      try {
        const blob = await pdf(
          <FicheDePoste 
            position={position} 
            missions={missions} 
            competences={competences} 
          />
        ).toBlob();
        
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        
        // Clean up after some time
        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 10000);
      } catch (error) {
        console.error('Error generating PDF:', error);
      }
    };
  
    return (
      <Button 
        type="primary"
        onClick={handleGeneratePdf}
      >
        Generate Fiche de Poste
      </Button>
    );
  };
export default FicheDePosteButton;