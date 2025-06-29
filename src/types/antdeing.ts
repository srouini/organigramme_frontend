import { TableRowSelection } from "antd/es/table/interface";

export type  SelectModeType = "multiple" | "tags" | "single" | undefined;

export type TableSelectionType = false | (TableRowSelection<Record<string, any>> & { alwaysShowAlert?: boolean | undefined; }) | undefined 