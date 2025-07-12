import {
  ProFormDatePicker,
  ProFormDateRangePicker,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  QueryFilter,
} from "@ant-design/pro-components";
import { useEffect } from "react";

import {
  transformRangeDateFilter,
  transformSelectFilter,
} from "@/utils/functions";
import { selectConfig } from "@/utils/config";
import { useReferenceContext } from "@/context/ReferenceContext";
import { STRUCTURE_STATES, YES_NO_CHOICES } from "@/utils/constants";
import { Card } from "antd";

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

  return (
    <Card style={{ marginBottom: "20px" }}>
      <QueryFilter
        split
        onFinish={handleSubmission}
        onReset={resetFilters}
        style={{ padding: "0px" }}
        defaultCollapsed={collapsed}
      >
        <ProFormText name="name__icontains" label="Nom" />

        <ProFormSelect
          {...selectConfig}
          // @ts-ignore
          options={STRUCTURE_STATES}
          label="Etat"
          name="state__icontains"
          mode="single"
        />
        
        <ProFormDatePicker name="created_at__date" label="Date" />




        <ProFormDateRangePicker
          name="dcreated_at__date__range"
          label="Date"
          transform={(value) =>
            transformRangeDateFilter("date_reception__date", value)
          }
        />


      </QueryFilter>
    </Card>
  );
};

export default QueryFilters;
