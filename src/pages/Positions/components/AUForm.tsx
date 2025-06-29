import { useEffect, useState } from "react";
import DraggableModel from "@/components/DraggableModel";
import FormObject from "@/components/Form";
import { Divider, Form, message, Row } from "antd";
import usePost from "@/hooks/usePost";
import { mapInitialValues } from "@/utils/functions";
import { useReferenceContext } from "@/context/ReferenceContext";
import { API_POSITIONS_ENDPOINT } from "@/api/api";
import FormField from "@/components/form/FormField";
import { YES_NO_CHOICES } from "@/utils/constants";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { usePermissions } from "@/utils/permissions";

const formatDate = (field: string, values: any) => {
  if (values[field]) values[field] = values[field].format("YYYY-MM-DD");
  return values;
};

interface AUFormProps {
  refetch: () => void;
  initialvalues: any;
  article: any;
  editText?: string;
  addText?: string;
  hasIcon?: boolean;
  disabled?:boolean

}

const AUForm: React.FC<AUFormProps> = ({
  refetch,
  initialvalues,
  article,
  editText = "MODIFIER",
  addText = "Mrn",
  hasIcon = false,
  disabled=false
}) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const { containerType } = useReferenceContext();

  useEffect(() => {
    containerType.fetch();
  }, []);

  const {} = useReferenceContext();

  const handleFormSubmission = async () => {
    let values = await form.validateFields();
    if (initialvalues) {
      values.id = initialvalues?.id;
    }else{
      values.article = parseInt(article);
    }
    
    values = formatDate("accostage", values);
    mutate(values);
  };

  const onSuccess = () => {
    message.success("Submission successful");
    setOpen(false);
    refetch();
  };

  const { mutate, isLoading } = usePost({
    onSuccess: onSuccess,
    endpoint: API_CONTENEURS_ENDPOINT,
  });

  const hasPermission = usePermissions();

  return (
    <DraggableModel
      OkButtontext="Submit"
      modalOpenButtonText={initialvalues ? editText : addText} 
      modalTitle="Conteneur"
      addButtonType="dashed"
      addButtonIcon={
        hasIcon && initialvalues ? <EditOutlined /> : <PlusOutlined />
      }
      disabledModalOpenButton={disabled || (!initialvalues && !hasPermission('app.add_tc')) || (initialvalues && !hasPermission('app.change_tc'))}
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
            name="tc"
            label="Matricule"
            type="text"
            required
            span_md={24}
          />
          <FormField name="tar" label="Tar" type="text" required span_md={24} />
          <FormField
            name="poids"
            label="Poids"
            type="text"
            required
            span_md={24}
          />
          <FormField
            name="type_tc"
            label="Type"
            type="select"
            options={containerType?.results}
            option_label="designation"
            required
            span_md={24}
          />
          <Divider style={{ marginTop: "0px" }} />
          <FormField
            name="dangereux"
            label="Dangereux"
            type="select"
            options={YES_NO_CHOICES}
            required
            option_value="value"
            span_md={24}
          />
          <FormField
            name="frigo"
            label="Frigo"
            type="select"
            options={YES_NO_CHOICES}
            option_value="value"
            span_md={24}
          />
        </Row>
      </FormObject>
    </DraggableModel>
  );
};

export default AUForm;
