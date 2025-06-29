import { useEffect, useState } from "react";
import { Button, Divider, Drawer, message, Select } from "antd";
import { Container } from "@/types/data";
import { ProDescriptions } from "@ant-design/pro-components";
import CustomTable from "@/components/CustomTable";
import useData from "@/hooks/useData";
import { API_SOUSARTICLES_ENDPOINT } from "@/api/api";
import usePage from "@/hooks/usePage";
import { getColumns } from "./data";
import useLoading from "@/hooks/useLoading";
import AUForm from "./components/AUForm";
import usePost from "@/hooks/usePost";
import { TableSelectionType } from "@/types/antdeing";
import { useReferenceContext } from "@/context/ReferenceContext";
import Export from "./components/Export";
import { selectConfig } from "@/utils/config";

interface SubArticlePageProps {
  container: Container;
  columns: any;
}

export default ({ container, columns }: SubArticlePageProps) => {
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
    endpoint: API_SOUSARTICLES_ENDPOINT,
    name: `GET_SOUS_ARTICLES_${container?.id}`,
    params: {
      search: search,
      page: page,
      page_size: getPageSize(),
      expand: "client,transitaire,box",
      tc__id: container?.id,
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
    endpoint: API_SOUSARTICLES_ENDPOINT + "bulk_update_box/",
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
      <Button onClick={showDrawer}>{container?.matricule}</Button>

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
          {container?.matricule}
        </p>
        <ProDescriptions
          dataSource={container}
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
