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
  rules?:any;
  allowClear?: boolean;
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
  rules,
  allowClear = false,
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
            options={options?.map(option => {
              // Handle case where option is already in the correct format
              if (option.value !== undefined && option.label !== undefined) {
                return option;
              }
              // Handle structure/object with id and name properties
              const label = option[option_label || 'name'] || option.name || option.label || option.id;
              const value = option[option_value || 'id'] || option.value || option.id;
              return {
                ...option,
                label,
                value,
                key: value // Ensure each option has a unique key
              };
            })}
            initialValue={initialValue}
            label={label}
            required={required}
            name={name}
            disabled={disabled}
            fieldProps={{
              showSearch: true,
              optionFilterProp: 'label',
              filterOption: (input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase().trim()),
              allowClear: true
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
