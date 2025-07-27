import { Form, Input, Button, message, Spin } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { LockOutlined, CheckCircleOutlined, ArrowRightOutlined } from '@ant-design/icons';
import httpClient from '../../utils/HttpClient';
import { AUTH_RESET_PASSWORD_URL, AUTH_VERIFY_TOKEN_URL } from '../../constants/Url';
import { extractErrorMessage, objectToQuery } from '../../utils/Utils';
import { debounce } from 'lodash';

export default function ResetPasswordPage() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [valid, setValid] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);


  const verifyToken = useCallback(async () => {
    try {
      setLoading(true);

      const query = new URLSearchParams(location.search);
      const tokenParam = query.get('token');
      const emailParam = query.get('email');

      const res = await httpClient.get(objectToQuery(AUTH_VERIFY_TOKEN_URL, {
        token: tokenParam,
        email: emailParam
      })).then(res => res.data)

      if (res.status === 200) {
        setToken(tokenParam);
        setEmail(emailParam);
        setValid(true);
      } else {
        message.error(res?.message);
        setValid(false);
      }
    } catch (error) {
      message.error(extractErrorMessage(error) || "Interal Server Error!");
      setValid(false);
    } finally {
      setLoading(false);
    }

  }, [location.search])

  const debounceVerifyToken = useCallback(debounce(verifyToken, 300), [verifyToken]);

  useEffect(() => {
    debounceVerifyToken()

    return debounceVerifyToken.cancel
  }, [debounceVerifyToken])

  const handleReset = async (values) => {
    try {
      setSubmitLoading(true);

      const res = await httpClient.post(AUTH_RESET_PASSWORD_URL, {
        newPassword: values?.password,
        token: token, 
        email: email
      }).then(res => res.data)

      if (res.status === 200) {
        setResetSuccess(true);
        message.success('Password reset successfully!');
      } else {
        message.error(res?.message);
      }
    } catch (error) {
      message.error(extractErrorMessage(error) || "Interal Server Error!");
    } finally {
      setSubmitLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="p-4 reset-password-form text-center">
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
            Verifying reset link for <strong className="email-highlight">{email}</strong>
          </p>
        </div>

        <Spin size="large" />
      </div>
    );
  }


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
              loading={submitLoading}
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
          Remember your password? <Link to="/login" className="auth-link">Back to Sign In</Link>
        </p>
      </div>
    </div>
  );
}