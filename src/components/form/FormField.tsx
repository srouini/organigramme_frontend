import React from "react";
import { Col } from "antd";
import FormTextInput from "./FormTextInput"; // Adjust the import path as needed
import FormDateInput from "./FormDateInput"; // Adjust the import path as needed
import ProFormSelect from "@ant-design/pro-form/lib/components/Select"; // Adjust the import path as needed
import { selectConfig } from "@/utils/config";
import ForNumberInput from "./FormNumberInput";
import FormDateTimeInput from "./FormDateTimeInput";

interface FormFieldProps {
  name: string;
  label: string;
  type: "text" | "date" | "dateTime" | "select" | "number";
  span?: number;
  span_md?: number;
  options?: Array<any>;
  option_value?: string;
  option_label?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  step?:number;
  initialValue?:any;
  onChange?:any;
  defaultValue?:any;
  maxDate?:any;
  minDate?:any;
  minValue?:number;
  maxValue?:number;
  rules?:any
}

const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  type,
  span = 24,
  span_md = 12,
  options,
  option_value = "id",
  option_label,
  required = false,
  placeholder = "-",
  disabled = false,
  step=1,
  initialValue,
  defaultValue,
  onChange, 
  minDate,
  maxDate, 
  minValue, 
  maxValue,
  rules
}) => {
  switch (type) {
    case "text":
      return (
        <Col span={span} md={span_md}>
          <FormTextInput
            name={name}
            label={label}
            required={required}
            placeholder={placeholder}
            disabled={disabled}
            initialValue={initialValue}
            rules={rules}
          />
        </Col>
      );
    case "number":
      return (
        <Col span={span} md={span_md}>
          <ForNumberInput
            name={name}
            label={label}
            required={required}
            disabled={disabled}
            step={step}
            initialValue={initialValue}
            min={minValue}
            max={maxValue}
            rules={rules}
          />
        </Col>
      );
    case "date":
      return (
        <Col span={span} md={span_md}>
          <FormDateInput
            name={name}
            label={label}
            required={required}
            disabled={disabled}
            initialValue={initialValue}
            defaultValue={defaultValue}
            maxDate={maxDate}
            minDate={minDate}
            rules={rules}
          />
        </Col>
      );

      case "dateTime":
        return (
          <Col span={span} md={span_md}>
            <FormDateTimeInput
             maxDate={maxDate}
              name={name}
              label={label}
              required={required}
              disabled={disabled}
              rules={rules}
            />
          </Col>
        );

        
    case "select":
      return (
        <Col span={span} md={span_md}>
          <ProFormSelect
          style={{width:`${span_md === 24 ? "100%" : ""}`}}
            {...selectConfig}
            width="lg"
            onChange={onChange}
            options={options}
            initialValue={initialValue}
            label={label}
            required={required}
            name={name}
            disabled={disabled}
            fieldProps={{
              fieldNames: { label: option_label, value: option_value },
              maxTagCount: 'responsive',
              defaultValue:defaultValue
            }}
            placeholder={placeholder}
            rules={rules}
          />
        </Col>
      );

    default:
      return null;
  }
};

export default FormField;
