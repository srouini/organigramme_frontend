import type { ProColumns } from "@ant-design/pro-components";
import { TableDropdown } from "@ant-design/pro-components";
import { Col, Row, Tag } from "antd";
import { renderText } from "@/utils/functions";
import Delete from "@/components/Delete";
import AUForm from "./components/AUForm";
import { API_TASKS_ENDPOINT  } from "@/api/api";

export const getColumns = (refetch: () => void): ProColumns<any>[] => [
  {
    title: "description",
    dataIndex: "description",
    key: "1",
  },
  {
    title: "Actions",
    valueType: "option",
    key: "Actions",
    fixed:"right",
    width: 100,
    render: (_, record: any) => [
      <TableDropdown
        key="actionGroup"
      
        children={
          [
            <Row gutter={8}>
              <Col>
                <Delete
                  url={API_TASKS_ENDPOINT}
                  id={record?.id}
                  refetch={refetch}
                  class_name="Sous Article"
                  type="dashed"
                  link={false}
                  text=""
                  has_icon
                />
              </Col>
              <Col>
                <AUForm
                  initialvalues={record}
                  refetch={refetch}
                  tc={record?.tc}
                  editText=""
                  hasIcon
                />
              </Col>
            </Row>,
          ]
        }
      />,
    ],
  },
];




export const columns = [
  {
    title: "Numéro",
    dataIndex: "numero",
    key: "1",
    selected:true
  },
  {
    title: "Position",
    key: "1.5",
    dataIndex: "box",
    selected:true,
    schema:["box","designation"]
  },
  {
    title: "BL",
    key: "2",
    dataIndex: "bl",
    selected:false
  },
  {
    title: "Client",
    key: "3",
    dataIndex: "client",
    selected:true,
    schema:["client","raison_sociale"]
  },
  {
    title: "Volume",
    key: "4",
    dataIndex: "volume",
    selected:true
  },
  {
    title: "Poids",
    key: "5",
    dataIndex: "poids",
    selected:true
  },
  {
    title: "Dangereux",
    key: "6",
    dataIndex: "dangereux",
    selected:false
  },
  {
    title: "NBR colis",
    key: "7",
    dataIndex: "ponombre_colisids",
    selected:false
  },
  {
    title: "Surface",
    key: "8",
    dataIndex: "surface",
    selected:false
  },
  {
    title: "Quantité",
    key: "9",
    dataIndex: "quantite",
    selected:false
  },

   {
    title: "Marchandise",
    key: "10",
    dataIndex: "designation",
    selected:true
  },
  {
    title: "Transitaire",
    key: "11",
    dataIndex: "transitaire",
    selected:false,
    schema:["transitaire","raison_sociale"]
  }]