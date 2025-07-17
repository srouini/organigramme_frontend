import { DatePicker, Form, Select, Col, Row } from "antd";
import React, { useState } from "react";
import type { SelectProps } from "antd/es/select";
import type { FormItemProps } from "antd/es/form";
import dayjs from "dayjs";
import { RangePickerProps } from "antd/es/date-picker";

interface FormDateInputProps extends Omit<FormItemProps, "children"> {
  name: string;
  label: string;
  required?: boolean;
  message?: string;
  hasAddOn?: boolean;
  inputColSpan?: number;
  addonColSpan?: number;
  disabled?:boolean;
  maxDate?:any;
}

const FormDateTimeInput: React.FC<FormDateInputProps> = ({
  name,
  label,
  required = false,
  message = "",
  hasAddOn = false,
  inputColSpan = 19,
  addonColSpan = 5,
  disabled=false, 
}) => {
  const [suffix, setSuffix] = useState<string>("");

  const options: SelectProps["options"] = [
    {
      label: "=",
      value: "",
    },
    {
      label: "<",
      value: "__lt",
    },
    {
      label: ">",
      value: "__gt",
    },
    {
      label: "< et =",
      value: "__lte",
    },
    {
      label: "> et =",
      value: "__gte",
    },
  ];

  const handleOnSelect = (value: string) => {
    setSuffix(value);
  };

  const isSuffix = (): string => {
    return hasAddOn ? name + suffix : name;
  };


  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    // Can not select days before today and today
    return current && current < dayjs().subtract(1, 'day').endOf('day');
  };


  return (
    <Row gutter={12}>
      <Col span={hasAddOn ? inputColSpan : 24}>
        <Form.Item
          name={isSuffix()}
          label={label}
          rules={[{ required: required, message: message }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            format="YYYY-MM-DD HH:mm:ss"
            disabled={disabled}
            showTime
            // disabledDate={disabledDate}
          />
        </Form.Item>
      </Col>
      {hasAddOn && (
        <Col span={addonColSpan}>
          <Select
            style={{
              width: "100%",
            }}
            value={suffix}
            onSelect={handleOnSelect}
            options={options}
          />
        </Col>
      )}
    </Row>
  );
};

export default FormDateTimeInput;
