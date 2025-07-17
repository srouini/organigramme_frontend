import { useEffect, useState } from "react";
import { Card, Col, Flex, Form, Row, Modal, Button, message, Popconfirm } from "antd";
import usePost from "@/hooks/usePost";
import { useReferenceContext } from "@/context/ReferenceContext";
import { API_EDGES_ENDPOINT, API_POSITIONS_ENDPOINT, API_STRUCTURES_ENDPOINT } from "@/api/api";
import FormField from "@/components/form/FormField";
import { ApiOutlined, ForkOutlined, PlusOutlined } from "@ant-design/icons";
import { Position, Structure } from "@/types/reference";
import AddStructure from "../references/AddStructure";
import { Unlink } from "lucide-react";

interface RemovePositionEdgeProps {
    position: Position;
}



const RemovePositionEdge: React.FC<RemovePositionEdgeProps> = ({ position }) => {

    const { positions } = useReferenceContext();


    // Fetch structures when the component mounts
    useEffect(() => {
        positions?.fetch();
    }, []);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();




    const handleFormSubmission = async () => {
        try {

            await mutate({
                id: position.id,
                structure: null,
            })
        } catch (error) {
            message.error('Failed to remove connection. Please try again.');
        }
    }

    const handleSuccess = () => {
        message.success('Connection removed successfully');
        setIsModalOpen(false);
        form.resetFields();
        positions?.refetch();
        window.location.reload();
    };

    const { mutate, isLoading } = usePost({
        onSuccess: handleSuccess,
        endpoint: API_POSITIONS_ENDPOINT,
    });

    // Create a separate mutation for updating structure parent


    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Popconfirm
                title="Supprimer la connexion"
                description="Voulez-vous vraiment supprimer la connexion ?"
                onConfirm={handleFormSubmission}
                onCancel={handleCancel}
                okText="Oui"
                cancelText="Non"
            >
                <Button danger icon={<ApiOutlined />} type="default"></Button>
            </Popconfirm>
        </>
    );
};

export default RemovePositionEdge;
