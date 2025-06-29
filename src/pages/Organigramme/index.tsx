import { PageContainer } from "@ant-design/pro-components";
import { useEffect, useState } from "react";
import useLoading from "@/hooks/useLoading";
import usePage from "@/hooks/usePage";
import useFilters from "@/hooks/useFilters";
import useData from "@/hooks/useData";
import {  API_ORGANIGRAMMES_ENDPOINT } from "@/api/api";
import QueryFilters from "./components/QueryFilters";
import CustomTable from "@/components/CustomTable";
import { getMetas } from "./data";
import { TableSelectionType } from "@/types/antdeing";
import { useReferenceContext } from "@/context/ReferenceContext";
import { message, Segmented } from "antd";
import usePost from "@/hooks/usePost";
import Export from "./components/Export";
import CustomProList from "@/components/CustomProList";

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
    endpoint: API_ORGANIGRAMMES_ENDPOINT,
    name: `GET_ALL_ORGANIGRAMMES`,
    params: {
      search: search,
      page: page,
      page_size: getPageSize(),
      ...filters,
      ordering: "-id",
    },
  });
  
  const { isLoading } = useLoading({
    loadingStates: [isLoadingData, isRefetching, isFetching],
  });

  const [selectedRows, setSelectedRows] = useState<React.Key[]>([]);
  const rowSelectionFunction: TableSelectionType = {
    // @ts-ignore
    onChange(selectedRowKeys, selectedRows, info) {
      setSelectedRows(selectedRowKeys);
    },
  };

  const onSuccess = () => {
    message.success("Submission successful");
    refetch();
  };

  const { mutate } = usePost({
    onSuccess: onSuccess,
    endpoint: API_ORGANIGRAMMES_ENDPOINT + "bulk_update_type_tc/",
  });

  const handleContainerType = (values: any) => {
    mutate({
      ids: selectedRows,
      type_tc_id: values,
    });
  };

  const RowSelectionRnder = (
    <>
     
    </>
  );

  return (
    <PageContainer
      contentWidth="Fluid"
      header={{
        title: "Organigrammes",
        extra: [
          <Export endpoint={API_ORGANIGRAMMES_ENDPOINT} expand="type_tc,current_scelle,article.gros,charge_chargement" key="ALLCONTAINERS" />,
        ]
         
      }}
    >

      <QueryFilters
        setFilters={setFilters}
        resetFilters={resetFilters}
        setPage={setPage}
      />

      <CustomProList
        metas={getMetas(refetch)}
        grid={{ gutter: 16, column: 4 }}
        data={data}
        isFetching={isFetching}

         itemLayout="vertical"
        getPageSize={getPageSize}
        showActions="always"
        isLoading={isLoading}
        refetch={refetch}
        setPage={setPage}
        setPageSize={setPageSize}
        setSearch={setSearch}
        key="ALL_ORGANIGRAMMES_TABLE"
      />
    </PageContainer>
  );
};
