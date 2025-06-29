import React from "react";
import {
  Form
} from "antd";
import type { FormInstance } from "antd/es/form";

interface Props {
  form: FormInstance<any>;
  children?: React.ReactNode;
  initialvalues?:any
}

const App: React.FC<Props> = ({ form, children,initialvalues }) => {
  const handleOnFinish = async () => {
    await form.validateFields();
  };

  return (
    <Form
      layout="horizontal"
      style={{ padding: "10px", paddingTop: "20px" }}
      form={form}
      onFinish={handleOnFinish}
      initialValues={initialvalues}
      key={initialvalues?.id}
    >
      {children}
    </Form>
  );
};

export default App;
