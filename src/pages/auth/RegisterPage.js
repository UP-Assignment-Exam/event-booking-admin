import React, { useState } from 'react';
import { Form, Input, Button, Select, Typography, DatePicker, message } from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  BankOutlined,
  CaretDownOutlined,
  ArrowRightOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import httpClient from '../../utils/HttpClient';
import { AUTH_REGISTER_URL } from '../../constants/Url';
import { extractErrorMessage } from '../../utils/Utils';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const RegisterPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (data) => {
    try {
      setLoading(true);
      const res = await httpClient.post(AUTH_REGISTER_URL, {
        ...data,
        foundedYear: dayjs(data.foundedYear).year(),
      }).then((res) => res.data);

      if (res.status === 200) {
        message.success('Requested Successfully! Our admin will contact you soon.');
        form.resetFields();
      } else {
        message.error('Register failed: ' + res.message);
      }
    } catch (error) {
      message.error(extractErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 register-form">
      <div className="text-center mb-4">
        <div className="logo-container">
          <img src="/logo.png" alt="Logo" className="logo" />
        </div>
      </div>

      <Title level={3} className="text-center mb-4 form-title">Register Account</Title>

      <Form layout="vertical" form={form} onFinish={onFinish} className="modern-form">
        {/* Personal Info */}
        <div className="form-row">
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[{ required: true, message: 'Please enter your first name' }]}
            className="form-item-half"
          >
            <Input
              prefix={<UserOutlined className="input-icon" />}
              size="large"
              className='modern-input'
              placeholder="First name"
            />
          </Form.Item>

          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[{ required: true, message: 'Please enter your last name' }]}
            className="form-item-half"
          >
            <Input
              prefix={<UserOutlined className="input-icon" />}
              size="large"
              className='modern-input'
              placeholder="Last name"
            />
          </Form.Item>
        </div>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
        >
          <Input
            prefix={<MailOutlined className="input-icon" />}
            className='modern-input'
            size="large"
            placeholder="Email address"
          />
        </Form.Item>

        <Form.Item
          label="Phone Number"
          name="phone"
          rules={[{ required: true, message: 'Please enter your phone number' }]}
        >
          <Input
            className='modern-input'
            size="large"
            prefix={<PhoneOutlined className="input-icon" />}
            placeholder="Phone number"
          />
        </Form.Item>

        {/* Organization Info */}
        <Form.Item
          label="Organization Name"
          name="organizationName"
          rules={[{ required: true, message: 'Please enter organization name' }]}
        >
          <Input
            prefix={<BankOutlined className="input-icon" />}
            className='modern-input'
            size="large"
            placeholder="Organization name"
          />
        </Form.Item>

        <Form.Item
          label="Website"
          name="website"
          rules={[{ required: true, message: 'Please enter website URL' }]}
        >
          <Input
            prefix={<GlobalOutlined className="input-icon" />}
            className='modern-input'
            size="large"
            placeholder="https://example.com"
          />
        </Form.Item>

        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: 'Please select category' }]}
        >
          <Select
            suffixIcon={<CaretDownOutlined className="select-icon" />}
            className='modern-select'
            size="large"
            placeholder="Select category"
            options={[
              { label: 'Company', value: 'Company' },
              { label: 'Non-Profit', value: 'Non-Profit' },
              { label: 'Government', value: 'Government' },
              { label: 'School', value: 'School' },
              { label: 'Other', value: 'Other' },
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Founded Year"
          name="foundedYear"
          rules={[{ required: true, message: 'Please enter the year organization was founded' }]}
        >
          <DatePicker
            className='modern-input'
            picker="year"
            style={{ width: '100%' }}
            size="large"
          />
        </Form.Item>

        <Form.Item
          label="Revenue Range"
          name="revenue"
          rules={[{ required: true, message: 'Please select revenue range' }]}
        >
          <Select
            suffixIcon={<CaretDownOutlined className="select-icon" />}
            className='modern-select'
            size="large"
            placeholder="Select revenue range"
            options={[
              { label: '< $1M', value: '<1M' },
              { label: '$1M - $10M', value: '1M-10M' },
              { label: '> $10M', value: '>10M' },
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: 'Please enter your organization address' }]}
        >
          <Input
            className='modern-input'
            size="large"
            placeholder="1234 Main St, City, Country"
          />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Please provide a description of your organization' }]}
        >
          <TextArea
            className='modern--textarea'
            size='large'
            rows={4}
            placeholder="Describe your organization"
          />
        </Form.Item>

        <Form.Item
          label="Request Reason"
          name="requestReason"
          rules={[{ required: true, message: 'Please explain why you’re submitting this request' }]}
        >
          <TextArea
            className='modern--textarea'
            size='large'
            rows={3}
            placeholder="Explain your reason for the request"
          />
        </Form.Item>

        {/* Submit Button */}
        <div className="form-footer">
          <Paragraph className="text-center login-link">
            Already have an account? <Link to="/login">Sign in here</Link>
          </Paragraph>

          <Form.Item className="submit-container">
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              className="modern-submit-btn"
              loading={loading}
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
