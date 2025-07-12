import { useEffect, useState } from "react";
import DraggableModel from "@/components/DraggableModel";
import FormObject from "@/components/Form";
import { Divider, Form, message, Row } from "antd";
import usePost from "@/hooks/usePost";
import { mapInitialValues } from "@/utils/functions";
import { useReferenceContext } from "@/context/ReferenceContext";
import { API_STRUCTURES_ENDPOINT } from "@/api/api";
import FormField from "@/components/form/FormField";
import { STRUCTURE_STATES, YES_NO_CHOICES } from "@/utils/constants";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { usePermissions } from "@/utils/permissions";

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
  disabled?:boolean

}

const AUForm: React.FC<AUFormProps> = ({
  refetch,
  initialvalues,
  editText = "MODIFIER",
  addText = "Mrn",
  hasIcon = false,
  disabled=false
}) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const { structures } = useReferenceContext();

  useEffect(() => {
    structures?.fetch();
  },[])
  const handleFormSubmission = async () => {
    let values = await form.validateFields();
    if (initialvalues) {
      values.id = initialvalues?.id;
    }
    
    mutate(values);
  };

  const onSuccess = () => {
    message.success("Submission successful");
    setOpen(false);
    refetch();
    structures?.refetch();
  };

  const { mutate, isLoading } = usePost({
    onSuccess: onSuccess,
    endpoint: API_STRUCTURES_ENDPOINT,
  });

  const hasPermission = usePermissions();

  console.log(structures?.results)
  return (
    <DraggableModel
      OkButtontext="Sumettre"
      modalOpenButtonText={initialvalues ? editText : addText} 
      modalTitle="Structure"
      addButtonType="dashed"
      addButtonIcon={
        hasIcon && initialvalues ? <EditOutlined /> : <PlusOutlined />
      }
      disabledModalOpenButton={disabled || (!initialvalues && !hasPermission('structure.add_structure')) || (initialvalues && !hasPermission('structure.change_structure'))}
      onSubmit={handleFormSubmission}
      setOpen={setOpen}
      open={open}
      width={600}
      isLoading={isLoading}
      initialvalues={initialvalues}
    >
      <FormObject form={form} >
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
            name="is_main"
            label="Structure Principale"
            type="select"
            options={YES_NO_CHOICES}
            required
            option_value="value"
            span_md={24}
          />

        </Row>
      </FormObject>
    </DraggableModel>
  );
};

export default AUForm;
