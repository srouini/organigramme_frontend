import { ProTable } from "@ant-design/pro-components";
import { Button, Space } from 'antd';
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { TableRowSelection } from "antd/es/table/interface";
import { AxiosResponse } from "axios";
import React, { useEffect, useMemo, useState } from "react";
import "@/index.css"
type CustomTableProps = {
  getColumns: any;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<AxiosResponse<any, any> | undefined, Error>>;
  data: AxiosResponse<any, any> | undefined;
  setSearch: ((value: React.SetStateAction<string>) => void) | null;
  getPageSize?: () => number;
  setPageSize?: (pageSize: number) => void;
  setPage?: (value: React.SetStateAction<number>) => void;
  isLoading: boolean;
  headerTitle?: string | React.ReactNode;
  rowSelectionFunction?:
    | false
    | (TableRowSelection<Record<string, any>> & { alwaysShowAlert?: boolean });
  RowSelectionRnder?: React.ReactNode;
  scrollX?: number;
  scrollY?: number;
  toolBar?:any,
  toolbar?:any,
  isFetching?:boolean,
  cardBordered?:boolean
  hasoptions?:boolean,
  expandable?:boolean
};

const CustomTable: React.FC<CustomTableProps> = ({
  getColumns,
  refetch,
  data,
  setSearch,
  getPageSize = () => 10,
  setPageSize,
  setPage,
  isLoading,
  headerTitle,
  rowSelectionFunction,
  RowSelectionRnder,
  scrollY,
  toolBar,
  toolbar,
  isFetching,
  cardBordered=true,
  hasoptions=true,
}) => {
  const [tableData, setTableData] = useState(data);

  useEffect(() => {
    if (!isFetching) {
      setTableData(data);
    }
  }, [data, isFetching]);
  // Memoize table options to avoid unnecessary recalculations
  const tableOptions: any = useMemo(
    () => ({
      reload: refetch,
      setting: {
        listsHeight: 400,
      },
      search: setSearch !== null ? {
        onSearch(keyword: any) {
          setSearch(keyword);
        },
        allowClear: true,
      } : null,
      fullScreen: true,
    }),
    [refetch, setSearch]
  );

  const mintableOptions: any = useMemo(
    () => ({
      reload: refetch,
      setting: false,
      density: false,
      search: setSearch !== null ? {
        onSearch(keyword: any) {
          setSearch(keyword);
        },
        allowClear: false,
      } : null,
    }),
    [refetch, setSearch]
  );

  return (
    <ProTable
      columns={getColumns}
      cardBordered={cardBordered}
      onReset={refetch}
      toolBarRender={toolBar}
      dataSource={tableData?.data?.results}
      columnsState={{
        persistenceKey: "pro-table-singe-demos",
        persistenceType: "localStorage",
        defaultValue: {
          option: { fixed: "left" },
        },
      }}
      rowKey={(item) => item?.id}
      search={false}
      options={hasoptions && tableOptions || mintableOptions}
      scroll={{ x: 'max-content', y: scrollY }}
      loading={isLoading}
      pagination={{
        pageSize: getPageSize(),
        total: tableData?.data?.count,
        pageSizeOptions: [10, 20, 30, 100],
        showSizeChanger: true,
        onChange: (page: number, pageSize: number) => {
          // @ts-ignore
          setPageSize(pageSize);
          // @ts-ignore
          setPage(page);
          refetch();
        },
      }}
      revalidateOnFocus={true}
      dateFormatter="string"
      headerTitle={headerTitle}
      size="small"
      rowSelection={rowSelectionFunction}
      tableAlertOptionRender={({ onCleanSelected }) => {
        const alertBarElements = [];

        // If RowSelectionRnder prop is provided, add its content first
        if (RowSelectionRnder) {
          alertBarElements.push(<React.Fragment key="custom-row-selection-content">{RowSelectionRnder}</React.Fragment>);
        }

        // Add the "Clear selection" button if row selection is configured and items are selected.
        if (rowSelectionFunction && onCleanSelected) { // onCleanSelected is passed when items are selected
          alertBarElements.push(
            <Button onClick={onCleanSelected} type="link" key="clear-selection-button">
              Clear
            </Button>
          );
        }
        
        if (alertBarElements.length === 0) {
          return null;
        }
        return (
          <div style={{ overflowX: 'auto', whiteSpace: 'nowrap', maxWidth: '100%' }}>
            <Space size={16}>{alertBarElements}</Space>
          </div>
        );
      }}
      toolbar={toolbar}
    />
  );
};

export default CustomTable;
