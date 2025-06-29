import { ReloadOutlined } from '@ant-design/icons'
import { Button } from 'antd'


interface Props{
refetch: any; 
isLoading: any;
}

const Refetch = ({refetch, isLoading}:Props) => {
  return (
    <Button type="dashed" icon={<ReloadOutlined />} onClick={() => refetch()} loading={isLoading}  />
  )
}

export default Refetch