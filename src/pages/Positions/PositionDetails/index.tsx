import { useEffect, useState } from "react";
import { Button, Divider, Drawer, message, Select } from "antd";
import { Container } from "@/types/data";
import { ProDescriptions } from "@ant-design/pro-components";
import CustomTable from "@/components/CustomTable";
import useData from "@/hooks/useData";
import { API_TASKS_ENDPOINT } from "@/api/api";
import usePage from "@/hooks/usePage";
import { getColumns } from "./data";
import useLoading from "@/hooks/useLoading";
import AUForm from "./components/AUForm";
import usePost from "@/hooks/usePost";
import { TableSelectionType } from "@/types/antdeing";
import { useReferenceContext } from "@/context/ReferenceContext";
import Export from "./components/Export";
import { selectConfig } from "@/utils/config";
import { Position } from "@/types/data";

interface PageProps {
  position: Position;
}

export default ({ position }: PageProps) => {
  const [open, setOpen] = useState(false);

  const { box } = useReferenceContext();
  useEffect(() => {
    box?.fetch();
  }, []);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const [search, setSearch] = useState("");
  const { page, getPageSize, setPageSize, setPage } = usePage();

  const {
    data,
    isLoading: isLoadingData,
    isRefetching,
    isFetching,
    refetch,
  } = useData({
    endpoint: API_TASKS_ENDPOINT,
    name: `GET_TASKS_${position?.id}`,
    params: {
      search: search,
      page: page,
      page_size: getPageSize(),
      expand: "client,transitaire,box",
      position__id: position?.id,
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
    endpoint: API_TASKS_ENDPOINT + "bulk_update_position/",
  });

  const handleContainerType = (values: any) => {
    mutate({
      ids: selectedRows,
      box_id: values,
    });
  };

  const RowSelectionRnder = (
    <>
      Type:
      <Select
      style={{ width: "300px", marginBottom: "0px", paddingBottom: "0px" }}
      
      {...selectConfig}

      onChange={handleContainerType}
      options={box?.results}

      fieldNames={{
        label: "designation",
        value: "id",
      }}


    />
    </>
  );

  return (
    <>
      <Button onClick={showDrawer}>{position?.}</Button>

      <Drawer
        width={1000}
        placement="right"
        closable={false}
        onClose={onClose}
        open={open}
      >
        <p
          className="site-description-item-profile-p"
          style={{ marginBottom: 24, fontWeight: "bold" }}
        >
          {position?.title}
        </p>
        <ProDescriptions
          dataSource={position}
          columns={columns}
          style={{ marginBottom: "10px", maxHeight: "50" }}
        ></ProDescriptions>

        <Divider />

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
          key="SUB_ARTICLES_TABLE"
          rowSelectionFunction={rowSelectionFunction}
          RowSelectionRnder={RowSelectionRnder}
          headerTitle={
          [  <AUForm refetch={refetch} tc={container?.id} initialvalues={null} />,
            <div style={{marginRight:"10px"}}></div>,
            <Export query_params={{tc__id: container?.id}} endpoint={API_SOUSARTICLES_ENDPOINT} expand="client,transitaire,box" key="SOUSARTICLESEXPORT" />,]

          }
        />
      </Drawer>
    </>
  );
};
