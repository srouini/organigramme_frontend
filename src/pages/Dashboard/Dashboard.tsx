import { PageContainer } from "@ant-design/pro-components";
import { Button, Typography, Grid } from 'antd';
import { useAuth } from "@/context/AuthContext";
import dayjs from "dayjs";
import { useNavigate } from "react-router";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

export default () => {
  const { user, hasPagePermission } = useAuth();
  const today = dayjs();
  const formattedDate = today.format('MMMM D, YYYY');
  const navigate = useNavigate()
  const screens = useBreakpoint();
  const isMobile = !screens.sm;

  return (
    <PageContainer
      contentWidth="Fluid"
      title={false}
      style={{
        minHeight: "calc(100vh - 64px)", // Adjust if PageContainer has a header
        display: "flex",
        justifyContent: "center", // Vertical centering
        alignItems: "center",     // Horizontal centering
      }}
    >
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center", // Center children horizontally
        textAlign: "center",  // Center text inside children
        padding: "20px",
        gap: "15px"
      }}>
        <div>
          <Text>{formattedDate}</Text>
        </div>
        <div>
          <Title style={{ marginTop: "10px", marginBottom: "0px" }} level={1}>
            Hello, {user?.first_name}
          </Title>
        </div>
        <div style={{ marginBottom: "25px" }}>
          <Text type="secondary" style={{ marginBottom: "30px", fontSize: "20px" }}>
          Bienvenue dans votre espace de gestion organisationnelle

          </Text>
        </div>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center", // Centers wrapped lines
          gap: "8px",
          width: `${isMobile ? "100%" : "50%"}`,
          padding: "8px",
        }}>
          {hasPagePermission("/structures") && <Button onClick={() => navigate("/structures")} block={isMobile}>Structures</Button>}
          {hasPagePermission("/grades") && <Button onClick={() => navigate("/grades")} block={isMobile}>Grades</Button>}
          {hasPagePermission("/positions") && <Button onClick={() => navigate("/positions")} block={isMobile}>Positions</Button>}

        </div>
      </div>
    </PageContainer>
  );
};
