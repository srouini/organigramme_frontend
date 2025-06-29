import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  ColorPicker,
  message,
  Divider,
} from 'antd';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

const { Option } = Select;

const Settings: React.FC = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const handleUpdateProfile = async (values: any) => {
    try {
      setLoading(true);
      const response = await axios.put('/api/auth/update-profile/', {
        first_name: values.firstName,
        last_name: values.lastName,
        email: values.email,
        profile: {
          layout_preference: values.layoutPreference,
          theme_color: typeof values.themeColor === 'string' 
            ? values.themeColor 
            : values.themeColor.toHexString(),
          theme_mode: values.themeMode,
          allowed_pages: user?.profile?.allowed_pages || [],
        }
      });
      
      setUser(response.data.user);
      message.success('Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
      message.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (values: any) => {
    try {
      setLoading(true);
      if (values.newPassword !== values.confirmPassword) {
        message.error('Passwords do not match!');
        return;
      }
      
      await axios.post('/api/auth/change-password/', {
        old_password: values.oldPassword,
        new_password: values.newPassword
      });
      
      message.success('Password changed successfully');
      passwordForm.resetFields();
    } catch (error: any) {
      if (error.response?.data?.error) {
        message.error(error.response.data.error);
      } else {
        message.error('Failed to change password');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatHexColor = (color: string) => {
    // If color is already in hex format, return it
    if (color.startsWith('#')) {
      return color;
    }
    // Otherwise, create a temporary div to convert the color
    const div = document.createElement('div');
    div.style.color = color;
    document.body.appendChild(div);
    const computedColor = window.getComputedStyle(div).color;
    document.body.removeChild(div);
    // Convert rgb to hex
    const rgb = computedColor.match(/\d+/g);
    if (rgb) {
      const hex = '#' + rgb.map(x => {
        const hex = parseInt(x).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      }).join('');
      return hex;
    }
    return color;
  };

  return (
    <div style={{ width:"100%", margin: '0 auto', padding: '24px' }}>
      <Card title="Profile Settings">
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            firstName: user?.first_name || '',
            lastName: user?.last_name || '',
            email: user?.email || '',
            layoutPreference: user?.profile?.layout_preference || 'side',
            themeMode: user?.profile?.theme_mode || 'light',
            themeColor: formatHexColor(user?.profile?.theme_color || '#1890ff'),
          }}
          onFinish={handleUpdateProfile}
        >
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[{ required: true, message: 'Please input your first name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[{ required: true, message: 'Please input your last name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input />
          </Form.Item>
          <Divider dashed />
          <Form.Item
            label="Layout Preference"
            name="layoutPreference"
            rules={[{ required: true, message: 'Please select a layout!' }]}
          >
            <Select>
              <Option value="top">Top Navigation</Option>
              <Option value="side">Side Navigation</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Theme Mode"
            name="themeMode"
            rules={[{ required: true, message: 'Please select a theme mode!' }]}
          >
            <Select>
              <Option value="light">Light Theme</Option>
              <Option value="dark">Dark Theme</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Theme Color"
            name="themeColor"
            rules={[{ required: true, message: 'Please select a color!' }]}
          >
            <ColorPicker format="hex" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Update Profile
            </Button>
          </Form.Item>
        </Form>

        <Divider dashed />

        <h2>Change Password</h2>
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handleChangePassword}
          style={{ maxWidth: 400 }}
        >
          <Form.Item
            name="oldPassword"
            label="Current Password"
            rules={[{ required: true, message: 'Please input your current password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              { required: true, message: 'Please input your new password!' },
              { min: 8, message: 'Password must be at least 8 characters!' }
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={['newPassword']}
            hasFeedback
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Change Password
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Settings;
