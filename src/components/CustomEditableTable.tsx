import { EditableProTable } from "@ant-design/pro-components";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { Space } from "antd";
import { TableRowSelection } from "antd/es/table/interface";
import { AxiosResponse } from "axios";
import React from "react";

type CustomTableProps = {
  getColumns: any;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<AxiosResponse<any, any> | undefined, Error>>;
  data: AxiosResponse<any, any> | undefined;
  setSearch: (value: React.SetStateAction<string>) => void;
  getPageSize: () => number;
  setPageSize: (pageSize: number) => void;
  setPage: (value: React.SetStateAction<number>) => void;
  isLoading: boolean;
  headerTitle?: string | React.ReactNode;
  rowSelectionFunction?: false | (TableRowSelection<Record<string, any>> & { alwaysShowAlert?: boolean | undefined; }) | undefined;
  RowSelectionRnder?:React.ReactNode,
  scrollX?:number
  scrollY?:number
};

const CustomEditableTable: React.FC<CustomTableProps> = ({
  getColumns,
  refetch,
  data,
  setSearch,
  getPageSize,
  setPageSize,
  setPage,
  isLoading,
  headerTitle,
  rowSelectionFunction,
  RowSelectionRnder,
  scrollX=1200
}) => {
  const tableOptions = {
    reload: refetch,
    setting: {
      listsHeight: 400,
    },
    search: {
      onSearch(keyword: any) {
        setSearch(keyword);
      },
      allowClear: true,
    },
    fullScreen: true,
  };

  const paginationConfig = {
    pageSize: getPageSize(),
    total: data?.data?.count,
    pageSizeOptions: [10, 20, 30, 100],
    showSizeChanger: true,
    onChange: (page: number, pageSize: number) => {
      setPageSize(pageSize);
      setPage(page);
      refetch();
    },
  };

  return (
    <EditableProTable
      columns={getColumns}
      cardBordered
      onReset={refetch}
      dataSource={data?.data?.results}
      columnsState={{
        persistenceKey: "pro-table-singe-demos",
        persistenceType: "localStorage",
        defaultValue: {
          option: { fixed: "left" },
        },
      }}
      rowKey={(item) => item?.id}
      search={false}
      // @ts-ignore
      options={tableOptions}
      scroll={{ x: scrollX }}
      loading={isLoading}
      pagination={paginationConfig}
      revalidateOnFocus={true}
      dateFormatter="string"
      headerTitle={headerTitle}
      size="small"
      rowSelection={rowSelectionFunction}
      tableAlertOptionRender={() => {
        return (
          <Space size={16}>
           {RowSelectionRnder}
          </Space>
        );
      }}
    />
  );
};

export default CustomEditableTable;
