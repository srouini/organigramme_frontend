import { useEffect, useState } from "react";
import { Card, Col, Flex, Form, Row, Modal, Button, message, Select } from "antd";
import usePost from "@/hooks/usePost";
import { useReferenceContext } from "@/context/ReferenceContext";
import { API_EDGES_ENDPOINT, API_STRUCTURES_ENDPOINT } from "@/api/api";
import FormField from "@/components/form/FormField";
import { ApiOutlined, PlusOutlined } from "@ant-design/icons";
import { Structure } from "@/types/reference";
import AddStructure from "../references/AddStructure";

interface AddConnexionProps {
  source: Structure;
  onSuccess?: () => void;
}



const AddConnexion: React.FC<AddConnexionProps> = ({ source, onSuccess: onSuccessProp }) => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewStructureModalOpen, setIsNewStructureModalOpen] = useState(false);
  const { structuresUnonnected } = useReferenceContext();
  const [newStructureForm] = Form.useForm();
  const { success, error } = message.useMessage();

  // Fetch structures when the component mounts
  useEffect(() => {
    structuresUnonnected?.fetch();
  }, [structuresUnonnected]);



  const handleFormSubmission = async () => {
    try {
      const values = await form.validateFields();
      const { target } = values;
      
      // First create the edge connection
      const connectionData = {
        structure: source.id,
        source: {
          type: 'structure',
          id: source.id
        },
        target: {
          type: 'structure',
          id: target
        },
        title: `Connection from ${source.name} to ${target}`
      };

      // Create the edge connection
      await mutate(connectionData);

      // Now update the target structure's parent
      const updateParentData = {
        parent: source.id
      };
      let _values = {
        id: target,
        ...updateParentData
      };

      // Update the target structure's parent
      await updateStructure({
        ..._values
      });
    } catch (error) {
      console.error('Form validation failed:', error);
      message.error('Failed to create connection. Please try again.');
    }
  };

  const handleSuccess = () => {
    message.success('Connection created successfully');
    setIsModalOpen(false);
    form.resetFields();
    window.location.reload();
  };

  const { mutate, isLoading } = usePost({
    onSuccess: handleSuccess,
    endpoint: API_EDGES_ENDPOINT,
    full_endpoint: true
  });

  // Create a separate mutation for updating structure parent
  const { mutate: updateStructure } = usePost({
    onSuccess: handleSuccess,
    endpoint: API_STRUCTURES_ENDPOINT,
    full_endpoint: false
  });

  // Create a mutation for creating new structures
  const { mutate: createStructure } = usePost({
    endpoint: API_STRUCTURES_ENDPOINT,
    full_endpoint: true,
    onSuccess: (response) => {
      message.success('Structure created successfully');
    }
  });

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <>
      <Button 
        onClick={showModal} 
        style={{ position: 'absolute', top: '5px', right: '5px' }} 
        icon={<ApiOutlined />} 
        title="Add connection"
      />

      <Modal
        title={`Ajouter une connexion à ${source.name}`}
        open={isModalOpen}
        onOk={handleFormSubmission}
        onCancel={handleCancel}
        confirmLoading={isLoading}
        okText="Connect"
        cancelText="Cancel"
        width={600}
      >
        <Form form={form} layout="vertical">
          <Row gutter={24} style={{marginTop: "20px"}}>
      
            <Col span={24}>
              <FormField
                name="target"
                label="Structure"
                type="select"
                options={structuresUnonnected?.results}
                option_label="name"
                option_value="id"
                required
                span={24}
                span_md={24}
                addFormComponent={AddStructure}
                onAddItem={(newRecord:any) => {
                  console.log('Structure added successfully',newRecord.id);
                  form.setFieldValue('target', newRecord.id);
                  structuresUnonnected?.refetch();
                }}

                rules={[{ required: true, message: 'Please select a target structure' }]}
              />
              
            </Col>
          </Row>
        </Form>
      </Modal>

    </>
  );
};

export default AddConnexion;
