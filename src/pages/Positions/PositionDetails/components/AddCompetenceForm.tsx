
import FormObject from "../../../../components/Form";
import { Button, Form, message, Row } from "antd";
import usePost from "../../../../hooks/usePost";
import { useReferenceContext } from "../../../../context/ReferenceContext";
import { API_COMPETENCES_ENDPOINT } from "@/api/api";
import FormTextInput from "@/components/form/FormTextInput";
import { Position } from "@/types/reference";
import { PlusOutlined } from "@ant-design/icons";

interface AUFormProps {
  refetch: () => void;
  position: Position;
}

const AddCompetenceForm: React.FC<AUFormProps> = ({
  refetch,
  position,
}) => {
  const [form] = Form.useForm();


  const handleFormSubmission = async () => {
    let values = await form.validateFields();

    values.position = position?.id;


    mutate(values);
  };

  const onSuccess = () => {
    message.success("Compétence créée avec succès.");
    refetch();
    form.resetFields();
  };

  const { mutate, isLoading } = usePost({
    onSuccess: onSuccess,
    endpoint: API_COMPETENCES_ENDPOINT,
  });

  return (

    <div style={{ width: '100%' }}>
    <FormObject form={form} layout="inline" >
      <Row style={{ width: '100%', margin: 0, flexWrap: 'nowrap' }}>
        <div style={{ flex: 1, marginRight: 8 }}>
          <FormTextInput
            name="description"
            label=""
            placeholder="Compétence"
            style={{ width: '100%' }}
            required
          />
        </div>
        <Form.Item style={{ margin: 0 }}>
          <Button 
            type="primary" 
            onClick={handleFormSubmission} 
            htmlType="submit" 
            icon={<PlusOutlined />} 
            loading={isLoading}
          />
        </Form.Item>
      </Row>
    </FormObject>
  </div>
  );
};

export default AddCompetenceForm;
