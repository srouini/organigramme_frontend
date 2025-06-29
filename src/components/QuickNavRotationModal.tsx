import { ArrowRightOutlined } from "@ant-design/icons";
import { Modal, Select, Button, Space, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useReferenceContext } from "@/context/ReferenceContext";
import useData from "@/hooks/useData";

interface QuickNavRotationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QuickNavRotationModal = ({ isOpen, onClose }: QuickNavRotationModalProps) => {
  const navigate = useNavigate();
  const [selectedMrn, setSelectedMrn] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const { mrn } = useReferenceContext();
  const mrnSelectRef = useRef<any>(null);

  // Reset selections when modal opens/closes and handle focus
  useEffect(() => {
    if (isOpen) {
      // Focus the MRN select input when the modal opens
      if (mrnSelectRef.current) {
        // Delay focus slightly to ensure the modal is fully rendered and interactive
        setTimeout(() => {
          mrnSelectRef.current.focus();
        }, 150);
      }
    } else {
      setSelectedMrn(null);
      setSelectedArticle(null);
    }
  }, [isOpen]);

  // Fetch articles when MRN changes
  const {
    data,
    isLoading: isLoadingArticles
  } = useData({
    endpoint: "API_ARTICLES_ENDPOINT",
    name: "GET_ARTICLES_BY_SELECTED_MRN",
    params: {
      mrn__id: selectedMrn,
      fields: "id,numero"
    },
    enabled: !!selectedMrn,
  });

  // Fetch MRN data
  useEffect(() => {
    if (isOpen) {
      mrn.fetch();
    }
  }, [isOpen, mrn]);

  // Handle MRN selection
  const handleMrnChange = (value: string) => {
    setSelectedMrn(value);
    setSelectedArticle(null);
  };

  // Handle article selection
  const handleArticleChange = (value: string) => {
    setSelectedArticle(value);
  };

  // Navigate to article detail page
  const navigateToArticle = () => {
    if (selectedArticle) {
      navigate(`/rotations/mrns/articles/${selectedArticle}`);
      onClose();
    }
  };

  return (
    <Modal
      title="Quick Rotation Navigation"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={500}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Select MRN</label>
          <Select
            ref={mrnSelectRef}
            placeholder="Select an MRN"
            style={{ width: '100%' }}
            value={selectedMrn}
            onChange={handleMrnChange}
            options={mrn?.results}
            showSearch
            filterOption={(input, option) =>
              (option?.numero_mrn ?? '').toString().toLowerCase().includes(input.toLowerCase())
            }
            fieldNames={{ label: 'numero_mrn', value: 'id' }}
          />
        </div>
        
        {selectedMrn && (
          <div>
            <label style={{ display: 'block', marginBottom: '8px' }}>Select Article</label>
            <Select
              placeholder="Select an article"
              style={{ width: '100%' }}
              value={selectedArticle}
              onChange={handleArticleChange}
              options={data?.data?.results}
              showSearch
              loading={isLoadingArticles}
              filterOption={(input, option) =>
                (option?.numero ?? '').toString().toLowerCase().includes(input.toLowerCase())
              }
              fieldNames={{ label: 'numero', value: 'id' }}
            />
          </div>
        )}
        
        {selectedMrn && selectedArticle && (
          <Button 
            type="primary" 
            icon={<ArrowRightOutlined />}
            onClick={navigateToArticle}
            style={{ marginTop: '16px' }}
            disabled={isLoadingArticles}
          >
            Navigate
          </Button>
        )}
      </Space>
    </Modal>
  );
};

export default QuickNavRotationModal;
