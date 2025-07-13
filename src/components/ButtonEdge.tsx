import { memo } from 'react';
import type { EdgeProps } from '@xyflow/react';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { Modal, message, Button } from 'antd';
import { Trash2 } from 'lucide-react';
import { ButtonEdge } from './button-edge';
import { useDeleteEdge } from '../hooks/useStructure';

const CustomButtonEdge = (props: EdgeProps) => {
  const { id, data, selected } = props;
  const structureId = (data as { structureId?: string })?.structureId || '';
  const { mutate: deleteEdge } = useDeleteEdge(structureId);
  const { confirm } = Modal;
  const queryClient = useQueryClient();

  const showConfirm = () => {
    confirm({
      title: 'Supprimer la connexion',
      content: 'Êtes-vous sûr de vouloir supprimer cette connexion ?',
      okText: 'Oui',
      okType: 'danger',
      cancelText: 'Non',
      onOk() {
        return new Promise((resolve, reject) => {
          // Check if this is a structure edge
          if (data?.isStructureEdge) {
            // For structure edges, we need to update the parent structure
            const updateData = {
              parent: null  // Removing the parent by setting it to null
            };
            
            // Make a PATCH request to update the structure
            axios.patch(`/api/structures/${data.targetId}/`, updateData)
              .then(() => {
                message.success('Lien de structure supprimé avec succès');
                // Invalidate the structure query to refresh the data
                queryClient.invalidateQueries({ queryKey: ['structure', structureId] });
                resolve(true);
              })
              .catch((error: any) => {
                message.error(
                  error.response?.data?.detail || 'Échec de la suppression du lien de structure'
                );
                reject(error);
              });
          } else {
            // For position edges, use the existing delete functionality
            deleteEdge(
              { id },
              {
                onSuccess: () => {
                  message.success('Connexion supprimée avec succès');
                  resolve(true);
                },
                onError: (error: any) => {
                  message.error(
                    error.response?.data?.detail || 'Échec de la suppression de la connexion'
                  );
                  reject(error);
                },
              }
            );
          }
        });
      },
      onCancel() {
        console.log('Delete cancelled');
      },
    });
  };

  return (
    <ButtonEdge {...props}>
      {selected && (
        <Button
          onClick={showConfirm}
          type="text"
          danger
          icon={<Trash2 size={12} />}
          className="p-1 h-auto bg-white rounded-full shadow-md hover:bg-red-50"
        />
      )}
    </ButtonEdge>
  );
};

export default memo(CustomButtonEdge);