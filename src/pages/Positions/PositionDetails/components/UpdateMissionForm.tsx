import { useState } from "react";
import DraggableModel from "../../../../components/DraggableModel";
import FormObject from "../../../../components/Form";
import { Form, message, Row } from "antd";
import usePost from "../../../../hooks/usePost";
import { mapInitialValues } from "../../../../utils/functions";
import { useReferenceContext } from "../../../../context/ReferenceContext";
import { API_MISSIONS_ENDPOINT } from "@/api/api";
import { EditOutlined } from "@ant-design/icons";
import { Position } from "@/types/reference";
import TextArea from "antd/es/input/TextArea";

interface UpdateMissionFormProps {
  refetch: () => void;
  initialvalues: any;
  position: Position;
}

const UpdateMissionForm: React.FC<UpdateMissionFormProps> = ({
  refetch,
  initialvalues,
  position,
}) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const { } = useReferenceContext();

  const handleFormSubmission = async () => {
    let values = await form.validateFields();
    if (initialvalues) {
      values.id = initialvalues?.id;
      values.position = position?.id;
    }

    mutate(values);
  };

  const onSuccess = () => {
    message.success("La responsabilité a été mise à jour avec succès.");
    setOpen(false);
    refetch();
  };

  const { mutate, isLoading } = usePost({
    onSuccess: onSuccess,
    endpoint: API_MISSIONS_ENDPOINT,
  });

  return (


    <DraggableModel
      OkButtontext="sumettre"
      modalOpenButtonText=""
      modalTitle="Responsabilité et Tâche"
      addButtonType="link"
      addButtonIcon={
        <EditOutlined /> 
      }
      onSubmit={handleFormSubmission}
      setOpen={setOpen}
      open={open}
      width={600}
      isLoading={isLoading}
      initialvalues={initialvalues}
    >
      <FormObject form={form} initialvalues={mapInitialValues(initialvalues)}>
        <Row gutter={24} style={{ width: '100%' }}>
          <Form.Item name="description" required style={{ width: '100%' }}>
            <TextArea rows={4} />
          </Form.Item>
        </Row>
      </FormObject>
    </DraggableModel>
  );
};

export default UpdateMissionForm;
