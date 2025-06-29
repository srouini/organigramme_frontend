import { ArrowRightOutlined } from "@ant-design/icons";
import { Modal, Select, Button, Space, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState, useRef } from "react";
import { useReferenceContext } from "@/context/ReferenceContext";
import useData from "@/hooks/useData";

interface QuickNavModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QuickNavModal = ({ isOpen, onClose }: QuickNavModalProps) => {
  const navigate = useNavigate();
  const [selectedMrn, setSelectedMrn] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const [mrnOptions, setMrnOptions] = useState<{value: string, label: string}[]>([]);
  const [articleOptions, setArticleOptions] = useState<{value: string, label: string}[]>([]);
  const { mrn } = useReferenceContext();
  const mrnSelectRef = useRef<any>(null); // Ref for the MRN Select component

  // Reset selections when modal opens/closes and handle focus
  useEffect(() => {
    if (isOpen) {
      // Focus the MRN select input when the modal opens
      if (mrnSelectRef.current) {
        // Delay focus slightly to ensure the modal is fully rendered and interactive
        setTimeout(() => {
          mrnSelectRef.current.focus();
        }, 150); // Adjust delay if needed, 150ms is usually safe
      }
    } else {
      setSelectedMrn(null);
      setSelectedArticle(null);
    }
  }, [isOpen]);

  // Fetch article data when MRN changes
  useEffect(() => {
    if (selectedMrn) {
      fetchArticleData(selectedMrn);
    } else {
      setArticleOptions([]);
      setSelectedArticle(null);
    }
  }, [selectedMrn]);

  // Mock function to fetch article data - replace with actual API call
  const fetchArticleData = useCallback(async (mrnId: string) => {
    try {
      // This should be replaced with an actual API call
      const mockData = [
        { value: '101', label: 'Article A' },
        { value: '102', label: 'Article B' },
        { value: '103', label: 'Article C' },
      ];
      setArticleOptions(mockData);
    } catch (error) {
      console.error(`Failed to fetch articles for MRN ${mrnId}:`, error);
      message.error('Failed to load article data');
    }
  }, []);

  const {
    data,
    isLoading: isLoadingData,
    isRefetching,
    isFetching,
    refetch,
  } = useData({
    endpoint: "",
    name: "GET_ARTICLES_BY_SELECTED_MRN",
    params: {
      mrn__id: selectedMrn,
      fields:"id,numero"
    },
  });

  useEffect(() => {
    mrn.fetch();
  }, []);

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
      title="Quick Navigation"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={500}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Select MRN</label>
          <Select
            ref={mrnSelectRef} // Assign the ref here
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
              filterOption={(input, option) =>
                (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
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
          >
            Navigate
          </Button>
        )}
      </Space>
    </Modal>
  );
};

export default QuickNavModal;
