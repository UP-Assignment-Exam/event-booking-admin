import React, { useState, forwardRef, useImperativeHandle } from 'react';
import {
    Button,
    Modal,
    Form,
    Input,
    Select,
    Switch,
    Row,
    Col,
    Divider,
    message,
} from 'antd';
import {
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    BankOutlined,
    TeamOutlined,
} from '@ant-design/icons';
import httpClient from '../../../../../utils/HttpClient';
import { CREATE_USERS_URL, UPDATE_USERS_URL } from '../../../../../constants/Url';
import { extractErrorMessage } from '../../../../../utils/Utils';

const { Option } = Select;

function ToggleUserModal(props, ref) {
    const { organizations, roles, fetchData } = props;
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
    const [record, setRecord] = useState(null);
    const [mode, setMode] = useState('create'); // 'create' or 'edit'
    const [loading, setLoading] = useState(false);

    const onClose = () => {
        setOpen(false);
        form.resetFields();
        setRecord(null);
    };

    const handleSubmit = async (data) => {
        try {
            setLoading(true);

            // Only include password if it's provided (for edit mode, password is optional)
            const payload = {
                ...data,
                role: data.role || null,
                organization: data.organization || null,
            };

            // Remove empty password for edit mode
            if (mode === 'edit' && !data.password) {
                delete payload.password;
            }

            if (mode === 'create') {
                const res = await httpClient.post(CREATE_USERS_URL, payload).then(res => res.data);

                if (res.status === 200) {
                    message.success('User created successfully!');
                    fetchData();
                    onClose();
                } else {
                    message.error(res.message || 'Failed to create user');
                }
            } else if (mode === 'edit') {
                const res = await httpClient.put(UPDATE_USERS_URL.replace(":id", record?._id), payload).then(res => res.data);

                if (res.status === 200) {
                    message.success('User updated successfully!');
                    fetchData();
                    onClose();
                } else {
                    message.error(res.message || 'Failed to update user');
                }
            }
        } catch (error) {
            console.error("Error saving user:", error);
            message.error(extractErrorMessage(error) || 'Failed to save user. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useImperativeHandle(ref, () => ({
        openModal: async (userData, mode) => {
            setOpen(true);
            setRecord(userData);
            setMode(mode);

            // For edit mode, populate form with existing data
            if (mode === 'edit') {
                form.setFieldsValue({
                    username: userData.username,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    email: userData.email,
                    phone: userData.phone,
                    role: userData.role?._id,
                    organization: userData.organization?._id,
                    isSetup: userData.isSetup,
                    // Don't populate password for security
                });
            } else {
                // For create mode, set default values
                form.setFieldsValue({
                    isSetup: false,
                });
            }
        },
        closeModal: onClose
    }));

    console.log("record =", record);

    return (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <UserOutlined style={{ color: '#667eea' }} />
                    {`${mode === "edit" ? "Edit" : "Create New"} User`}
                </div>
            }
            open={open}
            onCancel={onClose}
            width={700}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                style={{ marginTop: '20px' }}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="username"
                            label="Username"
                            rules={[
                                { required: true, message: 'Please enter username' },
                                { min: 3, message: 'Username must be at least 3 characters' },
                                { pattern: /^[a-zA-Z0-9_]+$/, message: 'Username can only contain letters, numbers, and underscores' }
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined />}
                                placeholder="Enter username"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="email"
                            label="Email Address"
                            rules={[
                                { required: true, message: 'Please enter email address' },
                                { type: 'email', message: 'Please enter a valid email address' }
                            ]}
                        >
                            <Input
                                prefix={<MailOutlined />}
                                placeholder="Enter email address"
                                type="email"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="firstName"
                            label="First Name"
                            rules={[
                                { required: true, message: 'Please enter first name' },
                                { min: 2, message: 'First name must be at least 2 characters' }
                            ]}
                        >
                            <Input placeholder="Enter first name" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="lastName"
                            label="Last Name"
                            rules={[
                                { required: true, message: 'Please enter last name' },
                                { min: 2, message: 'Last name must be at least 2 characters' }
                            ]}
                        >
                            <Input placeholder="Enter last name" />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="phone"
                    label="Phone Number"
                    rules={[
                        { required: true, message: 'Please enter phone number' },
                        { pattern: /^\+?[1-9]\d{1,14}$/, message: 'Please enter a valid phone number' }
                    ]}
                >
                    <Input
                        prefix={<PhoneOutlined />}
                        placeholder="Enter phone number +885*********"
                    />
                </Form.Item>

                {
                    !record?.role?.superAdmin &&
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="role"
                                label="Role"
                                rules={[{ required: true, message: 'Please select a role' }]}
                            >
                                <Select
                                    placeholder="Select user role"
                                    suffixIcon={<TeamOutlined />}
                                    allowClear
                                >
                                    {roles?.map(role => (
                                        <Option key={role._id} value={role._id}>
                                            {role.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="organization"
                                label="Organization"
                            >
                                <Select
                                    placeholder="Select organization (optional)"
                                    suffixIcon={<BankOutlined />}
                                    allowClear
                                >
                                    {organizations?.map(org => (
                                        <Option key={org._id} value={org._id}>
                                            {org.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                }

                {
                    !record?.role?.superAdmin &&
                    mode === "edit" &&
                    <Form.Item
                        name="isSetup"
                        label="Account Setup Status"
                        valuePropName="checked"
                        tooltip="Indicates whether the user has completed their account setup"
                    >
                        <Switch
                            checkedChildren="Setup Complete"
                            unCheckedChildren="Pending Setup"
                        />
                    </Form.Item>
                }

                <Divider />

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <Button onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            border: 'none'
                        }}
                        loading={loading}
                    >
                        {mode === "edit" ? 'Update User' : 'Create User'}
                    </Button>
                </div>
            </Form>
        </Modal>
    );
}

export default forwardRef(ToggleUserModal);