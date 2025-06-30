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


  return (
    <Card style={{ marginBottom: "20px" }}>
      <QueryFilter
        split
        onFinish={handleSubmission}
        onReset={resetFilters}
        style={{ padding: "0px" }}
        defaultCollapsed={collapsed}
      >
        <ProFormText name="matricule__icontains" label="Numéro" />



        <ProFormDigit name="article__numero" label="Article" />






        <ProFormDatePicker name="article__mrn__date_accostage" label="Accostage" />
        <ProFormDateRangePicker
          name="article__mrn__date_accostage__range"
          label="Accostage"
          transform={(value) => transformRangeDateFilter("article__mrn__date_accostage", value)}
        />

        <ProFormDatePicker name="date_laivrison__date" label="Date livraison" />
        <ProFormDateRangePicker
          name="date_laivrison__date__range"
          label="Date livraison"
          transform={(value) => transformRangeDateFilter("date_laivrison__date", value)}
        />

        <ProFormDatePicker name="date_reception__date" label="Date réception" />
        <ProFormDateRangePicker
          name="date_reception__date__range"
          label="Date réception"
          transform={(value) => transformRangeDateFilter("date_reception__date", value)}
        />



        <ProFormSelect
          {...selectConfig}
          // @ts-ignore
          options={YES_NO_CHOICES}
          label="Facturé"
          name="billed"
          mode="single"
        />

        <ProFormSelect
          {...selectConfig}
          // @ts-ignore
          options={YES_NO_CHOICES}
          label="Groupage"
          name="groupage"
          mode="single"
        />



      </QueryFilter>
    </Card>
  );
};

export default QueryFilters;
