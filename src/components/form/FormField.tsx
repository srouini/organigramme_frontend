import React from "react";
import { Button, Col, Result } from "antd";
import FormTextInput from "./FormTextInput"; // Adjust the import path as needed
import FormDateInput from "./FormDateInput"; // Adjust the import path as needed
import ProFormSelect from "@ant-design/pro-form/lib/components/Select"; // Adjust the import path as needed
import { selectConfig } from "@/utils/config";
import ForNumberInput from "./FormNumberInput";
import FormDateTimeInput from "./FormDateTimeInput";
import { InboxOutlined, SmileOutlined } from "@ant-design/icons";

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
  addFormComponent?: React.ComponentType<any>;
  showAddButton?: boolean;
  addButtonText?: string;
  onAddItem?: (newItem: any) => void;
  mode?:any
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
  addFormComponent: AddFormComponent,
  showAddButton = false,
  addButtonText = "Add New",
  onAddItem,
  mode
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
            name={name}
            label={label}
            placeholder={placeholder}
            options={options}
            {...selectConfig}
            fieldProps={{
              ...selectConfig,
              disabled,
              onChange,
              fieldNames: {
                label: option_label,
                value: option_value,
              },
              maxTagCount: 'responsive',
              defaultValue:defaultValue,
              notFoundContent: AddFormComponent ? (
                <div style={{ padding: '8px', textAlign: 'center' }}>
                  <AddFormComponent
                    onAdded={(newItem:any) => {
                      if (onAddItem) {
                        onAddItem(newItem);
                      }
                    }}
                  />
                </div>
              ) : undefined,
            }}
            initialValue={initialValue}
            required={required}
            rules={rules}
            mode={mode}
            valueEnum={
              options?.length
                ? options.reduce((acc: any, curr: any) => {
                  // @ts-ignore
                    acc[curr[option_value]] = curr[option_label];
                    return acc;
                  }, {})
                : undefined
            }
          />
        </Col>
      );

    default:
      return null;
  }
};

export default FormField;
