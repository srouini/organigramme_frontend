import React from "react";
import { Form, Select } from "antd";
import type { SelectProps } from "antd/es/select";
import { ChoiceType } from "../../types/commun";


interface FormChoicesInputProps{
  name: string;
  label: string;
  required?: boolean;
  message?: string;
  placeholder?: string;
  initialValue?: any;
  option_label: string;
  option_value: string;
  disabled?: boolean;
  choices: ChoiceType[]; // Define the type for choices array
  mode?:  "multiple" | "tags" | undefined ;
}

const FormChoicesInput: React.FC<FormChoicesInputProps> = ({
  name,
  label,
  required = false,
  message = "",
  placeholder = "-",
  initialValue,
  option_label="label",
  option_value="value",
  disabled = false,
  choices,
  mode = "tags"

}) => {
  const filterOption: SelectProps<ChoiceType>["filterOption"] = (
    input,
    option: any
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  return (
    <Form.Item
      name={name}
      label={label}
      rules={[{ required: required, message: message }]}
      initialValue={initialValue}
      style={{
        width: "100%",
      }}
    >
      <Select
        showSearch
        disabled={disabled}
        placeholder={placeholder}
        optionFilterProp="children"
        filterOption={filterOption}
        fieldNames={{ label: option_label, value: option_value }}
        allowClear
        mode={mode}
        style={{
          width: "100%",
        }}
        options={choices}
      />
    </Form.Item>
  );
};

export default FormChoicesInput;
