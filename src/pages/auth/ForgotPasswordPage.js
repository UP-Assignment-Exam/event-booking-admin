import { Form, Input, Button, message } from 'antd';
import { MailOutlined, ArrowRightOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { Link } from 'react-router-dom'; // ✅ correct for both v5 & v6
import httpClient from '../../utils/HttpClient';
import { extractErrorMessage } from '../../utils/Utils';
import { AUTH_FORGOT_PASSWORD_URL } from '../../constants/Url';

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const handleSend = async (data) => {
    try {
      setLoading(true);
      await httpClient.post(AUTH_FORGOT_PASSWORD_URL, {
        email: data.email,
      }).then((res) => res.data);

      setEmailSent(true);
      setEmail(data.email);
      message.info("If an account with that email exists, we have sent a password reset link.");
    } catch (error) {
      message.error(extractErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setLoading(true);
      await httpClient.post(AUTH_FORGOT_PASSWORD_URL, {
        email: email,
        resend: true,
      }).then((res) => res.data);

      setEmailSent(true);
      message.info('Reset email resent.');
    } catch (error) {
      message.error(extractErrorMessage(error));
    } finally {
      setLoading(false);
    }
    // Replace with actual API call
  };

  return (
    <div className="p-4 forgot-password-form">
      {/* Logo and Title */}
      <div className="text-center mb-4">
        <div className="logo-container">
          <img
            src="/logo.png"
            alt="Logo"
            className='logo'
          />
        </div>
        <h1 className="form-title">Forgot Password</h1>
        <p className="form-subtitle">Enter your email to receive password reset instructions</p>
      </div>

      {!emailSent ? (
        <Form layout="vertical" onFinish={handleSend} className="modern-form">
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
              placeholder="Enter your email address"
              size="large"
              className="modern-input"
            />
          </Form.Item>

          <Form.Item className="submit-container">
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              className="modern-submit-btn"
              loading={loading}
            >
              <span>Send Reset Email</span>
              <ArrowRightOutlined className="submit-icon" />
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <div className="success-state">
          <div className="success-icon-container">
            <CheckCircleOutlined className="success-icon" />
          </div>
          <h3 className="success-title">Email Sent!</h3>
          <p className="success-message">
            We've sent password reset instructions to your email address.
            Please check your inbox and follow the instructions.
          </p>
          <Button
            type="link"
            onClick={handleResend}
            className="resend-btn"
          >
            Didn't receive the email? Resend
          </Button>
        </div>
      )}

      <div className="form-footer">
        <p className="back-to-login">
          Remember your password? <Link to="/login" className="auth-link">Back to Sign In</Link>
        </p>
      </div>
    </div>
  );
}