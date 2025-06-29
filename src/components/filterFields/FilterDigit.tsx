import React, { useState } from "react";
import { ProFormDigit } from "@ant-design/pro-components";
import { Select } from "antd";

interface ProNumberInputProps {
  name: string;
  label: string;
  required?: boolean;
  message?: string;
  step?: number;
  min?: number;
  max?: number;
  att?: any; // Adjust this type if you have a specific type for Form.Item props
  hasAddOn?: boolean;
  inputColSpan?: number;
  addonColSpan?: number;
}

const FilterDigit: React.FC<ProNumberInputProps> = ({
  name,
  label,
  min = 0,
  max,
  hasAddOn = false,
}) => {
  const [suffix, setSuffix] = useState<string>("");

  const options = [
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

  const suffixElement = hasAddOn ? (
    <Select
      value={suffix}
      onSelect={handleOnSelect}
      options={options}
      allowClear={true}
    />
  ) : null;

  return (
    <ProFormDigit
      name={name}
      label={label}
      addonWarpStyle={{width:"100%"}}
      min={min}
      max={max}
      addonAfter={suffixElement}
      transform={(value) => ({ [`${name}${"__"+suffix}`]: value })}

    />
  );
};

export default FilterDigit;
