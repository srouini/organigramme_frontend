import {
  ProFormDigit,
  ProFormText,
  QueryFilter,
} from "@ant-design/pro-components";
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
        <ProFormText name="name__icontains" label="Grade" />
        <ProFormText name="category__icontains" label="Categorie" />

        






      </QueryFilter>
    </Card>
  );
};

export default QueryFilters;
