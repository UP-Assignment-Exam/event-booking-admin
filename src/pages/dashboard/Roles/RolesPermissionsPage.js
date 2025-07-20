import React, { useState } from 'react';
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Select,
    Space,
    Popconfirm,
    message,
    Card,
    Row,
    Col,
    Tag,
    Tooltip,
    Divider,
    Switch,
    Checkbox,
    Tabs,
    Badge,
    Avatar
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    UserOutlined,
    // ShieldCheckOutlined,
    SettingOutlined,
    CrownOutlined,
    SafetyOutlined
} from '@ant-design/icons';
import { GoShieldCheck } from 'react-icons/go';

const { Option } = Select;
const { TextArea } = Input;

const RolesPermissionsCRUD = () => {
    const [roles, setRoles] = useState([
        {
            id: 1,
            name: 'Super Admin',
            description: 'Full system access with all permissions',
            status: 'active',
            userCount: 2,
            permissions: ['users.create', 'users.read', 'users.update', 'users.delete', 'events.create', 'events.read', 'events.update', 'events.delete', 'tickets.create', 'tickets.read', 'tickets.update', 'tickets.delete', 'roles.create', 'roles.read', 'roles.update', 'roles.delete'],
            createdAt: '2024-01-15',
            level: 'system'
        },
        {
            id: 2,
            name: 'Event Manager',
            description: 'Can manage events and view user data',
            status: 'active',
            userCount: 5,
            permissions: ['events.create', 'events.read', 'events.update', 'events.delete', 'tickets.create', 'tickets.read', 'tickets.update', 'users.read'],
            createdAt: '2024-01-20',
            level: 'admin'
        },
        {
            id: 3,
            name: 'Content Editor',
            description: 'Can edit content and manage categories',
            status: 'active',
            userCount: 8,
            permissions: ['events.read', 'events.update', 'tickets.read', 'users.read'],
            createdAt: '2024-02-01',
            level: 'editor'
        },
        {
            id: 4,
            name: 'Support Agent',
            description: 'Customer support with limited access',
            status: 'inactive',
            userCount: 3,
            permissions: ['tickets.read', 'users.read'],
            createdAt: '2024-02-10',
            level: 'support'
        }
    ]);

    const [permissions] = useState([
        { category: 'Users', permissions: ['users.create', 'users.read', 'users.update', 'users.delete'] },
        { category: 'Events', permissions: ['events.create', 'events.read', 'events.update', 'events.delete'] },
        { category: 'Tickets', permissions: ['tickets.create', 'tickets.read', 'tickets.update', 'tickets.delete'] },
        { category: 'Roles', permissions: ['roles.create', 'roles.read', 'roles.update', 'roles.delete'] },
        { category: 'Organizations', permissions: ['orgs.create', 'orgs.read', 'orgs.update', 'orgs.delete'] },
    ]);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentRole, setCurrentRole] = useState(null);
    const [form] = Form.useForm();

    const levelColors = {
        system: '#722ed1',
        admin: '#1890ff',
        editor: '#52c41a',
        support: '#faad14'
    };

    const levelIcons = {
        system: <CrownOutlined />,
        admin: <GoShieldCheck />,
        editor: <EditOutlined />,
        support: <SafetyOutlined />
    };

    const showModal = (role = null) => {
        setCurrentRole(role);
        setIsModalVisible(true);
        if (role) {
            form.setFieldsValue({
                name: role.name,
                description: role.description,
                status: role.status,
                level: role.level,
                permissions: role.permissions
            });
        } else {
            form.resetFields();
        }
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            if (currentRole) {
                // Update existing role
                setRoles(prev => prev.map(role =>
                    role.id === currentRole.id
                        ? { ...role, ...values, updatedAt: new Date().toISOString().split('T')[0] }
                        : role
                ));
                message.success('Role updated successfully!');
            } else {
                // Create new role
                const newRole = {
                    id: Date.now(),
                    ...values,
                    userCount: 0,
                    createdAt: new Date().toISOString().split('T')[0]
                };
                setRoles(prev => [...prev, newRole]);
                message.success('Role created successfully!');
            }

            setIsModalVisible(false);
            form.resetFields();
            setCurrentRole(null);
        } catch (error) {
            message.error('Please fill in all required fields');
        }
    };

    const handleDelete = (id) => {
        setRoles(prev => prev.filter(role => role.id !== id));
        message.success('Role deleted successfully!');
    };

    const toggleStatus = (id) => {
        setRoles(prev => prev.map(role =>
            role.id === id
                ? { ...role, status: role.status === 'active' ? 'inactive' : 'active' }
                : role
        ));
        message.success('Role status updated!');
    };

    const columns = [
        {
            title: 'Role',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Avatar
                        style={{
                            backgroundColor: levelColors[record.level],
                            color: 'white'
                        }}
                        icon={levelIcons[record.level]}
                    />
                    <div>
                        <div style={{ fontWeight: 600, fontSize: '14px' }}>{text}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>
                            Level: <Tag color={levelColors[record.level]} size="small">
                                {record.level.charAt(0).toUpperCase() + record.level.slice(1)}
                            </Tag>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        },
        {
            title: 'Users',
            dataIndex: 'userCount',
            key: 'userCount',
            render: (count) => (
                <Badge
                    count={count}
                    style={{ backgroundColor: '#667eea' }}
                    showZero
                />
            ),
        },
        {
            title: 'Permissions',
            dataIndex: 'permissions',
            key: 'permissions',
            render: (permissions) => (
                <Tooltip title={`${permissions.length} permissions assigned`}>
                    <Tag color="blue">{permissions.length} permissions</Tag>
                </Tooltip>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status, record) => (
                <Switch
                    checked={status === 'active'}
                    onChange={() => toggleStatus(record.id)}
                    checkedChildren="Active"
                    unCheckedChildren="Inactive"
                    style={{
                        backgroundColor: status === 'active' ? '#52c41a' : undefined
                    }}
                />
            ),
        },
        {
            title: 'Created',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Tooltip title="View Details">
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            onClick={() => showModal(record)}
                            style={{ color: '#667eea' }}
                        />
                    </Tooltip>
                    <Tooltip title="Edit Role">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => showModal(record)}
                            style={{ color: '#52c41a' }}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Delete Role"
                        description="Are you sure you want to delete this role?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Tooltip title="Delete Role">
                            <Button
                                type="text"
                                icon={<DeleteOutlined />}
                                style={{ color: '#ff4d4f' }}
                            />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];


    const renderRoleModal = () => (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {/* <ShieldCheckOutlined style={{ color: '#667eea' }} /> */}
                    {currentRole ? 'Edit Role' : 'Create New Role'}
                </div>
            }
            open={isModalVisible}
            onOk={handleSubmit}
            onCancel={() => {
                setIsModalVisible(false);
                form.resetFields();
                setCurrentRole(null);
            }}
            width={800}
            okText={currentRole ? 'Update Role' : 'Create Role'}
            okButtonProps={{
                style: {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none'
                }
            }}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{ status: 'active', permissions: [] }}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="name"
                            label="Role Name"
                            rules={[{ required: true, message: 'Please enter role name' }]}
                        >
                            <Input placeholder="Enter role name" prefix={<UserOutlined />} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="level"
                            label="Role Level"
                            rules={[{ required: true, message: 'Please select role level' }]}
                        >
                            <Select placeholder="Select role level">
                                <Option value="system">
                                    <Space>
                                        <CrownOutlined style={{ color: levelColors.system }} />
                                        System Level
                                    </Space>
                                </Option>
                                <Option value="admin">
                                    <Space>
                                        {/* <ShieldCheckOutlined style={{ color: levelColors.admin }} /> */}
                                        Admin Level
                                    </Space>
                                </Option>
                                <Option value="editor">
                                    <Space>
                                        <EditOutlined style={{ color: levelColors.editor }} />
                                        Editor Level
                                    </Space>
                                </Option>
                                <Option value="support">
                                    <Space>
                                        <SafetyOutlined style={{ color: levelColors.support }} />
                                        Support Level
                                    </Space>
                                </Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ required: true, message: 'Please enter description' }]}
                >
                    <TextArea rows={3} placeholder="Describe the role and its purpose" />
                </Form.Item>

                <Form.Item
                    name="status"
                    label="Status"
                >
                    <Select>
                        <Option value="active">Active</Option>
                        <Option value="inactive">Inactive</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="permissions"
                    label="Permissions"
                    rules={[{ required: true, message: 'Please select at least one permission' }]}
                >
                    <div style={{
                        maxHeight: '300px',
                        overflowY: 'auto',
                        border: '1px solid #d9d9d9',
                        borderRadius: '6px',
                        padding: '12px'
                    }}>
                        {permissions.map((category) => (
                            <div key={category.category}>
                                <Divider orientation="left" orientationMargin={0}>
                                    <span style={{ color: '#667eea', fontWeight: 600 }}>
                                        {category.category}
                                    </span>
                                </Divider>
                                <Checkbox.Group style={{ width: '100%', marginBottom: '16px' }}>
                                    <Row>
                                        {category.permissions.map((perm) => (
                                            <Col span={12} key={perm} style={{ marginBottom: '8px' }}>
                                                <Checkbox value={perm}>
                                                    <span style={{ fontSize: '13px' }}>
                                                        {perm.split('.')[1]?.toUpperCase()} {perm.split('.')[0]}
                                                    </span>
                                                </Checkbox>
                                            </Col>
                                        ))}
                                    </Row>
                                </Checkbox.Group>
                            </div>
                        ))}
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );

    return (
        <div style={{ padding: '0' }}>
            <div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px'
                }}>
                    <div>
                        <h3 style={{ margin: 0, color: '#667eea' }}>Roles Overview</h3>
                        <p style={{ margin: '4px 0 0 0', color: '#64748b' }}>
                            Manage user roles and their access levels
                        </p>
                    </div>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => showModal()}
                        style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            border: 'none',
                            borderRadius: '8px'
                        }}
                    >
                        Create Role
                    </Button>
                </div>

                <Card>
                    <Table
                        columns={columns}
                        dataSource={roles}
                        rowKey="id"
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) =>
                                `${range[0]}-${range[1]} of ${total} roles`,
                        }}
                    />
                </Card>
            </div>
            {renderRoleModal()}
        </div>
    );
};

export default RolesPermissionsCRUD;