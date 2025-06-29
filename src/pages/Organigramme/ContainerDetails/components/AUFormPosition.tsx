import { useEffect, useState } from "react";
import DraggableModel from "../../../../components/DraggableModel";
import FormObject from "../../../../components/Form";
import { Divider, Form, message, Row } from "antd";
import usePost from "../../../../hooks/usePost";
import { mapInitialValues } from "../../../../utils/functions";
import { useReferenceContext } from "../../../../context/ReferenceContext";
import { API_SOUSARTICLES_ENDPOINT } from "@/api/api";
import FormField from "@/components/form/FormField";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";

interface AUFormProps {
  refetch: () => void;
  initialvalues: any;
  tc: any;
  editText?: string;
  addText?: string;
  hasIcon?: boolean;
}

const AUFormPosition: React.FC<AUFormProps> = ({
  refetch,
  initialvalues,
  tc,
  editText = "MODIFIER",
  addText = "Sous Article",
  hasIcon = false,
}) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const { box } = useReferenceContext();

  useEffect(() => {
    box?.fetch();
  }, []);

  const {} = useReferenceContext();

  const handleFormSubmission = async () => {
    let values = await form.validateFields();
    if (initialvalues) {
      values.id = initialvalues?.id;
    }
    values.tc = parseInt(tc);
    mutate(values);
  };

  const onSuccess = () => {
    message.success("Submission successful");
    setOpen(false);
    refetch();
  };

  const { mutate, isLoading } = usePost({
    onSuccess: onSuccess,
    endpoint: API_SOUSARTICLES_ENDPOINT,
  });

  return (
    <DraggableModel
      OkButtontext="Submit"
      modalOpenButtonText={initialvalues ? editText : addText} 
      modalTitle="Position"
      addButtonType="dashed"
      addButtonIcon={
        hasIcon && initialvalues ? <EditOutlined /> : <PlusOutlined />
      }
      onSubmit={handleFormSubmission}
      setOpen={setOpen}
      open={open}
      width={400}
      isLoading={isLoading}
      initialvalues={initialvalues}
    >

      <Divider/>

      <Divider/>
      <FormObject form={form} initialvalues={mapInitialValues(initialvalues)}>
        <Row gutter={24}>
          <FormField
            name="box"
            label="Box"
            type="select"
            options={box?.results}
            option_label="designation"
            required
            span_md={24}
          />
        </Row>
      </FormObject>
    </DraggableModel>
  );
};

export default AUFormPosition;
