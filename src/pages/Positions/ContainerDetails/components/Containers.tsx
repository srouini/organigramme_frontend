import { API_POSITIONS_ENDPOINT } from "@/api/api";
import CustomTable from "@/components/CustomTable";
import useData from "@/hooks/useData";
import useLoading from "@/hooks/useLoading";
import usePage from "@/hooks/usePage";
import usePost from "@/hooks/usePost";
import { TableSelectionType } from "@/types/antdeing";
import { renderText } from "@/utils/functions";
import { AppstoreAddOutlined } from "@ant-design/icons";
import { Button, DatePicker, Drawer, message, Tag } from "antd";
import { useEffect, useState } from "react";
import moment from "moment";
import dayjs from "dayjs";

interface props {
  mrn: string | undefined;
  bulletin: string | undefined;
  refetchLoadedContainers: () => void;
  disabled?: boolean;
}
export default ({
  mrn,
  bulletin,
  refetchLoadedContainers,
  disabled,
}: props) => {
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (open) {
      refetch();
    }
  }, [open]);

  const [search, setSearch] = useState("");
  const { page, getPageSize, setPageSize, setPage } = usePage();

  const {
    data,
    isLoading: isLoadingData,
    isRefetching,
    isFetching,
    refetch,
  } = useData({
    endpoint: API_POSITIONS_ENDPOINT,
    name: "GET_CONTAINERS",
    params: {
      search: search,
      page: page,
      page_size: getPageSize(),
      expand: "article,type_tc",
      article__gros__in: mrn,
      bulletins__id__isnull: true,
    },
  });

  const { isLoading } = useLoading({loadingStates: [ isLoadingData, isRefetching, isFetching] });

  const columns = () => [
    {
      title: "Matricule",
      dataIndex: "tc",
      key: "tc",
      width: 150,
    },
    {
      title: "Article",
      key: "article",
      dataIndex: "article",
      width: 150,
      render: (record: any) => renderText(record?.numero),
    },
    {
      title: "Type",
      key: "type_tc",
      dataIndex: "type_tc",
      width: 100,
      render: (record: any) => <Tag color="blue"> {record?.designation} </Tag>,
    },
    {
      title: "Tar",
      key: "tar",
      dataIndex: "tar",
      width: 150,
    },
    {
      title: "Poids",
      key: "poids",
      dataIndex: "poids",
      width: 120,
    },
    {
      title: "Nature",
      key: "dangereux",
      dataIndex: "dangereux",
      width: 150,
      // @ts-ignore
      render: (_, record: any) => (
        <>
          {" "}
          {record.dangereux ? <Tag color="red"> DGX </Tag> : ""}{" "}
          {record.frigo ? <Tag color="blue"> FRIGO </Tag> : ""}
        </>
      ),
    },
  ];

  // handle type container

  const [selectedRows, setSelectedRows] = useState<React.Key[]>([]);
  const rowSelectionFunction: TableSelectionType = {
    onChange(selectedRowKeys) {
      setSelectedRows(selectedRowKeys);
    },
  };

  const onSuccess = () => {
    message.success("Submission successful");
    refetch();
    refetchLoadedContainers();
  };

  const { mutate, isLoading: isPosting } = usePost({
    onSuccess: onSuccess,
    endpoint: API_POSITIONS_ENDPOINT,
  });

  const handleLoadingContainers = () => {
    let formatted_selectedDate = selectedDate.format("YYYY-MM-DD");
    mutate({
      ids: selectedRows,
      bulletin: bulletin,
      date: formatted_selectedDate,
    });
  };

  const [selectedDate, setSelectedDate] = useState(moment());

  const onChange = (date: any) => {
    setSelectedDate(date);
  };

  const RowSelectionRnder = (
    <>
      <DatePicker onChange={onChange} size="middle" defaultValue={dayjs()} />
      <Button
        type="primary"
        size="middle"
        onClick={handleLoadingContainers}
        loading={isPosting}
        disabled={data?.data?.count == 0}
      >
        Chargez
      </Button>
    </>
  );

  return (
    <>
      <Button
        onClick={showDrawer}
        type="primary"
        icon={<AppstoreAddOutlined />}
        disabled={disabled}
      >
        Conteneurs
      </Button>

      <Drawer
        width={900}
        placement="right"
        closable={false}
        onClose={onClose}
        open={open}
      >
        <CustomTable
          getColumns={columns()}
          data={data}
          isFetching={isFetching}
          scrollX={800}
          getPageSize={getPageSize}
          isLoading={isLoading}
          refetch={refetch}
          setPage={setPage}
          setPageSize={setPageSize}
          setSearch={setSearch}
          key="CONTENEUR_AFFECTATION_TYPE"
          rowSelectionFunction={rowSelectionFunction}
          RowSelectionRnder={RowSelectionRnder}
        />
      </Drawer>
    </>
  );
};
