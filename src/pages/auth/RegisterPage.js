import React from 'react';
import { Form, Input, Button, Dropdown, Menu, Typography, div, Select } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { UserOutlined, MailOutlined, PhoneOutlined, BankOutlined, CaretDownOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Link } from 'react-router';

const { Title, Paragraph } = Typography;

const RegisterPage = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Form Submitted:', values);
    // Send data to API here
  };

  return (
    <div className="p-4 register-form">
      <div className="text-center mb-4">
        <div className="logo-container">
          <img
            src="/logo.png"
            alt="Logo"
            className='logo'
          />
        </div>
      </div>

      <Title level={3} className="text-center mb-4 form-title">Register Account</Title>

      <Form layout="vertical" form={form} onFinish={onFinish} className="modern-form">
        <div className="form-row">
          <Form.Item
            label="First Name"
            name="firstname"
            rules={[{ required: true, message: 'Please enter your first name' }]}
            className="form-item-half"
          >
            <Input
              placeholder="Enter your first name"
              className="modern-input"
              size='large'

              prefix={<UserOutlined className="input-icon" />}
            />
          </Form.Item>

          <Form.Item
            label="Last Name"
            name="lastname"
            rules={[{ required: true, message: 'Please enter your last name' }]}
            className="form-item-half"
          >
            <Input
              placeholder="Enter your last name"
              className="modern-input"
              size='large'
              prefix={<UserOutlined className="input-icon" />}
            />
          </Form.Item>
        </div>

        <Form.Item
          label="Email Address"
          name="email"
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Invalid email address' },
          ]}
        >
          <Input
            placeholder="example@email.com"
            className="modern-input"
            size='large'

            prefix={<MailOutlined className="input-icon" />}
          />
        </Form.Item>

        <Form.Item
          label="Phone Number"
          name="phone"
          rules={[{ required: true, message: 'Please enter your phone number' }]}
        >
          <Input
            placeholder="Enter your phone number"
            className="modern-input"
            size='large'
            prefix={<PhoneOutlined className="input-icon" />}
          />
        </Form.Item>

        <Form.Item
          label="Organization Name"
          name="organizationname"
          rules={[{ required: true, message: 'Please enter organization name' }]}
        >
          <Input
            placeholder="Enter your organization name"
            className="modern-input"
            size='large'
            prefix={<BankOutlined className="input-icon" />}
          />
        </Form.Item>

        <Form.Item
          label="Select Category"
          name="selectedOption"
          rules={[{ required: true, message: 'Please select an option' }]}
        >
          <Select
            placeholder="Choose an option"
            size='large'
            suffixIcon={<CaretDownOutlined className="select-icon" />}
            options={[
              { value: "Option 1", label: "Option 1" },
              { value: "Option 2", label: "Option 2" },
              { value: "Option 3", label: "Option 3" },
            ]}
          />
        </Form.Item>

        <Form.Item
          className='custom-ant-form-item-label'
          label="Secondary Phone Number"
          name="optionalPhone"
          tooltip="Optional field"
        >
          <Input
            placeholder="Enter another phone number (optional)"
            className="modern-input optional-input"
            size='large'
            prefix={<PhoneOutlined className="input-icon" />}
          />
        </Form.Item>

        <div className="form-footer">
          <Paragraph className="text-center login-link">
            Already have an account? <Link to="/login" className="auth-link">Sign in here</Link>
          </Paragraph>

          <Form.Item className="submit-container">
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              className="modern-submit-btn"
            >
              <span>Register Account</span>
              <ArrowRightOutlined className="submit-icon" />
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default RegisterPage;