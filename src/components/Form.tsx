import React from "react";
import {
  Form
} from "antd";
import type { FormInstance } from "antd/es/form";
import { FormLayout } from "antd/es/form/Form";

interface Props {
  form: FormInstance<any>;
  children?: React.ReactNode;
  initialvalues?:any
  layout?:FormLayout
}

const App: React.FC<Props> = ({ form, children,initialvalues,layout="horizontal" }) => {
  const handleOnFinish = async () => {
    await form.validateFields();
  };

  return (
    <Form
      layout={layout}
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
