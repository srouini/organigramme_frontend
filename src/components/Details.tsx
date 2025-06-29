import { ProDescriptions, ProSkeleton } from "@ant-design/pro-components";

const Details = ({ dataSource, isLoading,DetailsColumns }: any) => {
  return (
    <>
    {isLoading && <div style={{marginBottom:"20px"}}><ProSkeleton type="list" list={false} toolbar={false}  statistic={1}   /></div>}
    {!isLoading &&
    
    <ProDescriptions
      dataSource={dataSource}
      columns={DetailsColumns}
      style={{ marginBottom: "10px", maxHeight:"50" }}
    >
 
    </ProDescriptions>

    }
    
    </>
  );
};

export default Details;
