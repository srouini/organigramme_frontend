import { EdgeProps } from "@xyflow/react";
import { memo } from "react";
import { Modal, message } from "antd";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ButtonEdge } from "@/components/button-edge";
import { useDeleteEdge } from "../hooks/useOrganigram";

const CustomButtonEdge = memo((props: EdgeProps) => {
  const { id: edgeId, selected, data } = props;
  const organigramId = (data as { organigramId?: string })?.organigramId;
  const { mutate: deleteEdge } = useDeleteEdge();
  const queryClient = useQueryClient();

  const showConfirm = () => {
    Modal.confirm({
      title: "Do you want to delete this link?",
      content: "This action cannot be undone.",
      onOk() {
        if (!organigramId) {
          message.error("Cannot delete link: Organigram ID is missing.");
          return;
        }
        deleteEdge(
          { edgeId, organigramId },
          {
            onSuccess: () => {
              message.success("Link deleted successfully");
              queryClient.invalidateQueries({
                queryKey: ["organigram", organigramId],
              });
            },
            onError: (error: any) => {
              message.error(
                error.response?.data?.detail || "Failed to delete link"
              );
            },
          }
        );
      },
    });
  };

  return (
    <ButtonEdge {...props}>
      {selected && (
        <Button
          onClick={showConfirm}
          size="icon"
          variant="destructive"
          className="w-6 h-6"
        >
          <Trash2 size={12} />
        </Button>
      )}
    </ButtonEdge>
  );
});

export default CustomButtonEdge;