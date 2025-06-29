import React from "react";
import useData from "../../hooks/useData";
import { Form, Select } from "antd";
import type { SelectProps } from "antd/es/select";
import type { FormItemProps } from "antd/es/form";

interface FormSelectInputProps extends Omit<FormItemProps, "children"> {
  endpoint: string;
  name: string;
  label: string;
  required?: boolean;
  message?: string;
  placeholder?: string;
  params?: Record<string, any>;
  filters?: Record<string, any>;
  option_label: string;
  option_value: string;
  initialValue?: any;
  mode?: "multiple" | "tags" | undefined;
  att?: Record<string, any>;
  disabled?: boolean;
}

const FormSelectInput: React.FC<FormSelectInputProps> = ({
  endpoint,
  name,
  label,
  required = false,
  message = "",
  placeholder = "-",
  params = {},
  filters = {},
  option_label,
  option_value,
  initialValue,
  mode,
  att = {},
  disabled = false,
}) => {
  const filterOption: SelectProps['filterOption'] = (input, option) =>
    (option?.[option_label]?.toString() ?? "").toLowerCase().includes(input.toLowerCase());

  const { data, isLoading } = useData({
    endpoint,
    params: { ...params, ...filters },
    name: "SELECT_" + name,

  });


  return (
    <Form.Item
      {...att}
      name={name}
      label={label}
      rules={[{ required, message }]}
      initialValue={initialValue}
      style={{ minWidth: "300px", width: "100%" }}
    >
      <Select
        disabled={disabled}
        mode={mode}
        showSearch
        options={data?.data}
        placeholder={placeholder}
        fieldNames={{ label: option_label, value: option_value }}
        optionFilterProp="children"
        filterOption={filterOption}
        allowClear
        loading={isLoading} // Show loading state if data is being fetched
      />
    </Form.Item>
  );
};

export default FormSelectInput;
