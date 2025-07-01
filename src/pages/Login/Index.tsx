import React, { useState } from "react";
import { Button, Col, ConfigProvider, Form, Input, message, Row } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useAuth } from "@/context/AuthContext"
import { useNavigate, useLocation } from 'react-router-dom';


interface LoginParams {
  username: string;
  password: string;
}


const LoginPage: React.FC = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const from = (location.state as any)?.from?.pathname || '/';
  console.log('Login page state:', { isAuthenticated, from });

  const [passwordVisible, setPasswordVisible] = useState(false);

  // Redirect if already logged in
  React.useEffect(() => {
    if (isAuthenticated) {
      console.log('Already authenticated, redirecting to:', from);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (values: LoginParams) => {
    setLoading(true);
    try {
      console.log('Attempting login...');
      await login(values.username, values.password);
      message.success('Login successful!');
      // Navigation will be handled by the useEffect above
    } catch (error) {
      //message.error('Login error:', error?.response?.data?.error || "Error logging in.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white"
      }}
    >
<div style={{ width:"350px"}}>
      <div style={{ textAlign: "left", outline: "none", position: "absolute", top: "40px", left: "40px" }}>
        <img src="/organigramme.png" style={{ outline: "none" }} alt="Logo" width={70} />
      </div>

      <Row style={{ marginBottom: "10px", display: "flex", justifyContent:"left" }}>
        <div style={{ textAlign: "left", outline: "none", fontSize:"20pt", fontWeight:"bold" }}>
          Connexion.
        </div>
      </Row>

      <Row style={{ marginBottom: "10px", display: "flex", justifyContent:"left" }}>
        <div style={{ textAlign: "left", outline: "none", fontSize:"11pt", fontWeight:"light" }}>
          Welcome to <b style={{color:"#968b6a" }}>Organigramme</b>,
        </div>
      </Row>
      <Row style={{ marginBottom: "40px", display: "flex", justifyContent:"left" }}>
        <div style={{ textAlign: "left", outline: "none", fontSize:"11pt", fontWeight:"light" }}>
          Organigrammes made easy.
        </div>
      </Row>
      <Row style={{ width: "100%", maxWidth: "350px" }}>
        <Form
          name="normal_login"
          initialValues={{ remember: true }}
          onFinish={handleSubmit}
          style={{ width: "100%" }}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Nom d'utilisateur"
              style={{ height: "45px", borderRadius: "15px" }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
              {
                min: 7,
                message: "Minimum length required 8 characters",
              },
            ]}
          >
            <Row gutter={8}>
              <Col span={24}>
                <Input.Password
                  prefix={<LockOutlined />}
                  visibilityToggle={{
                    visible: passwordVisible,
                    onVisibleChange: setPasswordVisible,
                  }}
                  placeholder="Password"
                  style={{ height: "45px", borderRadius: "15px" }}
                />
              </Col>

            </Row>
          </Form.Item>

          <ConfigProvider>
            <Form.Item>
              <Button
                type="primary"
                className="linearGradientButton"
                htmlType="submit"
                block
                style={{ height: "45px", borderRadius: "15px", backgroundColor: "#968b6a" }}
                loading={loading}
              >
                Log in
              </Button>
            </Form.Item>
          </ConfigProvider>
        </Form>
      </Row>
      </div>
    </div>
  );
};

export default LoginPage;
