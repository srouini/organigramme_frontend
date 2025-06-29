import { ListToolBarProps, ProTable } from "@ant-design/pro-components";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { TableRowSelection } from "antd/es/table/interface";
import { AxiosResponse } from "axios";
import React, { useMemo } from "react";

type CustomTableAllProps = {
  getColumns: any;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<AxiosResponse<any, any> | undefined, Error>>;
  options?:boolean,
  data: any;
  isLoading: boolean;
  headerTitle?: string | React.ReactNode;
  rowSelectionFunction?:
    | false
    | (TableRowSelection<Record<string, any>> & { alwaysShowAlert?: boolean });
  RowSelectionRnder?: React.ReactNode;
  scrollX?: number;
  scrollY?: number;
  toolbar?: ListToolBarProps
};

const CustomTableData: React.FC<CustomTableAllProps> = ({
  getColumns,
  refetch,
  data,
  isLoading,
  headerTitle,
  rowSelectionFunction,
  scrollX = 1200,
  scrollY,
  options=true,
  toolbar
}) => {
  // Memoize table options to avoid unnecessary recalculations
  const tableOptions: any = useMemo(
    () => ({
      reload: refetch,
      setting: {
        listsHeight: 400,
      },
     
      fullScreen: true,

    }),
    [refetch]
  );

  return (
    <ProTable
      columns={getColumns}
      cardBordered
      onReset={refetch}
      dataSource={data}
      pagination={false}
      rowKey={(item) => item?.id}
      search={false}
      options={options ? tableOptions : false}
      scroll={{ x: scrollX, y: scrollY }}
      loading={isLoading}
      revalidateOnFocus={true}
      dateFormatter="string"
      headerTitle={headerTitle}
      size="small"
      rowSelection={rowSelectionFunction}
      toolbar={toolbar}
    />
  );
};

export default CustomTableData;
