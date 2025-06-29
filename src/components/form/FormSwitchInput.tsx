import { Form, Switch } from "antd";
import React from "react";
import type { FormItemProps } from "antd/es/form";

interface FormSwitchInputProps extends Omit<FormItemProps, "children"> {
  name: string;
  label: string;
  required?: boolean;
  message?: string;
  initialValue?: boolean;
  disabled?: boolean;
  checkedChildren?: React.ReactNode;
  unCheckedChildren?: React.ReactNode;
}

const FormSwitchInput: React.FC<FormSwitchInputProps> = ({
  name,
  label,
  required = false,
  message = "",
  initialValue = false,
  disabled = false,
  checkedChildren = "OUI",
  unCheckedChildren = "NONE",
}) => {
  return (
    <Form.Item
      name={name}
      label={label}
      rules={[{ required: required, message: message }]}
      initialValue={initialValue}
      hidden={disabled}
    >
      <Switch
        defaultChecked={initialValue}
        checkedChildren={checkedChildren}
        unCheckedChildren={unCheckedChildren}
        disabled={disabled}
      />
    </Form.Item>
  );
};

export default FormSwitchInput;
