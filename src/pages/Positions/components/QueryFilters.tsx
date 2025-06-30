import {
  ProFormDatePicker,
  ProFormDateRangePicker,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  QueryFilter,
} from "@ant-design/pro-components";
import { useEffect } from "react";

import { transformRangeDateFilter, transformSelectFilter } from "@/utils/functions";
import { selectConfig } from "@/utils/config";
import { useReferenceContext } from "@/context/ReferenceContext";
import { YES_NO_CHOICES } from "@/utils/constants";
import { Card } from "antd";
import FormSelectInput from "@/components/form/FormSelectInput";

type QueryFiltersProps = {
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setFilters: React.Dispatch<React.SetStateAction<number>>;
  resetFilters: () => void;
  collapsed?: boolean
};

const QueryFilters: React.FC<QueryFiltersProps> = ({
  setFilters,
  resetFilters,
  setPage,
  collapsed = true
}) => {
  const handleSubmission = (values: any) => {
    setPage(1);
    setFilters(values);

  };


  const { grades,organigrams } = useReferenceContext();

  useEffect(() => {
    grades.fetch();
    organigrams.fetch();
  }, []);

  return (
    <Card style={{ marginBottom: "20px" }}>
      <QueryFilter
        split
        onFinish={handleSubmission}
        onReset={resetFilters}
        style={{ padding: "0px" }}
        defaultCollapsed={collapsed}
      >
        <ProFormText name="title__icontains" label="Titre" />


        <ProFormSelect
          {...selectConfig}
          options={grades?.results}
          label="Grade"
          name="grade__in"
          fieldProps={{
            fieldNames: { label: "name", value: "id" },
            maxTagCount: 'responsive',
          }}
          mode="multiple"
          transform={(value) =>
            transformSelectFilter("multiple", "grade", value)
          }
        />
        <ProFormSelect
          {...selectConfig}
          options={organigrams?.results}
          label="Organigramme"
          labelCol={{ span: 6 }}
          name="organigram__in"
          fieldProps={{
            fieldNames: { label: "name", value: "id" },
            maxTagCount: 'responsive',
          }}
          mode="multiple"
          transform={(value) =>
            transformSelectFilter("multiple", "organigram", value)
          }
        />




      </QueryFilter>
    </Card>
  );
};

export default QueryFilters;
