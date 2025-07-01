import { memo } from 'react';
import type { EdgeProps } from '@xyflow/react';
import { useQueryClient } from '@tanstack/react-query';
import { Modal, message, Button } from 'antd';
import { Trash2 } from 'lucide-react';
import { ButtonEdge } from './button-edge';
import { useDeleteEdge } from '../hooks/useOrganigram';

const CustomButtonEdge = (props: EdgeProps) => {
  const { id, data, selected } = props;
  const organigramId = (data as { organigramId?: string })?.organigramId || '';
  const { mutate: deleteEdge } = useDeleteEdge();
  const queryClient = useQueryClient();
  const { confirm } = Modal;

  const showConfirm = () => {
    confirm({
      title: 'Supprimer la connexion',
      content: 'Êtes-vous sûr de vouloir supprimer cette connexion ?',
      okText: 'Oui',
      okType: 'danger',
      cancelText: 'Non',
      onOk() {
        return new Promise((resolve, reject) => {
          deleteEdge(
            { edgeId: id, organigramId },
            {
              onSuccess: () => {
                message.success('Connexion supprimée avec succès');
                queryClient.invalidateQueries({
                  queryKey: ['organigram', organigramId],
                });
                resolve(true);
              },
              onError: (error: any) => {
                message.error(
                  error.response?.data?.detail || 'Failed to delete link'
                );
                reject(error);
              },
            }
          );
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