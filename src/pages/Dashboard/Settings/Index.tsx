import { PageContainer } from "@ant-design/pro-components";
import Account from "./components/Account";
import Profile from "./components/Profile";

export default () => {

  

  const breadcrumb = {
    items: [
      {
        path: "",
        title: "Dashboard",
      },
      {
        path: "",
        title: "Settings",
      },
    ],
  };


  return (
    <PageContainer
      contentWidth="Fluid"
      header={{
        breadcrumb: breadcrumb,
      }}
    
      tabList={[
        {
          tab: "Préférences",
          key: "1",
          children: <Profile /> ,
        },
        {
          tab: "Compte",
          key: "2",
          disabled:true,
          children: <Account />,
        },
      ]}
    ></PageContainer>
  );
};
