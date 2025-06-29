import React from "react";
import type { FormItemProps } from "antd/es/form";
import { ProFormSelect } from "@ant-design/pro-components";
import { transformSelectFilter } from "@/utils/functions";
import { selectConfig } from "@/utils/config";

interface FormSelectInputProps extends Omit<FormItemProps, "children"> {
  name: string;
  label: string;
  required?: boolean;
  message?: string;
  placeholder?: string;
  option_label: string;
  option_value: string;
  mode?: "multiple" | "tags" | "single" | undefined;
  att?: Record<string, any>;
  disabled?: boolean;
  isLoading?: boolean;
  data: any;
}

const FilterSelect: React.FC<FormSelectInputProps> = ({
  name,
  label,
  data,
  isLoading,
  option_label,
  option_value="id",
  mode,
  disabled = false,
}) => {
  return (
    <ProFormSelect
      {...selectConfig}
      disabled={disabled}
      options={data}
      label={label}
      name={name}
      fieldProps={{
        fieldNames: { label: option_label, value: option_value},
        loading:isLoading,
        maxTagCount: 'responsive',
      }}
      allowClear
      mode={mode}
      showSearch
      transform={(value) => transformSelectFilter(mode, name, value)}
    />
  );
};

export default FilterSelect;
