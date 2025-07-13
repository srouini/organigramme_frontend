import { useEffect, useState } from "react";
import DraggableModel from "@/components/DraggableModel";
import FormObject from "@/components/Form";
import { Divider, Form, message, Row, Select, Button } from "antd";
import usePost from "@/hooks/usePost";
import { mapInitialValues } from "@/utils/functions";
import { useReferenceContext } from "@/context/ReferenceContext";
import { API_STRUCTURES_ENDPOINT, API_POSITIONS_ENDPOINT } from "@/api/api";
import FormField from "@/components/form/FormField";
import { STRUCTURE_STATES, YES_NO_CHOICES } from "@/utils/constants";
import { EditOutlined, PlusOutlined, UserAddOutlined } from "@ant-design/icons";
import { usePermissions } from "@/utils/permissions";

const formatDate = (field: string, values: any) => {
  if (values[field]) values[field] = values[field].format("YYYY-MM-DD");
  return values;
};

interface Position {
  id: string | number;
  title: string;
  [key: string]: any;
}

interface AUFormProps {
  refetch: () => void;
  initialvalues?: any;
  editText?: string;
  addText?: string;
  hasIcon?: boolean;
  disabled?: boolean;
}

const AUForm: React.FC<AUFormProps> = ({
  refetch,
  initialvalues,
  editText = "MODIFIER",
  addText = "Mrn",
  hasIcon = false,
  disabled=false
}) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loadingPositions, setLoadingPositions] = useState(false);
  const [showManagerForm, setShowManagerForm] = useState(false);

  const { structures } = useReferenceContext();

  // Fetch structures and positions when the form opens
  useEffect(() => {
    if (open) {
      structures?.fetch();
      fetchPositions();
    }
  }, [open]);

  // Fetch positions for the current structure
  const fetchPositions = async () => {
    if (!initialvalues?.id) return;
    
    setLoadingPositions(true);
    try {
      const response = await fetch(`${API_POSITIONS_ENDPOINT}?structure=${initialvalues.id}`);
      const data = await response.json();
      setPositions(data.results || []);
    } catch (error) {
      console.error('Error fetching positions:', error);
      message.error('Failed to load positions');
    } finally {
      setLoadingPositions(false);
    }
  };
  const handleFormSubmission = async () => {
    try {
      const values = await form.validateFields();
      const formData = { ...values };
      
      if (initialvalues) {
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

  const hasPermission = usePermissions();

  console.log(structures?.results)
  return (
    <DraggableModel
      OkButtontext="Sumettre"
      modalOpenButtonText={initialvalues ? editText : addText} 
      modalTitle="Structure"
      addButtonType="dashed"
      addButtonIcon={
        hasIcon && initialvalues ? <EditOutlined /> : <PlusOutlined />
      }
      disabledModalOpenButton={disabled || (!initialvalues && !hasPermission('structure.add_structure')) || (initialvalues && !hasPermission('structure.change_structure'))}
      onSubmit={handleFormSubmission}
      setOpen={setOpen}
      open={open}
      width={600}
      isLoading={isLoading}
      initialvalues={initialvalues}
    >
      <FormObject form={form} >
        <Row gutter={24}>
          <FormField
            name="name"
            label="Nom"
            type="text"
            required
            span_md={24}
          />
          <FormField
            name="parent"
            label="Structure Parente"
            type="select"
            options={structures?.results}
            option_label="name"
            option_value="id"
            span_md={24}
          />
          <Divider style={{ marginTop: "0px" }} />
          
          <FormField
            name="is_main"
            label="Structure Principale"
            type="select"
            options={YES_NO_CHOICES}
            required
            option_value="value"
            span_md={24}
          />
          
          {/* Manager Selection */}
          <Divider style={{ marginTop: "0px" }} />
          <Form.Item
            name="manager"
            label="Manager"
            style={{ width: '100%', padding: '0 12px' }}
          >
            <Select
              placeholder="Select a manager or add a new one"
              onChange={handleManagerSelect}
              loading={loadingPositions}
              allowClear
            >
              {positions.map((position) => (
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
                span_md={24}
                rules={[{ required: true, message: 'Please enter a title for the manager' }]}
              />
            </div>
          )}
        </Row>
      </FormObject>
    </DraggableModel>
  );
};

export default AUForm;
