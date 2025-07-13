import { PageContainer } from "@ant-design/pro-components";
import { useEffect, useState } from "react";
import useLoading from "@/hooks/useLoading";
import usePage from "@/hooks/usePage";
import useFilters from "@/hooks/useFilters";
import useData from "@/hooks/useData";
import { API_STRUCTURES_ENDPOINT } from "@/api/api";
import QueryFilters from "./components/QueryFilters";
import CustomTable from "@/components/CustomTable";
import { getMetas } from "./data";
import { TableSelectionType } from "@/types/antdeing";
import { useReferenceContext } from "@/context/ReferenceContext";
import { message, Segmented } from "antd";
import usePost from "@/hooks/usePost";
import Export from "./components/Export";
import CustomProList from "@/components/CustomProList";
import AUForm from "./components/AUForm";
import { useNavigate } from "react-router-dom";

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
      is_main: true,
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

  // const { mutate } = usePost({
  //   onSuccess: onSuccess,
  //   endpoint: API_STRUCTURES_ENDPOINT + "bulk_update_type_tc/",
  // });

  // const handleContainerType = (values: any) => {
  //   mutate({
  //     ids: selectedRows,
  //     type_tc_id: values,
  //   });
  // };

  const RowSelectionRnder = <></>;

  const navigate = useNavigate();

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

      <CustomProList
        metas={getMetas(refetch)}
        data={data}
        onItem={(record) => ({
          onClick: () => navigate(`/structures/${record.id}`),
          style: { cursor: 'pointer' },
        })}
        isFetching={isFetching}
        itemLayout="horizontal"
        getPageSize={getPageSize}
        showActions="always"
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
