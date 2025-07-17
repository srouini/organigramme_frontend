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
import TextArea from "antd/es/input/TextArea";
import AddGrade from "@/components/references/AddGrade";

const formatDate = (field: string, values: any) => {
  if (values[field]) values[field] = values[field].format("YYYY-MM-DD");
  return values;
};

interface AUFormProps {
  refetch: any;
  initialvalues?: any;
  editText?: string;
  addText?: string;
  hasIcon?: boolean;
  disabled?: boolean

}

const AUForm: React.FC<AUFormProps> = ({
  refetch,
  initialvalues,
  editText = "MODIFIER",
  addText = "Mrn",
  hasIcon = false,
  disabled = false
}) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const { grades, structures, positions } = useReferenceContext();


useEffect(()=>{
  grades?.fetch();
  structures?.fetch();
  positions?.fetch();
},[])


  const handleFormSubmission = async () => {
    let values = await form.validateFields();
    if (initialvalues) {
      values.id = initialvalues?.id;
    }
    console.log(values)
    if (values['structure'] ===undefined) values.structure = null;

    mutate(values);
  };

  const onSuccess = () => {
    message.success("Submission successful");
    setOpen(false);
    refetch();
    positions?.refetch();
  };

  const { mutate, isLoading } = usePost({
    onSuccess: onSuccess,
    endpoint: API_POSITIONS_ENDPOINT,
  });

  const hasPermission = usePermissions();


  return (
    <DraggableModel
      OkButtontext="Submit"
      modalOpenButtonText={initialvalues ? editText : addText}
      modalTitle="Position"
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
      <FormObject form={form} initialvalues={mapInitialValues(initialvalues? initialvalues : {mission_principal:"",formation:"",experience:"",quantity:1})}>
        <Row gutter={24}>

          <FormField
            name="structure"
            label="Structure"
            type="select"
            options={structures?.results}
            option_label="name"
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
            addFormComponent={AddGrade}
            onAddItem={(newRecord:any) => {                          
              form.setFieldValue('grade', newRecord.id);
              grades?.refetch();
            }}
          />
          <FormField
            name="category"
            label="Categorie"
            type="text"
            
            span_md={24}
          />
          <Divider style={{ marginTop: "0px" }} />

          <Form.Item label="Mission Principale" name="mission_principal" style={{ width: '100%' }}>
            <TextArea rows={4} />
          </Form.Item>

          <FormField
            name="formation"
            label="Formation"
            type="text"
            
            span_md={24}
          />
          <FormField
            name="experience"
            label="Expérience"
            type="text"
            
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
    </DraggableModel>
  );
};

export default AUForm;
