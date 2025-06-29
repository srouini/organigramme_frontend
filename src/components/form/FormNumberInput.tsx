import { Form, Select, InputNumber, Col, Row } from "antd";
import React, { useState } from "react";
import type { SelectProps } from "antd/es/select";
import type { FormItemProps } from "antd/es/form";

interface ForNumberInputProps extends Omit<FormItemProps, "children"> {
  name: string;
  label: string;
  required?: boolean;
  message?: string;
  step?: number;
  min?: number;
  max?: number;
  att?: any; // You may want to refine this type if you have specific props
  hasAddOn?: boolean;
  inputColSpan?: number;
  addonColSpan?: number;
  disabled?:boolean
}

const ForNumberInput: React.FC<ForNumberInputProps> = ({
  name,
  label,
  required = false,
  message = "",
  step,
  min = 0,
  max,
  att = {},
  hasAddOn = false,
  inputColSpan = 19,
  addonColSpan = 5,
  disabled=false
}) => {
  const [suffix, setSuffix] = useState<string>("");

  const options: SelectProps["options"] = [
    { label: "=", value: "" },
    { label: "<", value: "__lt" },
    { label: ">", value: "__gt" },
    { label: "< et =", value: "__lte" },
    { label: "> et =", value: "__gte" },
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
        >
          <InputNumber step={step} style={{ width: "100%" }} min={min} max={max} disabled={disabled} />
        </Form.Item>
      </Col>
      {hasAddOn && (
        <Col span={addonColSpan}>
          <Select
            style={{ width: "100%" }}
            value={suffix}
            onSelect={handleOnSelect}
            options={options}
            allowClear
          />
        </Col>
      )}
    </Row>
  );
};

export default ForNumberInput;
