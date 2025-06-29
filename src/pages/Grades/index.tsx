import { PageContainer } from "@ant-design/pro-components";
import { useEffect, useState } from "react";
import useLoading from "@/hooks/useLoading";
import usePage from "@/hooks/usePage";
import useFilters from "@/hooks/useFilters";
import useData from "@/hooks/useData";
import { API_GRADES_ENDPOINT } from "@/api/api";
import QueryFilters from "./components/QueryFilters";
import CustomTable from "@/components/CustomTable";
import { getColumns } from "./data";
import { TableSelectionType } from "@/types/antdeing";
import { useReferenceContext } from "@/context/ReferenceContext";
import { message, Segmented } from "antd";
import usePost from "@/hooks/usePost";
import Export from "./components/Export";

export default () => {
  const { containerType } = useReferenceContext();

  useEffect(() => {
    containerType?.fetch();
  }, []);

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
    endpoint: API_GRADES_ENDPOINT,
    name: `GET_ALL_CONTAINERS`,
    params: {
      search: search,
      page: page,
      page_size: getPageSize(),
      ...filters,
      expand: "type_conteneur,nature_conteneur,scelles,article,article.mrn,depotage",
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
    endpoint: API_GRADES_ENDPOINT + "bulk_update_type_tc/",
  });

  const handleContainerType = (values: any) => {
    mutate({
      ids: selectedRows,
      type_tc_id: values,
    });
  };

  const RowSelectionRnder = (
    <>
      Type:
      <Segmented
        options={containerType?.results}
        onChange={handleContainerType}
        allowFullScreen
        defaultValue={false}
      />
    </>
  );

  return (
    <PageContainer
      contentWidth="Fluid"
      header={{
        title: "Grades",
        extra: [
          <Export endpoint={API_GRADES_ENDPOINT} expand="type_tc,current_scelle,article.gros,charge_chargement" key="ALLCONTAINERS" />,
        ]
         
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
        key="ALL_CONTAINERS_TABLE"
      />
    </PageContainer>
  );
};
