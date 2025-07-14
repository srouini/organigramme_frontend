import React, { useEffect, useState } from "react";
import DraggableModelFullWidth from "@/components/DraggableModel";
import FormObject from "@/components/Form";
import { Divider, Form, message, Row,Input } from "antd";
import usePost from "@/hooks/usePost";
import { mapInitialValues } from "@/utils/functions";
import { useReferenceContext } from "@/context/ReferenceContext";
import { API_POSITIONS_ENDPOINT, API_STRUCTURES_ENDPOINT } from "@/api/api";
import FormField from "@/components/form/FormField";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { YES_NO_CHOICES } from "@/utils/constants";

interface AUFormProps {
  refetch?: () => void;
  initialvalues?: any;
  onAdded?: (client: any) => void;
}
const { TextArea } = Input;
const AddStructure: React.FC<AUFormProps> = ({
  refetch,
  initialvalues,
  onAdded
}) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

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
    mutate(values);
  };

  const onSuccess = (response: any) => {
    message.success("Poste cree avec succes");
    setOpen(false);
    if (refetch) refetch();
    if (positions?.refetch) positions.refetch();

    // Call the callback with the newly created client
    if (onAdded && response) {
      onAdded({
        id: response.id,
        title: response.title,
        // Add any other fields you need
      });
    }
  };

  const { mutate, isLoading } = usePost({
    onSuccess: onSuccess,
    endpoint: API_POSITIONS_ENDPOINT,
  });

  return (
    <DraggableModelFullWidth
      OkButtontext="Submit"
      modalTitle="Ajouter un nouveau poste"
      onSubmit={handleFormSubmission}
      modalOpenButtonText="Poste"
      setOpen={setOpen}
      open={open}
      width={600}
      isLoading={isLoading}
      initialvalues={initialvalues}
    >
      <FormObject form={form}  >
        <Row gutter={24}>

          <FormField
            name="structure"
            label="Structure"
            type="select"
            options={structures?.results}
            option_label="name"
            
            span_md={24}
          />
          <FormField
            name="parent"
            label="Supérieur Hiérarchique"
            type="select"
            options={positions?.results?.filter((p: any) => p.id !== initialvalues?.id)}
            option_label="title"
            span_md={24}
          />
          <Divider style={{ marginTop: "0px" }} />
          <FormField
            name="title"
            label="Title"
            type="text"
            required
            span_md={24}
          />
          <FormField
            name="abbreviation"
            label="Abbreviation"
            type="text"
            span_md={24}
          />
          <FormField
            name="grade"
            label="Grade"
            type="select"
            options={grades?.results}
            option_label="name"
            required
            span_md={24}
          />
          <FormField
            name="category"
            label="Categorie"
            type="text"

            span_md={24}
          />
          <Divider style={{ marginTop: "0px" }} />

          <FormField
            name="mission_principal"
            label="Mission Principale"
            type="text"
            required
            span_md={24}
          />

          <FormField
            name="formation"
            label="Formation"
            type="text"
            required
            span_md={24}
          />


          <FormField
            name="experience"
            label="Expérience"
            type="text"
            required
            span_md={24}
          />
          <FormField
            name="quantity"
            label="Quantité"
            type="number"
            required
            span_md={24}
          />
        </Row>
      </FormObject>
    </DraggableModelFullWidth>
  );
};

export default AddStructure;
