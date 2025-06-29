import { ProList, ProListProps } from '@ant-design/pro-components';
import { Button, Space } from 'antd';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import React, { useEffect, useMemo, useState } from 'react';

/**
 * CustomProList v0.4 – streamlined
 * --------------------------------
 * • **No more automatic column‑array conversion.**
 *   Pass a proper `metas` object (or a callback returning one) just like the
 *   native `<ProList>` expects. This keeps the wrapper light and removes any
 *   guesswork.
 * • Still mirrors the API surface of `CustomTable` (search, pagination,
 *   row‑selection, toolbars, React‑Query `refetch`, etc.).
 * • Forwards *all* unknown props directly to the underlying `<ProList>` so you
 *   keep full control (ghost, grid, itemCardProps …).
 */
export type CustomProListProps<
  T extends Record<string, any>,
  Extra = {},
> = {
  /**
   * **Required**: a valid `ProList` `metas` object – or a lazy factory that
   * returns one. Example:
   *
   * ```tsx
   * const metas = {
   *   title: { dataIndex: 'name' },
   *   description: { dataIndex: 'description' },
   *   subTitle: {
   *     render: (_, row) => <Tag>{row.state}</Tag>
   *   },
   * };
   * ```
   */
  metas: ProListProps<T, any>['metas'] | (() => ProListProps<T, any>['metas']);

  /* React‑Query helpers */
  refetch: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<AxiosResponse<any, any> | undefined, Error>>;
  data: AxiosResponse<any, any> | undefined;

  /* Search + pagination helpers */
  setSearch: ((value: React.SetStateAction<string>) => void) | null;
  getPageSize?: () => number;
  setPageSize?: (pageSize: number) => void;
  setPage?: (value: React.SetStateAction<number>) => void;

  /* UI / state flags */
  isLoading: boolean;
  isFetching?: boolean;
  headerTitle?: string | React.ReactNode;
  cardBordered?: boolean;
  hasOptions?: boolean;

  /* Row‑selection support */
  rowSelectionFunction?:
    | false
    | (NonNullable<ProListProps<T, any>['rowSelection']> & {
        alwaysShowAlert?: boolean;
      });
  RowSelectionRender?: React.ReactNode;

  /* Toolbars */
  toolBar?: ProListProps<T, any>['toolBarRender'];
  toolbar?: React.ReactNode;

  /* Visual props (same names as ProList) */
  ghost?: boolean;
  grid?: ProListProps<T, any>['grid'];
  itemCardProps?: ProListProps<T, any>['itemCardProps'];
  showActions?: ProListProps<T, any>['showActions'];
} & Extra & Omit<ProListProps<T, any>, 'rowSelection' | 'metas' | 'dataSource' | 'loading'>;
// ^ forward any additional ProList props while avoiding collisions with our own

const CustomProList = <T extends Record<string, any>>({
  /* required props */
  metas,
  refetch,
  data,
  setSearch,
  getPageSize = () => 10,
  setPageSize,
  setPage,
  isLoading,

  /* optional UI props */
  headerTitle,
  rowSelectionFunction,
  RowSelectionRender,
  toolBar,
  toolbar,
  isFetching,
  cardBordered = true,
  hasOptions = true,
  ghost,
  grid,
  itemCardProps,
  showActions,

  /* everything else goes straight through */
  ...rest
}: CustomProListProps<T>) => {
  /** Keep a local copy so we can optimistically avoid flickers during re‑fetch */
  const [listData, setListData] = useState(data);

  useEffect(() => {
    if (!isFetching) {
      setListData(data);
    }
  }, [data, isFetching]);

  // Lazily resolve metas if a factory function was provided
  const resolvedMetas = useMemo(
    () => (typeof metas === 'function' ? metas() : metas),
    [metas],
  );

  /* --- ProList options mirroring CustomTable behaviour ------------------- */
  const listOptions = useMemo(
    () => ({
      reload: refetch,
      fullScreen: true,
      search:
        setSearch !== null
          ? {
              onSearch(keyword: any) {
                setSearch(keyword);
              },
              allowClear: true,
            }
          : null,
    }),
    [refetch, setSearch],
  );

  const minListOptions = useMemo(
    () => ({
      reload: refetch,
      search:
        setSearch !== null
          ? {
              onSearch(keyword: any) {
                setSearch(keyword);
              },
              allowClear: false,
            }
          : null,
    }),
    [refetch, setSearch],
  );

  /* ------------------------------ render ------------------------------ */
  return (
    <ProList<T>
      {...rest}
      cardBordered={cardBordered}
      ghost={ghost}
      grid={grid}
      itemCardProps={itemCardProps as any}
      showActions={showActions}
      headerTitle={headerTitle}
      metas={resolvedMetas as any}
      rowKey={(item) => (item as any)?.id ?? (item as any)?.key}
      dataSource={(listData as any)?.data?.results ?? []}
      loading={isLoading}
      /**
       * `ProList` shares the same pagination API as `ProTable` so we keep the UX
       * consistent with `CustomTable`.
       */
      pagination={{
        pageSize: getPageSize(),
        total: (listData as any)?.data?.count,
        pageSizeOptions: [10, 20, 30, 100],
        showSizeChanger: true,
        onChange: (page: number, pageSize: number) => {
          setPageSize?.(pageSize);
          setPage?.(page);
          refetch();
        },
      }}
      /** Search disabled because we render our own search via `options` */
      search={false}
      options={hasOptions ? listOptions : minListOptions}
      rowSelection={rowSelectionFunction as any}
      toolBarRender={toolBar}
      toolbar={toolbar}
      /**
       * Custom alert bar replicates the behaviour from `CustomTable`.
       */
      tableAlertOptionRender={({ onCleanSelected }) => {
        const alertBarElements: React.ReactNode[] = [];

        if (RowSelectionRender) {
          alertBarElements.push(
            <React.Fragment key="custom-row-selection-content">
              {RowSelectionRender}
            </React.Fragment>,
          );
        }

        if (rowSelectionFunction && onCleanSelected) {
          alertBarElements.push(
            <Button onClick={onCleanSelected} type="link" key="clear-selection-button">
              Clear
            </Button>,
          );
        }

        if (alertBarElements.length === 0) return null;

        return (
          <div style={{ overflowX: 'auto', whiteSpace: 'nowrap', maxWidth: '100%' }}>
            <Space size={16}>{alertBarElements}</Space>
          </div>
        );
      }}
    />
  );
};

export default CustomProList;
