import { message, Modal, Button } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import  usePost  from "@/hooks/usePost";
import { API_POSITIONS_ENDPOINT } from "@/api/api";
import { usePermissions } from "@/utils/permissions";

interface CloneProps {
  refetch: () => void;
  initialvalues: any;
  disabled?: boolean;
  buttonText?: string;
}

const Clone: React.FC<CloneProps> = ({
  refetch,
  initialvalues,
  disabled = false,
  buttonText = "Cloner"
}) => {
  const { confirm } = Modal;
  const hasPermission = usePermissions();

  const onSuccess = () => {
    message.success("La position a été clonée avec succès.");
    refetch();
  };

  const { mutate: clonePosition, isLoading } = usePost({
    onSuccess: onSuccess,
    endpoint: `${API_POSITIONS_ENDPOINT}${initialvalues?.id}/clone/`,
    full_endpoint: true
  });

  const showConfirm = () => {
    confirm({
      title: 'Confirmer le clonage',
      content: `Voulez-vous vraiment cloner la position "${initialvalues?.title}" ?`,
      okText: 'Oui, cloner',
      cancelText: 'Annuler',
      onOk: () => clonePosition({}),
      okButtonProps: { loading: isLoading }
    });
  };

  return (
    <Button
      type="default"
      icon={<CopyOutlined />}
      onClick={showConfirm}
      disabled={disabled || !hasPermission('app.add_tc')}
      loading={isLoading}
    >
    </Button>
  );
};

export default Clone;
