import type { ProColumns, ProListProps } from "@ant-design/pro-components";
import { TableDropdown } from "@ant-design/pro-components";
import { Col, Popover, Row, Space, Tag, Tooltip } from "antd";
import { getStatusColor, renderDate, renderDateTime, renderText } from "@/utils/functions";
import { API_STRUCTURES_ENDPOINT } from "@/api/api";
import SubArticlePage from "./StructureDetails";
import Delete from "@/components/Delete";
import AUForm from "./components/AUForm";
import Print from "@/components/Print";
import { SafetyCertificateOutlined } from "@ant-design/icons";

export const getMetas = (
  refetch: () => void,
): ProListProps<any, any>['metas'] =>  ({
  /** ---------- Main title (“Nom”) ---------- */
  title: {
    dataIndex: 'name',
    title: 'Nom',
  },

  /** ---------- Status tag (“Etat”) ---------- */
  subTitle: {
    title: 'État',
    render: (_, row) => (
      <Tag color={getStatusColor(row.state)}>{row.state}</Tag>
    ),
  },

  /** ---------- Date (“Créé le”) ---------- */
  content: {
    title: 'Créé le',
    render: (_, row) =><><span>Créé le</span> <span style={{marginLeft:"5px",color:"#6c757d",fontWeight:"bold"}}> {renderDate(row.created_at)}</span></> ,
  },

  /** ---------- Per‑card actions ---------- */
  actions: {
    // place them in the card’s top‑right corner (instead of bottom)
    cardActionProps: 'extra',
    render: (_, record) => (
      <TableDropdown
        key="actionGroup"
        // children must be a single ReactNode; wrap items in <> if needed
      >
        <Row gutter={8}>
          <Col>
            <Delete
              url={API_STRUCTURES_ENDPOINT}
              id={record.id}
              refetch={refetch}
              class_name="Structure"
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
              editText=""
              hasIcon
            />
          </Col>
        </Row>
      </TableDropdown>
    ),
  },
});

export const getColumns = (
  refetch: () => void,
): ProColumns<any>[] => [
    {
      title: "Nom",
      dataIndex: "name",
      key: "1",
      width: 100,
    },
    {
      title: "Structure Parente",
      dataIndex: ["parent", "name"],
      key: "parent",
      width: 100,
    },
    {
      title: "Etat",
      key: "2",
      dataIndex: "state",
      width: 150,
      render: (row:any) => (
        <Space>
          <Tag color={getStatusColor(row.status)}>{row.status}</Tag>
          {/* Other content */}
        </Space>
      )
    },
    {
      title: "Cree le",
      key: "3",
      dataIndex: "created_at",
      width: 150,
      render: (record: any) => renderDate(record),
    },

    {
      title: "Actions",
      valueType: "option",
      key: "Actions",
      fixed: "right",
      width: 220,
      render: (_, record: any) => [
        <TableDropdown
          key="actionGroup"
          children={[
            <Row gutter={8}>

              <Col>
                <Delete
                  url={API_STRUCTURES_ENDPOINT}
                  id={record?.id}
                  refetch={refetch}
                  class_name="Structure"
                  type="dashed"
                  link={false}
                  text=""
                  has_icon
                  permission="app.delete_tc"
                />
              </Col>
              <Col>
                <AUForm
                  initialvalues={record}
                  refetch={refetch}
                  editText=""
                  hasIcon
                />
              </Col>
           
            </Row>,
          ]}
        />,
      ],
    },
  ];

export const columns = [
  {
    title: "Matricule",
    dataIndex: "tc",
    key: "tc",
    width: 100,
  },
  {
    title: "Type",
    key: "type_tc",
    dataIndex: "type_tc",
    width: 150,
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
    render: (record: any) => record + " kg",
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

export const exportColumns = [
  {
    title: "Matricule",
    dataIndex: "tc",
    key: "tc",
    selected: true
  },

  {
    title: "Type",
    key: "type_tc",
    dataIndex: "type_tc",
    schema: ["type_tc", "designation"],
    selected: true
  },
  {
    title: "Mrn",
    key: "mrn",
    dataIndex: "article",
    schema: ["article", "gros", "gros"],
    selected: true
  },
  {
    title: "Accostage",
    key: "mrn",
    dataIndex: "article",
    schema: ["article", "gros", "accostage"],
    selected: true
  },
  {
    title: "Article",
    key: "article",
    dataIndex: "article",
    schema: ["article", "numero"],
    selected: true
  },
  {
    title: "Groupage",
    key: "groupage",
    dataIndex: "article",
    schema: ["article", "groupage"],
    selected: true
  },
  {
    title: "Tar",
    key: "tar",
    dataIndex: "tar",
    selected: true

  },
  {
    title: "Poids",
    key: "poids",
    dataIndex: "poids",
    selected: true

  },
  {
    title: "Dangereux",
    key: "dangereux",
    dataIndex: "dangereux",
    selected: true

  },
  {
    title: "Frigo",
    key: "frigo",
    dataIndex: "frigo",
    selected: true

  },
  {
    title: "Facturé",
    key: "billed",
    dataIndex: "billed",
    selected: true
  },
];

export const DetailsColumns = [
  {
    title: "Mrn",
    dataIndex: "gros",
    key: "gros",
    width: 100,
    render: (record: any) => renderText(record?.gros),
  },
  {
    title: "BL",
    key: "bl",
    dataIndex: "bl",
    width: 150,
    render: (record: any) => renderText(record),
  },
  {
    title: "Client",
    key: "client",
    dataIndex: "client",
    width: 300,
    render: (record: any) => renderText(record?.raison_sociale),
  },
  {
    title: "Groupage",
    key: "groupage",
    dataIndex: "groupage",
    width: 120,
    render: (record: any) =>
      record ? <Tag color="blue"> Groupage </Tag> : <Tag> Ordinaire </Tag>,
  },

  {
    title: "Depoté",
    key: "depote",
    width: 100,
    dataIndex: "depote",
    // @ts-ignore
    render: (_, record: any) =>
      record.depote && record.groupage ? (
        <Tag color="green"> Depté </Tag>
      ) : record.groupage ? (
        <Tag color="red"> Non depoté </Tag>
      ) : (
        "-"
      ),
  },
  {
    title: "Date dépotage",
    dataIndex: "date_depotage",
    key: "date_depotage",
    width: 150,
    render: (record: any) => renderDateTime(record),
  },

  {
    title: "Transitaire",
    key: "transitaire",
    width: 300,
    dataIndex: "transitaire",
    render: (record: any) => renderText(record?.raison_sociale),
  },
  {
    title: "Designation",
    key: "designation",
    dataIndex: "designation",
    ellipsis: true,
    width: 350,
    render: (record: any) => renderText(record),
  },
];

export const breadcrumb: any = {
  items: [
    {
      title: "Conteneurs",
    },
  ],
};
