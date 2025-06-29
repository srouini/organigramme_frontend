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
  related_attributeC: string;
  option_valueC?: string;
  option_labelC?: string;
  requiredC?: boolean;
  placeholderC?: string;
  disabledC?: boolean;

  nameD: string;
  labelD: string;
  spanD?: number;
  span_mdD?: number;
  related_attributeD: string;
  option_valueD?: string;
  option_labelD?: string;
  requiredD?: boolean;
  placeholderD?: string;
  disabledD?: boolean;

  form: FormInstance<any>;
  related_endpointC: string;
  related_endpointD: string;
  QUERY_NAME_C: string;
  QUERY_NAME_D: string;
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
  related_attributeC,
  option_valueC = "id",
  option_labelC = "label",
  requiredC = false,
  placeholderC = "-",
  disabledC = false,
  nameD,
  labelD,
  spanD = 24,
  span_mdD = 12,
  related_attributeD,
  option_valueD = "id",
  option_labelD = "label",
  requiredD = false,
  placeholderD = "-",
  disabledD = false,
  form,
  related_endpointC,
  related_endpointD,
  QUERY_NAME_C = "GET_OBJECTS_C",
  QUERY_NAME_D = "GET_OBJECTS_D"
}) => {

  const [selectedP, setSelectedP] = useState(null);
  const [selectedC, setSelectedC] = useState(null);

  // Fetch data for second select field (C)
  const {
    data: dataC,
    isLoading: isLoadingC,
    isFetching: isFetchingC,
    refetch: refetchC,
  } = useData({
    endpoint: related_endpointC,
    name: QUERY_NAME_C,
    params: {
      all: true,
      [related_attributeC]: selectedP,
    },
    enabled: selectedP !== null
  });

  // Fetch data for third select field (D)
  const {
    data: dataD,
    isLoading: isLoadingD,
    isFetching: isFetchingD,
    refetch: refetchD,
  } = useData({
    endpoint: related_endpointD,
    name: QUERY_NAME_D,
    params: {
      all: true,
      [related_attributeD]: selectedC,
    },
    enabled: selectedC !== null
  });

  const handleSelectionChangeP = (e: any) => {
    setSelectedP(e);
    refetchC();
    form.setFieldsValue({ [nameC]: null, [nameD]: null }); // Reset dependent fields
  };

  const handleSelectionChangeC = (e: any) => {
    setSelectedC(e);
    refetchD();
    form.setFieldsValue({ [nameD]: null }); // Reset third field
  };

  return (
    <>
      {/* First Select Input */}
      <Col span={spanP} md={span_mdP}>
        <ProFormSelect
          {...selectConfig}
          width="lg"
          onChange={handleSelectionChangeP}
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

      {/* Second Select Input */}
      <Col span={spanC} md={span_mdC}>
        <ProFormSelect
          allowClear={false}
          showSearch
          width="lg"
          onChange={handleSelectionChangeC}
          options={dataC?.data}
          label={labelC}
          required={requiredC}
          name={nameC}
          disabled={disabledC}
          fieldProps={{
            loading: isLoadingC || isFetchingC,
            fieldNames: { label: option_labelC, value: option_valueC },
            maxTagCount: "responsive",
          }}
          placeholder={placeholderC}
        />
      </Col>

      {/* Third Select Input */}
      <Col span={spanD} md={span_mdD}>
        <ProFormSelect
         allowClear={false}
         showSearch
          width="lg"
          options={dataD?.data}
          label={labelD}
          required={requiredD}
          name={nameD}
          disabled={disabledD}
          fieldProps={{
            loading: isLoadingD || isFetchingD,
            fieldNames: { label: option_labelD, value: option_valueD },
            maxTagCount: "responsive",
          }}
          placeholder={placeholderD}
        />
      </Col>
    </>
  );
};

export default FormRelatedSelectInput;
