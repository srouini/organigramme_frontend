import React, { useEffect, useState } from "react";
import DraggableModelFullWidth from "@/components/DraggableModel";
import FormObject from "@/components/Form";
import { Divider, Form, message, Row,Input,Col,ColorPicker} from "antd";
import usePost from "@/hooks/usePost";
import { useReferenceContext } from "@/context/ReferenceContext";
import { API_GRADES_ENDPOINT, API_POSITIONS_ENDPOINT, API_STRUCTURES_ENDPOINT } from "@/api/api";
import FormField from "@/components/form/FormField";
import type { Color } from 'antd/es/color-picker';


interface AUFormProps {
  refetch?: () => void;
  initialvalues?: any;
  onAdded?: (client: any) => void;
}
const { TextArea } = Input;
const AddGrade: React.FC<AUFormProps> = ({
  refetch,
  initialvalues,
  onAdded
}) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);


  const [colorHex, setColorHex] = useState<string>('#1677ff');

  const handleChange = (color: Color) => {
   const hex = color.toHexString(); // get color in hex
   setColorHex(hex);
 };
 
  const { structures, grades, positions } = useReferenceContext();

  // Fetch structures and positions when the form opens
  useEffect(() => {
    if (open) {
      structures?.fetch();
      positions?.fetch();
      grades?.fetch();
    }
  }, [open]);

  const handleFormSubmission = async () => {
    let values = await form.validateFields();
    if (initialvalues) {
      values.id = initialvalues?.id;
    }
    values.color = colorHex;
    mutate(values);
  };

  const onSuccess = (response: any) => {
    message.success("Grade cree avec succes");
    setOpen(false);
    if (refetch) refetch();
    if (grades?.refetch) grades.refetch();

    // Call the callback with the newly created client
    if (onAdded && response) {
      onAdded({
        id: response.id,
        name: response.name,
        // Add any other fields you need
      });
    }
  };

  const { mutate, isLoading } = usePost({
    onSuccess: onSuccess,
    endpoint: API_GRADES_ENDPOINT,
  });

  return (
    <DraggableModelFullWidth
      OkButtontext="Submit"
      modalTitle="Ajouter un nouveau grade"
      onSubmit={handleFormSubmission}
      modalOpenButtonText="Grade"
      setOpen={setOpen}
      open={open}
      width={600}
      isLoading={isLoading}
      initialvalues={initialvalues}
      isFullWidthOpenButton
    >
      <FormObject form={form}  initialvalues={{quantity:1}}>

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
    </DraggableModelFullWidth>
  );
};

export default AddGrade;
