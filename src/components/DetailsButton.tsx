import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';


interface DetailsButtonProps {
    text:string,
    navigate_to: string,
    disabled?:boolean
}

const DetailsButton = ({text,navigate_to,disabled}:DetailsButtonProps) => {
    const navigate = useNavigate();
  return (
    <Button onClick={() =>  navigate(navigate_to)} disabled={disabled} >{text}</Button>   )
}

export default DetailsButton