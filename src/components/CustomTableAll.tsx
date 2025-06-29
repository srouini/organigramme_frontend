import { ProTable } from "@ant-design/pro-components";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { Space } from "antd";
import { TableRowSelection } from "antd/es/table/interface";
import { AxiosResponse } from "axios";
import React, { useMemo } from "react";

type CustomTableAllProps = {
  getColumns: any;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<AxiosResponse<any, any> | undefined, Error>>;
  options?:boolean,
  data: AxiosResponse<any, any> | undefined;
  isLoading: boolean;
  headerTitle?: string | React.ReactNode;
  rowSelectionFunction?:
    | false
    | (TableRowSelection<Record<string, any>> & { alwaysShowAlert?: boolean });
  RowSelectionRnder?: React.ReactNode;
  scrollX?: number;
  scrollY?: number;
};

const CustomTable: React.FC<CustomTableAllProps> = ({
  getColumns,
  refetch,
  data,
  isLoading,
  headerTitle,
  rowSelectionFunction,
  RowSelectionRnder,
  scrollX = 1200,
  scrollY,
  options=true
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
      dataSource={data?.data}
      columnsState={{
        persistenceKey: "pro-table-singe-demos",
        persistenceType: "localStorage",
        defaultValue: {
          option: { fixed: "left" },
        },
      }}
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
      tableAlertOptionRender={() =>
        RowSelectionRnder && <Space size={16}>{RowSelectionRnder}</Space>
      }
    />
  );
};

export default CustomTable;
