import { Button, Checkbox, Divider, Form, Input } from 'antd'
import React from 'react'
import { Link } from 'react-router'
import { MailOutlined, LockOutlined, ArrowRightOutlined } from '@ant-design/icons';

export default function LoginPage() {

  const handleSubmit = () => {

  }
  return (
    <div className="p-4 login-form">
      {/* Logo and Title */}
      <div className="text-center mb-4">
        <div className="logo-container">
          <img
            src="/logo.png"
            alt="Logo"
            className='logo'
          />
        </div>
        <h1 className="login-title">EVENT CORE</h1>
        <p className="login-subtitle">Enter your credentials to access your account</p>
      </div>

      <Form
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
        className="modern-form"
      >
        {/* Email */}
        <Form.Item
          label="Email Address"
          name="email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Invalid email address!' },
          ]}
        >
          <Input
            prefix={<MailOutlined className="input-icon" />}
            placeholder="Enter your email"
            size="large"
            className="modern-input"
          />
        </Form.Item>

        {/* Password */}
        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: 'Please input your password!' },
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();
                if (value.length < 8) {
                  return Promise.reject('Password must be at least 8 characters');
                }
                if (value.length > 18) {
                  return Promise.reject('Password must be at most 18 characters');
                }
                if (!/[A-Z]/.test(value)) {
                  return Promise.reject('Must include an uppercase letter');
                }
                if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
                  return Promise.reject('Must include a special character');
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="input-icon" />}
            placeholder="Enter your password"
            size="large"
            className="modern-input"
          />
        </Form.Item>

        {/* Remember & Forgot Password */}
        <div className="form-options">
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox className="modern-checkbox">Remember me</Checkbox>
          </Form.Item>
          <Link to="/forgot-password" className="forgot-link">
            Forgot password?
          </Link>
        </div>

        {/* Login Button */}
        <Form.Item className="submit-container">
          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            className="modern-submit-btn"
          >
            <span>Sign In</span>
            <ArrowRightOutlined className="submit-icon" />
          </Button>
        </Form.Item>
      </Form>

      {/* Divider and Register */}
      <div className="form-footer">
        <Divider className="modern-divider">or</Divider>
        <Link to="/register">
          <Button
            block
            size="large"
            className="modern-secondary-btn"
          >
            Create New Account
          </Button>
        </Link>
      </div>
    </div>
  )
}