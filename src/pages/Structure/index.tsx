import { PageContainer } from "@ant-design/pro-components";
import { useState } from "react";
import useLoading from "@/hooks/useLoading";
import usePage from "@/hooks/usePage";
import useFilters from "@/hooks/useFilters";
import useData from "@/hooks/useData";
import { API_STRUCTURES_ENDPOINT } from "@/api/api";
import QueryFilters from "./components/QueryFilters";
import CustomTable from "@/components/CustomTable";
import { getColumns } from "./data";

import AUForm from "./components/AUForm";

export default () => {
  const [search, setSearch] = useState("");
  const { page, getPageSize, setPageSize, setPage } = usePage();
  const { filters, resetFilters, setFilters } = useFilters();



  const {
    data,
    isLoading: isLoadingData,
    isRefetching,
    isFetching,
    refetch,
  } = useData({
    endpoint: API_STRUCTURES_ENDPOINT,
    name: `GET_ALL_STRUCTURES`,
    params: {
      search: search,
      page: page,
      page_size: getPageSize(),
      ...filters,
      ordering: "-id",
      expand: "type,manager.grade"
    },
  });

  const { isLoading } = useLoading({
    loadingStates: [isLoadingData, isRefetching, isFetching],
  });

  return (
    <PageContainer
      contentWidth="Fluid"
      header={{
        title: "Structures",
        extra: [
          <AUForm refetch={refetch} addText="Structure" hasIcon />,
        ],
      }}
    >
      <QueryFilters
        setFilters={setFilters}
        resetFilters={resetFilters}
        setPage={setPage}
      />




      <CustomTable
        getColumns={getColumns(refetch)}
        data={data}
        isFetching={isFetching}
        getPageSize={getPageSize}
        isLoading={isLoading}
        refetch={refetch}
        setPage={setPage}
        setPageSize={setPageSize}
        setSearch={setSearch}
        key="ALL_STRUCTURES_TABLE"
      />


    </PageContainer>
  );
};
