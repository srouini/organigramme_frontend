import useData from "@/hooks/useData";
import { selectConfig } from "@/utils/config";
import { ProFormSelect } from "@ant-design/pro-components";
import { Col, FormInstance } from "antd";
import React, { useState } from "react";

interface Props {
  nameP: string;
  labelP: string;
  spanP?: number;
  span_mdP?: number;
  optionsP?: Array<any>;
  option_valueP?: string;
  option_labelP?: string;
  requiredP?: boolean;
  placeholderP?: string;
  disabledP?: boolean;

  nameC: string;
  labelC: string;
  spanC?: number;
  span_mdC?: number;
  related_attribute: string;
  option_valueC?: string;
  option_labelC?: string;
  requiredC?: boolean;
  placeholderC?: string;
  disabledC?: boolean;
  form: FormInstance<any>;
  related_endpoint:string;
  QUERY_NAME:string;
}

const FormRelatedSelectInput: React.FC<Props> = ({
  nameP,
  labelP,
  spanP = 24,
  span_mdP = 12,
  optionsP,
  option_valueP = "id",
  option_labelP = "label",
  requiredP = false,
  placeholderP = "-",
  disabledP = false,
  nameC,
  labelC,
  spanC = 24,
  span_mdC = 12,
  related_attribute,
  option_valueC = "id",
  option_labelC = "label",
  requiredC = false,
  placeholderC = "-",
  disabledC = false,
  form,
  related_endpoint,
  QUERY_NAME="GET_OBJECTS"
}) => {

const [selected, setSelected] = useState(null);

  const {
    data,
    isLoading,
    isFetching,
    refetch,
  } = useData({
    endpoint: related_endpoint,
    name: QUERY_NAME,
    params: {
      all: true,
      [related_attribute]: selected,
    },
    enabled:selected!==null
  });
  const handleSelectionChange = (e: any) => {
    setSelected(e);
    refetch();
    form.setFieldsValue({ [nameC]: null });
  };


  return (
    <>
      <Col span={spanP} md={span_mdP}>
        <ProFormSelect
          {...selectConfig}
          width="lg"
          onChange={handleSelectionChange}
          options={optionsP}
          label={labelP}
          required={requiredP}
          name={nameP}
          disabled={disabledP}
          fieldProps={{
            fieldNames: { label: option_labelP, value: option_valueP },
            maxTagCount: "responsive",
          }}
          placeholder={placeholderP}
        />
      </Col>
      <Col span={spanC} md={span_mdC}>
        <ProFormSelect
          {...selectConfig}
          width="lg"
          options={data?.data}
          label={labelC}
          required={requiredC}
          name={nameC}
          disabled={disabledC}
          fieldProps={{
            loading:isLoading || isFetching,
            fieldNames: { label: option_labelC, value: option_valueC },
            maxTagCount: "responsive",
          }}
          placeholder={placeholderC}
        />
      </Col>
    </>
  );
};

export default FormRelatedSelectInput;
