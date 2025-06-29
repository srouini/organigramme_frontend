import {
  API_USER_PROFILE_ENDPOINT,
} from "@/api/api";
import FormField from "@/components/form/FormField";
import usePost from "@/hooks/usePost";
import { mapInitialValues } from "@/utils/functions";
import { Button, Col, ColorPicker, Divider, Form, message, Row } from "antd";
import FormObject from "@/components/Form";
import useData from "@/hooks/useData";
import { useEffect, useState } from "react";
import { ReloadOutlined, UndoOutlined } from "@ant-design/icons";
import useProfile from "@/hooks/useProfile";

export default () => {
  const [form] = Form.useForm();

  const {profile} = useProfile();
  const {
    data,
    refetch
  } = useData({
    endpoint: API_USER_PROFILE_ENDPOINT + profile?.id + "/",
    name: "GET_ACTIVE_PROFILE",
    params: {
    },
  });

  useEffect(() => {
    if(data?.data)
      {if(profile!==data?.data){
        localStorage.setItem("profile", JSON.stringify(data?.data));
      }}
  },[data])

  const [primaryColor, setPrimaryColor] = useState(profile?.colorPrimary) 

  const handleFormSubmission = async () => {
    let values = await form.validateFields();
    values["id"] = profile?.id;
    values["colorPrimary"] = primaryColor;
    mutate(values);
  };


  const onSuccess = () => {
    message.success("Submission successful");
    refetch();
  };

  const { mutate } = usePost({
    onSuccess: onSuccess,
    endpoint: API_USER_PROFILE_ENDPOINT,
  });

  const handleChange = (value:any) => {
    setPrimaryColor(value.toHex())
  }
  const resetColor = () => {
    setPrimaryColor("FA541C");
  }

  const handleWindowRefrech = () => {
    window.location.reload();
  }

  const getProfile = () => {
    const profile = localStorage.getItem("profile");
    if (profile) {
      return JSON.parse(profile);
    } else {
      return {};
    }
  };

  const handleLayoutChange = (values:any) => {
     console.log(values)
     let profile = getProfile();
     profile.layout = values;
     localStorage.setItem("profile",JSON.stringify(profile))
  }

  return (
    <FormObject
      form={form}
      initialvalues={mapInitialValues(profile)}
    >
      <Row gutter={24} style={{ width: "50%" }}>
        <FormField
          label="Layout"
          name="layout"
          onChange={handleLayoutChange}
          span={24}
          required
          span_md={24}
          option_label="label"
          option_value="value"
          options={[
            { label: "Top", value: "top" },
            { label: "Side", value: "side" },
          ]}
          type="select"
        />
        <FormField
          label="Saider Manu Type"
          name="siderMenuType"
          span={24}
          required
          span_md={24}
          option_label="label"
          option_value="value"
          options={[
            { label: "Group", value: "group" },
            { label: "Sub", value: "sub" },
          ]}
          type="select"
        />
      </Row>
      <Divider dashed style={{ marginTop: "0px" }} />
      <Row align={"middle"} gutter={8}>
        <Col style={{marginRight:"20px"}}>Couleur</Col>
        <Col style={{display:"flex",alignItems:"center"}}>
          <ColorPicker  defaultFormat="hex" value={primaryColor} onChange={handleChange}/>
        </Col>
        <Col>
          <Button icon={<ReloadOutlined />} style={{margin:"0px"}} onClick={resetColor}/>
        </Col>
      </Row>
      <Divider dashed style={{ marginTop: "20px" }} />
      <Row gutter={24}>
        <Col><Button type="primary" onClick={handleFormSubmission}>
          Submit
        </Button></Col>
        <Col>
        <Button type="dashed" onClick={handleWindowRefrech} icon={<UndoOutlined />}>
          Apply new settings
        </Button>
        </Col>
      </Row>
    </FormObject>
  );
};
