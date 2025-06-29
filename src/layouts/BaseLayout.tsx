import { LogoutOutlined, MoonOutlined, SettingOutlined, SunOutlined, WindowsOutlined, BranchesOutlined, FileProtectOutlined, FieldTimeOutlined, FileDoneOutlined, CodepenOutlined, SlidersOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { MenuDataItem, ProConfigProvider, ProLayout } from "@ant-design/pro-components";
import { Col, ConfigProvider, Dropdown, message, Modal, Row, theme, Select, Button, Space } from "antd";
import { useEffect, useState, useCallback } from "react";
import { useNavigate, Outlet, useLocation } from "react-router";
import {useAuth} from "@/context/AuthContext";
import useScreenSize from "../hooks/useScreenSize";
import frFR from "antd/lib/locale/fr_FR";
import ReferenceContextProvider from "../context/ReferenceContext";
import { MenuProps } from "antd/lib";
import _defaultProps from "./_defaultProps";
import { Link } from "react-router-dom";
import avatar from "/avatar.png"



export default () => {

  const size = useScreenSize();
  const [isF2ModalVisible, setIsF2ModalVisible] = useState(false);
  const [isRotationModalVisible, setIsRotationModalVisible] = useState(false);
  const [selectedMrn, setSelectedMrn] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const [mrnOptions, setMrnOptions] = useState<{value: string, label: string}[]>([]);
  const [articleOptions, setArticleOptions] = useState<{value: string, label: string}[]>([]);

  const { user, logout, hasPagePermission, updateProfile } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize theme from user profile
  useEffect(() => {
    if (user?.profile?.theme_mode) {
      setIsDarkMode(user.profile.theme_mode === 'dark');
    }
  }, [user?.profile?.theme_mode]);

  // F2 key event listener
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'F2') {
        event.preventDefault();
        openF2Modal();
      }
      // Alt+R shortcut for Quick Rotation Navigation
      if (event.altKey && event.key.toLowerCase() === 'r') {
        event.preventDefault();
        openRotationModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Fetch MRN data when modal opens
  useEffect(() => {
    if (isF2ModalVisible) {
      fetchMrnData();
    }
  }, [isF2ModalVisible]);

  // Fetch article data when MRN changes
  useEffect(() => {
    if (selectedMrn) {
      fetchArticleData(selectedMrn);
    } else {
      setArticleOptions([]);
      setSelectedArticle(null);
    }
  }, [selectedMrn]);

  // Mock function to fetch MRN data - replace with actual API call
  const fetchMrnData = useCallback(async () => {
    try {
      // This should be replaced with an actual API call
      const mockData = [
        { value: '1', label: 'MRN-001' },
        { value: '2', label: 'MRN-002' },
        { value: '3', label: 'MRN-003' },
      ];
      setMrnOptions(mockData);
    } catch (error) {
      console.error('Failed to fetch MRN data:', error);
      message.error('Failed to load MRN data');
    }
  }, []);

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

  // Open F2 modal
  const openF2Modal = () => {
    setIsF2ModalVisible(true);
    setSelectedMrn(null);
    setSelectedArticle(null);
  };

  // Close F2 modal
  const closeF2Modal = () => {
    setIsF2ModalVisible(false);
    setSelectedMrn(null);
    setSelectedArticle(null);
  };

  // Open Rotation modal
  const openRotationModal = () => {
    setIsRotationModalVisible(true);
  };

  // Close Rotation modal
  const closeRotationModal = () => {
    setIsRotationModalVisible(false);
  };

  // Global listener for Escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isF2ModalVisible) {
          closeF2Modal(); // Close the F2 modal if it's open
        }
        if (isRotationModalVisible) {
          closeRotationModal(); // Close the Rotation modal if it's open
        }
        navigate('/'); // Navigate home
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [navigate, isF2ModalVisible, isRotationModalVisible, closeF2Modal, closeRotationModal]); // Dependencies

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
      closeF2Modal();
    }
  };

  const handleThemeChange = async () => {
    try {
      const newThemeMode = !isDarkMode;
      setIsDarkMode(newThemeMode); // Update UI immediately

      await updateProfile({
        theme_mode: newThemeMode ? 'dark' : 'light'
      });

      message.success('Theme updated successfully');
    } catch (error) {
      console.error('Failed to update theme:', error);
      setIsDarkMode(!isDarkMode); // Revert on error
      message.error('Failed to update theme');
    }
  };


  const generateMenuFromRoutes = () => {
    return [
      {
        path: '/',
        name: 'Dashboard',
        icon: <WindowsOutlined />,
      },
      {
        path: '/organigrammes',
        name: 'Organigrammes',
        icon: <CodepenOutlined />,
      },
      ,
      {
        path: '/grades',
        name: 'Grades',
        icon: <CodepenOutlined />,
      },
      ,
      {
        path: '/positions',
        name: 'Positions',
        icon: <CodepenOutlined />,
      },    
    ];
  };

  const filterMenuItems = (items: MenuDataItem[]): MenuDataItem[] => {
    return items
      .map((item) => {
        //@ts-ignore
        const hasPermission = hasPagePermission(item.path);

        // Recursively filter children
        const filteredChildren = item.children ? filterMenuItems(item.children) : undefined;

        // If the item has children, keep it if it has any authorized children
        if (filteredChildren && filteredChildren.length > 0) {
          return { ...item, children: filteredChildren };
        }

        // Keep the item if it has permission and no children
        if (hasPermission) {
          return { ...item, children: undefined }; // Remove children if they're empty
        }

        // Exclude the item otherwise
        return null;
      })
      .filter(Boolean) as MenuDataItem[]; // Remove null entries
  };
  

  const authorizedMenuItems = filterMenuItems(generateMenuFromRoutes());

  const handleLogout = async () => {
    const themeColor = user?.profile?.theme_color || '#968b6a';
    
    Modal.confirm({
      title: (
        <span style={{ color: isDarkMode ? '#ffffff' : '#000000' }}>
          Confirm Logout
        </span>
      ),
      content: (
        <span style={{ color: isDarkMode ? '#ffffff' : '#000000' }}>
          Are you sure you want to logout?
        </span>
      ),
      okText: 'Yes',
      cancelText: 'No',
      className: isDarkMode ? 'ant-modal-dark' : '',
      styles: {
        mask: {
          backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.45)' : 'rgba(0, 0, 0, 0.25)'
        },
        content: {
          backgroundColor: isDarkMode ? '#1f1f1f' : '#ffffff'
        },
        footer: {
          borderTop: isDarkMode ? '1px solid #303030' : '1px solid #f0f0f0'
        },
        header: {
          borderBottom: isDarkMode ? '1px solid #303030' : '1px solid #f0f0f0'
        }
      },
      icon: <LogoutOutlined style={{ color: isDarkMode ? '#ffffff' : '#000000' }} />,
      okButtonProps: {
        style: {
          background: themeColor,
          borderColor: themeColor,
          color: '#ffffff'
        }
      },
      cancelButtonProps: {
        style: isDarkMode ? {
          background: 'transparent',
          borderColor: '#303030',
          color: '#ffffff'
        } : undefined
      },
      onOk: async () => {
        try {
          await logout();
          message.success('Logged out successfully');
        } catch (error) {
          message.error('Failed to logout');
        }
      }
    });
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => navigate('/settings')
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout
    }
  ];

  return (
    <div
      id="test-pro-layout"
      style={{
        height: "100vh",
        overflow: "auto",
      }}
    >
      <ConfigProvider
        componentSize={size}
        theme={{
          algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
          token: {
            colorPrimary: user?.profile?.theme_color || '#3D9970',
          },
        }}
        locale={frFR}
      >
        <ProConfigProvider hashed={false}>
          <ProLayout
            prefixCls="my-prefix"
            fixedHeader
            layout={user?.profile?.layout_preference || 'top'}
            siderMenuType="sub"
            defaultCollapsed={false}
            //@ts-ignore
            headerTitleRender={(logo, title, _) => {
              const defaultDom = (
                <Row align="middle" justify="center" gutter={12}>
                  <Col style={{ display: "flex", alignItems: "center" }}>
                    <img src="/logo_white.png" width={80} alt="Logo" />
                  </Col>
                </Row>
              );
              if (typeof window === "undefined" || document.body.clientWidth < 1400 || _.isMobile) {
                return defaultDom;
              }
              return <>{defaultDom}</>;
            }}
      
            title=""
            logo="/logo_white.png"
            
            route={{
              path: '/',
              routes: authorizedMenuItems
            }}
            location={{
              pathname: location.pathname
            }}
            menu={{
              defaultOpenAll: true
            }}
            //@ts-ignore
            menuItemRender={(item, dom) => (
              <Link 
                to={item.path || '/'} 
                style={{ 
                  color: 'inherit', 
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft:'12px',
                }}
              >
                {item.icon && <span className="anticon">{item.icon}</span>}
                <span>{item.name}</span>
              </Link>
            )}
            avatarProps={{
              src: <img src={avatar} />,
              title: user?.username,
              //@ts-ignore
              render: (props, dom) => (
                <Dropdown 
                  menu={{ items: userMenuItems }} 
                  placement="bottomRight"
                  trigger={['click']}
                >
                  {dom}
                </Dropdown>
              ),
            }}
            //@ts-ignore
            actionsRender={(props) => [
              isDarkMode ? <SunOutlined onClick={handleThemeChange} style={{ color: isDarkMode ? '#fff' : 'inherit' }} /> : <MoonOutlined onClick={handleThemeChange} style={{ color: isDarkMode ? '#fff' : 'inherit' }} />
            ]}
          >
            <ReferenceContextProvider>
              <Outlet />
               {/* Using the separate QuickNavModal component */}

            </ReferenceContextProvider>
            
           
            
            {/* Original F2 Modal implementation (commented out) */}
            {/* <Modal
              title="Quick Navigation"
              open={isF2ModalVisible}
              onCancel={closeF2Modal}
              footer={null}
              width={500}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px' }}>Select MRN</label>
                  <Select
                    placeholder="Select an MRN"
                    style={{ width: '100%' }}
                    value={selectedMrn}
                    onChange={handleMrnChange}
                    options={mrnOptions}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
                    }
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
                      options={articleOptions}
                      showSearch
                      filterOption={(input, option) =>
                        (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
                      }
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
            </Modal> */}
          </ProLayout>
        </ProConfigProvider>
      </ConfigProvider>
    </div>
  );
};
