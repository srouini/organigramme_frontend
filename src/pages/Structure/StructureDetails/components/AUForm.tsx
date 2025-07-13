import { useEffect, useState } from "react";
import DraggableModel from "../../../../components/DraggableModel";
import FormObject from "../../../../components/Form";
import { Divider, Form, message, Row, Select, Button } from "antd";
import usePost from "../../../../hooks/usePost";
import { mapInitialValues } from "../../../../utils/functions";
import { useReferenceContext } from "../../../../context/ReferenceContext";
import { API_STRUCTURES_ENDPOINT, API_POSITIONS_ENDPOINT } from "@/api/api";
import FormField from "@/components/form/FormField";
import { EditOutlined, PlusOutlined, UserAddOutlined } from "@ant-design/icons";

interface Position {
  id: string | number;
  title: string;
  [key: string]: any;
}

interface StructureFormData {
  id?: string | number;
  name: string;
  parent?: string | number | null;
  manager?: string | number | null;
  manager_details?: {
    title: string;
    grade?: string | number;
  };
  dangereux?: string | number | null;
  client?: string | number | null;
  volume?: number;
  tc: string | number;
  [key: string]: any;
}

interface AUFormProps {
  refetch: () => void;
  initialvalues: any;
  tc: any;
  editText?: string;
  addText?: string;
  hasIcon?: boolean;
}

const AUForm: React.FC<AUFormProps> = ({
  refetch,
  initialvalues,
  tc,
  editText = "MODIFIER",
  addText = "Sous Article",
  hasIcon = false,
}) => {
  const [form] = Form.useForm<StructureFormData>();
  const [open, setOpen] = useState(false);
  const [showManagerForm, setShowManagerForm] = useState(false);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(false);

  const { structures, client } = useReferenceContext() || {};
  
  // Fetch positions for the current structure
  const fetchPositions = async () => {
    if (!initialvalues?.id) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_POSITIONS_ENDPOINT}?structure=${initialvalues.id}`);
      const data = await response.json();
      setPositions(data.results || []);
    } catch (error) {
      console.error('Error fetching positions:', error);
      message.error('Failed to load positions');
    } finally {
      setLoading(false);
    }
  };

  // When the form opens, fetch positions for the current structure
  useEffect(() => {
    if (open && initialvalues?.id) {
      fetchPositions();
    }
  }, [open, initialvalues?.id]);

  const handleFormSubmission = async () => {
    try {
      const values = await form.validateFields();
      const formData: StructureFormData = { ...values };
      
      if (initialvalues?.id) {
        formData.id = initialvalues.id;
      }
      
      // If we have manager details, create the position first
      if (showManagerForm && values.manager_details?.title) {
        try {
          // In a real implementation, you would create the position here
          // const newPosition = await createPosition({
          //   title: values.manager_details.title,
          //   structure: initialvalues?.id,
          //   is_manager: true,
          //   // Add other required fields
          // });
          // formData.manager = newPosition.id;
          message.info('Manager position creation would happen here in a real implementation');
        } catch (error) {
          console.error('Error creating manager position:', error);
          message.error('Failed to create manager position');
          return;
        }
      }
      
      // Remove manager_details from the final submission
      if (formData.manager_details) {
        delete formData.manager_details;
      }
      
      // Add any additional fields needed for submission
      formData.tc = parseInt(tc);
      
      // Submit the form
      mutate(formData);
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };
  
  const handleManagerSelect = (value: string) => {
    // If the user selects "Add new manager", show the form
    if (value === 'add_new') {
      setShowManagerForm(true);
      form.setFieldsValue({ manager: undefined });
    } else {
      setShowManagerForm(false);
    }
  };

  const onSuccess = () => {
    message.success("Submission successful");
    setOpen(false);
    refetch();
    structures?.refetch();
  };

  const { mutate, isLoading } = usePost({
    onSuccess: onSuccess,
    endpoint: API_STRUCTURES_ENDPOINT,
  });

  return (
    <DraggableModel
      OkButtontext="Submit"
      modalOpenButtonText={initialvalues ? editText : addText} 
      modalTitle="Sous Article"
      addButtonType="dashed"
      addButtonIcon={
        hasIcon && initialvalues ? <EditOutlined /> : <PlusOutlined />
      }
      onSubmit={handleFormSubmission}
      setOpen={setOpen}
      open={open}
      width={600}
      isLoading={isLoading}
      initialvalues={initialvalues}
    >
      <FormObject form={form} initialvalues={mapInitialValues(initialvalues)}>
        <Row gutter={24}>
          <Row gutter={24}>
            <FormField
              name="name"
              label="Structure Name"
              type="text"
              required
              span_md={24}
              rules={[{ required: true, message: 'Please enter a structure name' }]}
            />
            
            {/* Manager Selection */}
            <Form.Item
              name="manager"
              label="Manager"
              style={{ width: '100%', padding: '0 12px' }}
              rules={[{ required: false }]}
            >
              <Select
                placeholder="Select a manager or add a new one"
                onChange={handleManagerSelect}
                loading={loading}
                allowClear
              >
                {Array.isArray(positions) && positions.map((position) => (
                  <Select.Option key={position.id} value={String(position.id)}>
                    {position.title}
                  </Select.Option>
                ))}
                <Select.Option value="add_new">
                  <Button type="link" icon={<UserAddOutlined />}>
                    Add New Manager
                  </Button>
                </Select.Option>
              </Select>
            </Form.Item>
            
            {showManagerForm && (
              <div style={{ width: '100%', padding: '0 12px', marginBottom: 16 }}>
                <h4>New Manager Details</h4>
                <FormField
                  name="manager_details.title"
                  label="Manager Title"
                  type="text"
                  required
                  span_md={12}
                  rules={[{ required: true, message: 'Please enter a title for the manager' }]}
                />
                <FormField
                  name="manager_details.grade"
                  label="Grade"
                  type="select"
                  options={client?.data || []}
                  option_label="name"
                  option_value="id"
                  span_md={12}
                />
              </div>
            )}
            
            <FormField
              name="parent"
              label="Parent Structure"
              type="select"
              options={structures?.data?.filter((s: any) => s.id !== initialvalues?.id)}
              option_label="name"
              option_value="id"
              span_md={24}
              allowClear
            />
          </Row>
          <FormField
            name="dangereux"
            label="Dangereux"
            type="select"
            options={[]}
            option_label="name"
            option_value="id"
            span_md={12}
          />
          <FormField
            name="client"
            label="Client"
            type="select"
            options={client?.data || []}
            option_label="name"
            option_value="id"
            span_md={12}
          />
          <Divider style={{ marginTop: "0px" }} />
          <FormField name="volume" label="Volume" type="number" step={0.01} />
          <FormField name="poids" label="Poids" type="number" step={0.01} />
          <FormField
            name="nombre_colis"
            label="Nombre de colis"
            type="number"
          />
          <FormField name="surface" label="Surface" type="number" step={0.01} />
          <FormField name="quantite" label="Quantité" type="number" />

          <Divider />

          {/* Box field removed as it's not needed for structure form */}
        </Row>
      </FormObject>
    </DraggableModel>
  );
};

export default AUForm;
