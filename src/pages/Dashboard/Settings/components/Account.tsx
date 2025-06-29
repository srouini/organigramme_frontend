import FormField from "@/components/form/FormField";
import { mapInitialValues } from "@/utils/functions";
import { Divider, Form, Row } from "antd";
import FormObject from "@/components/Form";
import useData from "@/hooks/useData";
import { API_USERS_ENDPOINT } from "@/api/api";


// @ts-ignore
export default () => {
  const [form] = Form.useForm();

  const {
    data,
  } = useData({
    endpoint: API_USERS_ENDPOINT+"/",
    name: "GET_ACTIVE_ACCOUNT",
    params: {
    },
  });


  // const handleFormSubmission = async () => {
  //   let values = await form.validateFields();
  //   //   if (initialvalues) {
  //   //     values.id = initialvalues?.id;
  //   //   }
  //   values = formatDate("accostage", values);
  //   mutate(values);
  // };

  // const onSuccess = () => {
  //   message.success("Submission successful");
  // };

  // const { mutate, isLoading } = usePost({
  //   onSuccess: onSuccess,
  //   endpoint: API_MRNS_ENDPOINT,
  // });

  return (
    <FormObject form={form} initialvalues={mapInitialValues(data?.data)}>
      <Row gutter={24} style={{ width: "50%" }}>
        <FormField
          label="Nom Complete"
          disabled={true}
          name="full_name"
          span={24}
          required
          span_md={24}
          type="text"
        />
        <FormField
          label="Prénom"
          name="first_name"
          span={24}
          required
          span_md={24}
          type="text"
        />
        <FormField
          label="Nom"
          name="last_name"
          span={24}
          required
          span_md={24}
          type="text"
        />
        <FormField
          label="Email"
          name="email"
          span={24}
          required
          span_md={24}
          type="text"
        />

      </Row>

      <Divider dashed style={{ marginTop: "0px" }} />
      <Row gutter={24}></Row>
    </FormObject>
  );
};
