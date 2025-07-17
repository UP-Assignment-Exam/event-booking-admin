import { Form, Input, Button, message } from 'antd';
import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { LockOutlined, CheckCircleOutlined, ArrowRightOutlined } from '@ant-design/icons';

export default function SetupPasswordPage() {
  const location = useLocation();
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [valid, setValid] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const tokenParam = query.get('token');
    const emailParam = query.get('email');

    if (tokenParam && emailParam) {
      setToken(tokenParam);
      setEmail(emailParam);
      setValid(true);
    }
  }, [location.search]);

  const handleReset = (values) => {
    // Replace with your API call
    console.log('Resetting password for:', email, 'Token:', token, 'New password:', values.password);
    setResetSuccess(true);
    message.success('Password reset successfully!');
  };

  if (!valid) {
    return (
      <div className="p-4 reset-password-form">
        <div className="text-center mb-4">
          <div className="logo-container">
            <img
              src="/logo.png"
              alt="Logo"
              className='logo'
            />
          </div>
          <h1 className="form-title">Invalid Reset Link</h1>
          <p className="error-message">
            The password reset link is invalid or has expired. Please request a new one.
          </p>
        </div>
        <div className="form-footer">
          <Link to="/forgot-password">
            <Button
              type="primary"
              block
              size="large"
              className="modern-submit-btn"
            >
              <span>Request New Reset Link</span>
              <ArrowRightOutlined className="submit-icon" />
            </Button>
          </Link>
          <p className="back-to-login">
            <Link to="/login" className="auth-link">Back to Sign In</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 reset-password-form">
      {/* Logo and Title */}
      <div className="text-center mb-4">
        <div className="logo-container">
          <img
            src="/logo.png"
            alt="Logo"
            className='logo'
          />
        </div>
        <h1 className="form-title">Set New Password</h1>
        <p className="form-subtitle">
          Create a new password for <strong className="email-highlight">{email}</strong>
        </p>
      </div>

      {!resetSuccess ? (
        <Form layout="vertical" onFinish={handleReset} className="modern-form">
          <Form.Item
            label="New Password"
            name="password"
            rules={[
              { required: true, message: 'Please enter a new password' },
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
              placeholder="Enter new password"
              size="large"
              className="modern-input"
            />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirm"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject('Passwords do not match');
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="input-icon" />}
              placeholder="Confirm new password"
              size="large"
              className="modern-input"
            />
          </Form.Item>

          <div className="password-requirements">
            <p className="requirements-title">Password Requirements:</p>
            <ul className="requirements-list">
              <li>At least 8 characters long</li>
              <li>Contains an uppercase letter</li>
              <li>Contains a special character</li>
              <li>Maximum 18 characters</li>
            </ul>
          </div>

          <Form.Item className="submit-container">
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              className="modern-submit-btn"
            >
              <span>Reset Password</span>
              <ArrowRightOutlined className="submit-icon" />
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <div className="success-state">
          <div className="success-icon-container">
            <CheckCircleOutlined className="success-icon" />
          </div>
          <h3 className="success-title">Password Reset Complete!</h3>
          <p className="success-message">
            Your password has been successfully reset. You can now sign in with your new password.
          </p>
          <Link to="/login">
            <Button
              type="primary"
              block
              size="large"
              className="modern-submit-btn"
            >
              <span>Sign In Now</span>
              <ArrowRightOutlined className="submit-icon" />
            </Button>
          </Link>
        </div>
      )}

      <div className="form-footer">
        <p className="back-to-login">
          Already setup? <Link to="/login" className="auth-link">Back to Sign In</Link>
        </p>
      </div>
    </div>
  );
}
