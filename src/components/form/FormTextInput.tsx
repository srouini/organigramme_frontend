import { Form, Select, Row, Input, Col } from "antd";
import React, { useState } from "react";
import type { FormItemProps } from "antd/es/form";
import type { SelectProps } from "antd/es/select";

interface FormTextInputProps extends Omit<FormItemProps, "children"> {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  message?: string;
  initSuffix?: string;
  att?: Record<string, any>;
  hasAddOn?: boolean;
  inputColSpan?: number;
  addonColSpan?: number;
  disabled?:boolean;
  initialValue?:string;
}

const FormTextInput: React.FC<FormTextInputProps> = ({
  name,
  label,
  placeholder = "-",
  required = false,
  message = "",
  initSuffix = "__icontains",
  att = {},
  hasAddOn = false,
  inputColSpan = 19,
  addonColSpan = 5,
  disabled=false,
  initialValue
}) => {
  const [suffix, setSuffix] = useState<string>(initSuffix);

  const options: SelectProps['options'] = [
    {
      label: "Exact",
      value: "__exact",
    },
    {
      label: "Contient",
      value: "__icontains",
    },
  ];

  const handleOnSelect = (value: string) => {
    setSuffix(value);
  };

  const isSuffix = (): string => {
    return hasAddOn ? name + suffix : name;
  };

  return (
    <Row>
      <Col span={hasAddOn ? inputColSpan : 24}>
        <Form.Item
          name={isSuffix()}
          label={label}
          rules={[{ required: required, message: message }]}
          {...att}
          initialValue={initialValue}
        >
          <Input placeholder={placeholder} allowClear disabled={disabled}/>
        </Form.Item>
      </Col>
      {hasAddOn && (
        <Col span={addonColSpan}>
          <Select
            style={{ width: "100%" }}
            value={suffix}
            onSelect={handleOnSelect}
            options={options}
          />
        </Col>
      )}
    </Row>
  );
};

export default FormTextInput;
