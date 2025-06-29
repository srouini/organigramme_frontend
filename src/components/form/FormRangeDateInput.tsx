import { DatePicker, Form } from "antd";
import React from "react";
import type { FormItemProps } from "antd/es/form";

const { RangePicker } = DatePicker;

interface FormRangeDateInputProps extends Omit<FormItemProps, "children"> {
  name: string;
  label: string;
  required?: boolean;
  message?: string;
}

const FormRangeDateInput: React.FC<FormRangeDateInputProps> = ({
  name,
  label,
  required = false,
  message = "",
}) => {
  const dateFormat = "YYYY/MM/DD";
  return (
    <Form.Item
      name={name}
      label={label}
      rules={[{ required: required, message: message }]}
      style={{ width: "100%" }}
    >
      <RangePicker
        format={dateFormat}
        style={{ width: "100%" }}
      />
    </Form.Item>
  );
};

export default FormRangeDateInput;
