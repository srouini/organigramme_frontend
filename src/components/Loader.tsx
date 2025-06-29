import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

const Loader = () => {
  return (
      <div style={{width:"100dvw",height:"100dvh", display:"flex", justifyContent:"center", alignItems:"center"}} >
        <Spin indicator={<LoadingOutlined style={{ fontSize: 100 }} spin />} />
        
      </div>
  
  );
};

export default Loader;
