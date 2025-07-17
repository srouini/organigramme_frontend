import {
  ProFormText,
  QueryFilter,
} from "@ant-design/pro-components";
import { useEffect } from "react";

import { useReferenceContext } from "@/context/ReferenceContext";
import { Card } from "antd";
import FormField from "@/components/form/FormField";

type QueryFiltersProps = {
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setFilters: React.Dispatch<React.SetStateAction<number>>;
  resetFilters: () => void;
  collapsed?: boolean;
};

const QueryFilters: React.FC<QueryFiltersProps> = ({
  setFilters,
  resetFilters,
  setPage,
  collapsed = true,
}) => {
  const handleSubmission = (values: any) => {
    setPage(1);
    setFilters(values);
  };

  const { structureTypes, positions } = useReferenceContext();

  useEffect(() => {
    structureTypes?.fetch();
  }, [])

  return (
    <Card style={{ marginBottom: "20px" }}>
      <QueryFilter
        split
        onFinish={handleSubmission}
        onReset={resetFilters}
        style={{ padding: "0px" }}
        defaultCollapsed={collapsed}
      >
        <ProFormText name="name" label="Nom" />


        <FormField
          type="select"
          name="type"
          label="Type"
          options={structureTypes?.results}
          option_label="name"
          option_value="id"
          span_md={24}
          mode="single"

        />


        <FormField
          type="select"
          name="manager"
          label="Responsable"
          options={positions?.results}
          option_label="title"
          option_value="id"
          span_md={24}
          mode="single"

        />
      </QueryFilter>
    </Card>
  );
};

export default QueryFilters;
