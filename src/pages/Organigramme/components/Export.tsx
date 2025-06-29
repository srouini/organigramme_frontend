import { useState } from "react";
import useLoading from "@/hooks/useLoading";
import usePage from "@/hooks/usePage";
import useFilters from "@/hooks/useFilters";
import useData from "@/hooks/useData";
// import QueryFilters from "./components/QueryFilters";
import CustomTable from "@/components/CustomTable";
import { exportColumns, getColumns } from "../data";
// import AUForm from "./components/AUForm";
import { Button, Drawer } from "antd";
import { CloudDownloadOutlined } from "@ant-design/icons";
import QueryFilters from "./QueryFilters";
import ColumnsSelect from "@/components/ColumnsSelect";
import Export from "@/components/Export";
import { usePermissions } from "@/utils/permissions";

interface Props {
  expand?:string, 
  endpoint:string, 
  query_params?:any, 
  article?:any,
  key?:any
}
//@ts-ignore
export default ({article,key,expand,endpoint,query_params}:Props) => {
  const [search, setSearch] = useState("");
  const { page, getPageSize, setPageSize, setPage } = usePage();
  const { filters, resetFilters, setFilters } = useFilters();

  const {
    data,
    isLoading: isLoadingData,
    isRefetching,
    refetch,
    isFetching,
  } = useData({
    endpoint: endpoint,
    name: `${key}_ENDPOINT`,
    params: {
      search: search,
      page: page,
      page_size: getPageSize(),
      ...filters,
      expand: expand,
      ...query_params
    },
  });

  
  const { isLoading } = useLoading({
    loadingStates: [isLoadingData, isRefetching, isFetching],
  });

  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const [selctedColumns, setSelectedColumns] = useState<any>(exportColumns);

  const countStr = () => {
    let count_str = "";
    if (data?.data?.count > 0) {
      count_str = `( ${data?.data?.count.toString()} )`;
    }

    return count_str;
  };

  const hasPermission = usePermissions();

  return (
    <div>
      <Button icon={<CloudDownloadOutlined />} type="dashed" onClick={showModal} disabled={!hasPermission("app.can_export_tc")}>
        Exporter
      </Button>
      <Drawer
      placement="left"
        title="Exportation de données"
        destroyOnClose
       width={"80%"}
        footer={false}
        open={open}
        closeIcon
        onClose={() => {
          setOpen(false);
        }}
      >
        <QueryFilters
          setFilters={setFilters}
          resetFilters={resetFilters}
          setPage={setPage}
          collapsed={false}
        />

        <ColumnsSelect
          columns={selctedColumns}
          setSelectedColumns={setSelectedColumns}
        />
        <CustomTable
          getColumns={getColumns(refetch).filter((col) => col.key !== "Actions")}
          data={data}
          isFetching={isFetching}
          getPageSize={getPageSize}
          isLoading={isLoading}
          refetch={refetch}
          setPage={setPage}
          setPageSize={setPageSize}
          setSearch={setSearch}
          key={`${key}_TABLE`}
          
          toolbar={{
            actions: [
              <Export
                button_text={`Exportez ${countStr()}`}
                columns={selctedColumns}
                endpoint={endpoint}
                query_params={query_params}
                search={search}
                filters={filters}
                expand={expand}
              />,
            ],
          }}
        />
      </Drawer>
    </div>
  );
};
