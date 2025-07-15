import React, { useEffect, useState } from "react";
import DraggableModelFullWidth from "@/components/DraggableModel";
import FormObject from "@/components/Form";
import { Divider, Form, message, Row } from "antd";
import usePost from "@/hooks/usePost";
import { mapInitialValues } from "@/utils/functions";
import { useReferenceContext } from "@/context/ReferenceContext";
import {  API_STRUCTURES_ENDPOINT } from "@/api/api";
import FormField from "@/components/form/FormField";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { YES_NO_CHOICES } from "@/utils/constants";
import AddPosition from "./AddPosition";

interface AUFormProps {
  refetch?: () => void;
  initialvalues?: any;
  onAdded?: (client: any) => void;
}

const AddStructure: React.FC<AUFormProps> = ({ 
  refetch, 
  initialvalues,
  onAdded 
}) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const { structures,structuresUnonnected,positions,structureTypes } = useReferenceContext();

  // Fetch structures and positions when the form opens
  useEffect(() => {
    if (open) {
      structures?.fetch();
      positions?.fetch()
      structureTypes?.fetch()
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
    message.success("Structure added successfully");
    setOpen(false);
    if (refetch) refetch();
    if (structuresUnonnected?.refetch) structuresUnonnected.refetch();
    
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
    endpoint: API_STRUCTURES_ENDPOINT,
  });

  return (
    <DraggableModelFullWidth
      OkButtontext="Submit"
      modalTitle="Ajouter une nouvelle structure"
      isFullWidthOpenButton
      onSubmit={handleFormSubmission}
      modalOpenButtonText="Structure"
      setOpen={setOpen}
      open={open}
      width={600}
      isLoading={isLoading}
      initialvalues={initialvalues}
    >
     <FormObject form={form} initialvalues={mapInitialValues({is_main:false,initial_node:false})} >
        <Row gutter={24}>
          <FormField
            name="name"
            label="Nom"
            type="text"
            required
            span_md={24}
          />
          <FormField
            name="parent"
            label="Structure Parente"
            type="select"
            options={structures?.results}
            option_label="name"
            option_value="id"
            span_md={24}
          />
          <Divider style={{ marginTop: "0px" }} />
          
          <FormField
            name="type"
            label="Type"
            type="select"
            options={structureTypes?.results}
            option_label="name"
            option_value="id"
            span_md={24}
          />

          <FormField
            name="is_main"
            label="Structure Principale"
            type="select"
            options={YES_NO_CHOICES}
            required
            option_value="value"
            span_md={24}
          />
            <FormField
            name="initial_node"
            label="Structure Initiale"
            type="select"
            options={YES_NO_CHOICES}
            required
            option_value="value"
            span_md={24}
          />
          {/* Manager Selection */}
          <Divider style={{ marginTop: "0px" }} />
          <FormField
            name="manager"
            label="Manager"
            type="select"
            options={positions?.results}
            option_label="title"
            option_value="id"
            span_md={24}
            addFormComponent={AddPosition}
            onAddItem={(newRecord:any) => {
              console.log('Poste added successfully',newRecord.id);
              
              form.setFieldValue('manager', newRecord.id);
              positions?.refetch();
            }}
          />

          
         
        </Row>
      </FormObject>
    </DraggableModelFullWidth>
  );
};

export default AddStructure;
