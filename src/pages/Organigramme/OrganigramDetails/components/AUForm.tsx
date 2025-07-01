import { useEffect, useState } from "react";
import DraggableModel from "../../../../components/DraggableModel";
import FormObject from "../../../../components/Form";
import { Divider, Form, message, Row } from "antd";
import usePost from "../../../../hooks/usePost";
import { mapInitialValues } from "../../../../utils/functions";
import { useReferenceContext } from "../../../../context/ReferenceContext";
import { API_ORGANIGRAMMES_ENDPOINT } from "@/api/api";
import FormField from "@/components/form/FormField";
import { YES_NO_CHOICES } from "@/utils/constants";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";

interface AUFormProps {
  refetch: () => void;
  initialvalues: any;
  tc: any;
  editText?: string;
  addText?: string;
  hasIcon?: boolean;
}

const AUForm: React.FC<AUFormProps> = ({
  refetch,
  initialvalues,
  tc,
  editText = "MODIFIER",
  addText = "Sous Article",
  hasIcon = false,
}) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const { organigrams } = useReferenceContext();


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
    organigrams?.refetch();
  };

  const { mutate, isLoading } = usePost({
    onSuccess: onSuccess,
    endpoint: API_ORGANIGRAMMES_ENDPOINT,
  });

  return (
    <DraggableModel
      OkButtontext="Submit"
      modalOpenButtonText={initialvalues ? editText : addText} 
      modalTitle="Sous Article"
      addButtonType="dashed"
      addButtonIcon={
        hasIcon && initialvalues ? <EditOutlined /> : <PlusOutlined />
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
            name="numero"
            label="Numéro"
            type="text"
            required
            span_md={12}
          />
          <FormField name="bl" label="BL" type="text" span_md={12} />
          <FormField
            name="client"
            label="Client"
            type="select"
            options={client?.results}
            option_label="raison_sociale"
            required
            span_md={24}
          />
          <FormField
            name="transitaire"
            label="Transitaire"
            type="select"
            options={transitaire?.results}
            option_label="raison_sociale"
            option_value="id"
            disabled
            span_md={24}
          />
          <FormField
            name="dangereux"
            label="Dangereux"
            type="select"
            options={YES_NO_CHOICES}
            option_value="value"
            span_md={12}
          />
          <Divider style={{ marginTop: "0px" }} />
          <FormField
            name="designation"
            label="Marchandise"
            type="text"
            required
            span_md={24}
          />
          <Divider style={{ marginTop: "0px" }} />
          <FormField name="volume" label="Volume" type="number" step={0.01} />
          <FormField name="poids" label="Poids" type="number" step={0.01} />
          <FormField
            name="nombre_colis"
            label="Nombre de colis"
            type="number"
          />
          <FormField name="surface" label="Surface" type="number" step={0.01} />
          <FormField name="quantite" label="Quantité" type="number" />

          <Divider />

          <FormField
            name="box"
            label="Box"
            type="select"
            options={box?.results}
            option_label="designation"
            span_md={24}
          />
        </Row>
      </FormObject>
    </DraggableModel>
  );
};

export default AUForm;
