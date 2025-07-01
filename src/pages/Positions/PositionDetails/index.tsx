import { useState } from "react";
import { Button, Divider, Drawer, Flex, List, Row, Skeleton, Tag, Typography } from "antd";
import CustomTable from "@/components/CustomTable";
import useData from "@/hooks/useData";
import { API_TASKS_ENDPOINT, API_COMPETENCES_ENDPOINT, API_MISSIONS_ENDPOINT, API_POSITIONS_ENDPOINT } from "@/api/api";
import usePage from "@/hooks/usePage";
import useLoading from "@/hooks/useLoading";
import { TableSelectionType } from "@/types/antdeing";
import { Competence, Mission, Position, Task } from "@/types/reference";
import Delete from "@/components/Delete";
import AddCompetenceForm from "./components/AddCompetenceForm";
import AddMissionForm from "./components/AddMissionForm";
import UpdateMissionForm from "./components/UpdateMissionForm";
import UpdateCompetenceForm from "./components/UpdateCompetenceForm";
import DownloadMissionTemplate from "./components/DownloadMissionTemplate";
import UploadMissions from "./components/UploadMissions";
import DownloadCompetenceTemplate from "./components/DownloadCompetenceTemplate";
import UploadCompetences from "./components/UploadCompetences";
import Print from "@/components/Print";

const { Title } = Typography;

interface PageProps {
  position: Position;
}

export default ({ position }: PageProps) => {
  const [open, setOpen] = useState(false);


  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const {
    data: missions,
    isLoading: isLoadingMissions,
    isRefetching: isRefetchingMissions,
    isFetching: isFetchingMissions,
    refetch: refetchMissions,
  } = useData({
    endpoint: API_MISSIONS_ENDPOINT,
    name: `GET_MISSIONS_${position?.id}`,
    params: {
      all: true,
      position__id: position?.id,
    },
  });

  console.log(missions)
  const {
    data: competences,
    isLoading: isLoadingCompetences,
    isRefetching: isRefetchingCompetences,
    isFetching: isFetchingCompetences,
    refetch: refetchCompetences,
  } = useData({
    endpoint: API_COMPETENCES_ENDPOINT,
    name: `GET_COMPETENCES_${position?.id}`,
    params: {
      all: true,
      position__id: position?.id,
    },
  });
  const { isLoading } = useLoading({
    loadingStates: [isLoadingMissions, isRefetchingMissions, isFetchingMissions],
  });

  return (
    <>
      <Button onClick={showDrawer} type="link">{position?.title}</Button>

      <Drawer
        width={1000}
        placement="right"
        closable={false}
        onClose={onClose}
        open={open}
      >
        <Flex justify="space-between" >
          <Title level={5}>Fiche de poste</Title>

          <Print endpoint={API_POSITIONS_ENDPOINT} id={position?.id} type="View" button_text="" endpoint_suffex="generate_pdf" permission="" />

        </Flex>

        <Divider style={{ marginTop: "10px" }} />

        <Flex justify="space-between">

          <div className="mb-2"><span><b>Intulité de poste:</b> {position?.title}</span></div>

          <div>
            <Tag color={position?.grade?.color ? position?.grade?.color : "blue"}>{position?.grade?.name}</Tag>
          </div>
        </Flex>

        <div className="mb-2"><span><b>Categorie:</b> <Tag>{position?.grade?.category}</Tag></span></div>
        <div className="mb-2"><span><b>Formation:</b> {position?.formation}</span></div>
        <div className="mb-2"><span><b>Expérience:</b> {position?.experience}</span></div>
        <div className="mb-2"><span><b>Sous l’autorité de:</b> {position?.parent?.title}</span></div>

        <Divider />

        <Title level={5}>Missions principales</Title>
        <Row style={{ gap: '8px' }}>
          {position?.mission_principal}
        </Row>



        <Divider />
        <Flex justify="space-between">
          <Title level={5}>Responsabilités et Tâches: </Title>
          <Row style={{ gap: '8px' }}>
            <DownloadMissionTemplate positionTitle={position?.title} />
            <UploadMissions
              positionId={position?.id}
              onSuccess={refetchMissions}
            />
          </Row>
        </Flex>
        <Row style={{ width: '100%', marginBottom: 16, gap: '8px' }}>
          <AddMissionForm
            refetch={refetchMissions}
            position={position}
          />
        </Row>

        <List
          className="demo-loadmore-list"
          loading={isLoadingMissions}
          itemLayout="horizontal"
          dataSource={missions?.data}
          renderItem={(item: Mission) => (
            <List.Item
              actions={[<UpdateMissionForm key="list-loadmore-edit" refetch={refetchMissions} position={position} initialvalues={item} />, <Delete url={API_MISSIONS_ENDPOINT} refetch={refetchMissions} id={item?.id} class_name="Mission" type="link" text="" has_icon link={false} />]}
            >
              <Skeleton avatar title={false} loading={isLoadingMissions} active>

                <Typography.Text>{item?.description}</Typography.Text>

              </Skeleton>
            </List.Item>
          )}
        />

        <Divider />

        <Flex justify="space-between">
          <Title level={5}>Compétences requises</Title>
          <Row style={{ gap: '8px' }}>
            <DownloadCompetenceTemplate positionTitle={position?.title} />
            <UploadCompetences
              positionId={position?.id}
              onSuccess={refetchCompetences}
            />
          </Row>
        </Flex>
        <Row style={{ width: '100%', marginBottom: 16, gap: '8px' }}>
          <AddCompetenceForm
            refetch={refetchCompetences}
            position={position}
          />
        </Row>


        <List
          style={{ marginBottom: "16px" }}
          className="demo-loadmore-list"
          loading={isLoadingCompetences}
          itemLayout="horizontal"
          dataSource={competences?.data}
          renderItem={(item: Competence) => (
            <List.Item
              actions={[<UpdateCompetenceForm key="list-loadmore-edit" refetch={refetchCompetences} position={position} initialvalues={item} />, <Delete url={API_COMPETENCES_ENDPOINT} refetch={refetchCompetences} id={item?.id} class_name="Competence" type="link" text="" has_icon link={false} />]}
            >
              <Skeleton avatar title={false} loading={isLoadingCompetences} active>

                <Typography.Text>{item?.description}</Typography.Text>

              </Skeleton>
            </List.Item>
          )}
        />

      </Drawer>
    </>
  );
};
