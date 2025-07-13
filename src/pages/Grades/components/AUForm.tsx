import { useEffect, useState } from "react";
import DraggableModel from "@/components/DraggableModel";
import FormObject from "@/components/Form";
import { Col, ColorPicker, Divider, Form, message, Row } from "antd";
import usePost from "@/hooks/usePost";
import { mapInitialValues } from "@/utils/functions";
import { useReferenceContext } from "@/context/ReferenceContext";
import { API_GRADES_ENDPOINT } from "@/api/api";
import FormField from "@/components/form/FormField";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { usePermissions } from "@/utils/permissions";
import TextArea from "antd/es/input/TextArea";
import type { Color } from 'antd/es/color-picker';


const formatDate = (field: string, values: any) => {
  if (values[field]) values[field] = values[field].format("YYYY-MM-DD");
  return values;
};

interface AUFormProps {
  refetch: () => void;
  initialvalues?: any;
  editText?: string;
  addText?: string;
  hasIcon?: boolean;
  disabled?: boolean;
}

const AUForm: React.FC<AUFormProps> = ({
  refetch,
  initialvalues,
  editText = "MODIFIER",
  addText = "Mrn",
  hasIcon = false,
  disabled = false,
}) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const {grades} = useReferenceContext();

  const [colorHex, setColorHex] = useState<string>('#1677ff');

   const handleChange = (color: Color) => {
    const hex = color.toHexString(); // get color in hex
    setColorHex(hex);
  };

  const handleFormSubmission = async () => {
    let values = await form.validateFields();
    if (initialvalues) {
      values["id"] = initialvalues?.id;
    }
    if (colorHex) {
      values["color"]= colorHex;
    }
    mutate(values);
  };

  const onSuccess = () => {
    message.success("Le grade a été créé avec succès");
    setOpen(false);
    refetch();
    grades?.refetch();
  };

  const { mutate, isLoading } = usePost({
    onSuccess: onSuccess,
    endpoint: API_GRADES_ENDPOINT,
  });

  const hasPermission = usePermissions();

  return (
    <DraggableModel
      OkButtontext="Sumettre"
      modalOpenButtonText={initialvalues ? editText : addText}
      modalTitle="Grade"
      addButtonType="dashed"
      addButtonIcon={
        hasIcon && initialvalues ? <EditOutlined /> : <PlusOutlined />
      }
      disabledModalOpenButton={
        disabled ||
        (!initialvalues && !hasPermission("app.add_tc")) ||
        (initialvalues && !hasPermission("app.change_tc"))
      }
      onSubmit={handleFormSubmission}
      setOpen={setOpen}
      open={open}
      width={600}
      isLoading={isLoading}
      initialvalues={initialvalues}
    >
      <FormObject form={form} initialvalues={mapInitialValues(initialvalues)}>
        <Row gutter={24}>
          <FormField
            name="name"
            label="Nom"
            type="text"
            required
            span_md={24}
          />
          <Divider style={{ marginTop: "0px" }} />
        </Row>
    
               <FormField
            name="category"
            label="Categorie"
            type="text"
            required
            span_md={24}
          />
          <Form.Item label="Couleur" name="color" required>
            <ColorPicker value={colorHex} onChange={handleChange} defaultValue="#1677ff"/>
          </Form.Item>
   
        <Row gutter={24}>
          <Col span={24}>
          <Form.Item label="Description" name="description">
            <TextArea rows={4} />
          </Form.Item>
          </Col>
        </Row>
      </FormObject>
    </DraggableModel>
  );
};

export default AUForm;
