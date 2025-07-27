import React, { forwardRef, useImperativeHandle, useState } from 'react';
import {
    Button,
    Modal,
    Tag,
    Row,
    Col,
    Badge,
    Avatar,
    Typography,
    Divider,
    Card,
    Space,
    Tooltip
} from 'antd';
import {
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    CrownOutlined,
    BankOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    EditOutlined,
    SafetyOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

function ViewUserModal(props, ref) {
    const [open, setOpen] = useState(false);
    const [record, setRecord] = useState(null);

    const onClose = () => {
        setOpen(false);
        setRecord(null);
    };

    const getStatusColor = (isDeleted) => {
        return isDeleted ? '#ff4d4f' : '#52c41a';
    };

    const getSetupStatusColor = (isSetup) => {
        return isSetup ? '#52c41a' : '#faad14';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString();
    };

    useImperativeHandle(ref, () => ({
        openModal: async (user) => {
            setOpen(true);
            setRecord(user);
        },
        closeModal: onClose
    }));

    return (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Avatar
                        size={40}
                        style={{
                            backgroundColor: '#667eea',
                            color: 'white'
                        }}
                    >
                        {record?.firstName?.charAt(0)?.toUpperCase() || 'U'}
                    </Avatar>
                    <div>
                        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>User Details</div>
                        <Text type="secondary" style={{ fontSize: '14px' }}>
                            Complete user information and settings
                        </Text>
                    </div>
                </div>
            }
            open={open}
            onCancel={onClose}
            width={800}
            footer={[
                <Button key="close" onClick={onClose}>
                    Close
                </Button>
            ]}
        >
            {record && (
                <div style={{ marginTop: '20px' }}>
                    {/* User Header Card */}
                    <Card style={{ marginBottom: '20px', background: 'rgba(102, 126, 234, 0.05)' }}>
                        <Row align="middle" gutter={20}>
                            <Col>
                                <Avatar
                                    size={80}
                                    style={{
                                        backgroundColor: '#667eea',
                                        color: 'white',
                                        fontSize: '32px'
                                    }}
                                >
                                    {record.firstName?.charAt(0)?.toUpperCase() || 'U'}
                                </Avatar>
                            </Col>
                            <Col flex={1}>
                                <Title level={3} style={{ margin: 0, color: '#667eea' }}>
                                    {record.firstName} {record.lastName}
                                </Title>
                                <Text type="secondary" style={{ fontSize: '16px', display: 'block', marginBottom: '8px' }}>
                                    @{record.username}
                                </Text>
                                <Space size="middle">
                                    <Badge
                                        status={record.isDeleted ? 'error' : 'success'}
                                        text={
                                            <Text strong style={{ color: getStatusColor(record.isDeleted) }}>
                                                {record.isDeleted ? 'Inactive' : 'Active'}
                                            </Text>
                                        }
                                    />
                                    <Badge
                                        status={record.isSetup ? 'success' : 'warning'}
                                        text={
                                            <Text strong style={{ color: getSetupStatusColor(record.isSetup) }}>
                                                Setup {record.isSetup ? 'Completed' : 'Pending'}
                                            </Text>
                                        }
                                    />
                                </Space>
                            </Col>
                        </Row>
                    </Card>

                    <Row gutter={20}>
                        {/* Contact Information */}
                        <Col span={12}>
                            <Card 
                                title={
                                    <Space>
                                        <MailOutlined style={{ color: '#667eea' }} />
                                        Contact Information
                                    </Space>
                                }
                                size="small"
                                style={{ height: '100%' }}
                            >
                                <div style={{ marginBottom: '16px' }}>
                                    <Text strong style={{ display: 'block', marginBottom: '4px' }}>
                                        <MailOutlined style={{ marginRight: '8px', color: '#667eea' }} />
                                        Email Address
                                    </Text>
                                    <Text copyable style={{ fontSize: '14px' }}>
                                        {record.email}
                                    </Text>
                                </div>

                                <div style={{ marginBottom: '16px' }}>
                                    <Text strong style={{ display: 'block', marginBottom: '4px' }}>
                                        <PhoneOutlined style={{ marginRight: '8px', color: '#52c41a' }} />
                                        Phone Number
                                    </Text>
                                    <Text style={{ fontSize: '14px' }}>
                                        {record.phone}
                                    </Text>
                                </div>
                            </Card>
                        </Col>

                        {/* Role & Organization */}
                        <Col span={12}>
                            <Card 
                                title={
                                    <Space>
                                        <CrownOutlined style={{ color: '#faad14' }} />
                                        Role & Organization
                                    </Space>
                                }
                                size="small"
                                style={{ height: '100%' }}
                            >
                                <div style={{ marginBottom: '16px' }}>
                                    <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                                        <CrownOutlined style={{ marginRight: '8px', color: '#faad14' }} />
                                        Role
                                    </Text>
                                    {record.role ? (
                                        <Tag 
                                            color="#faad14" 
                                            icon={<CrownOutlined />}
                                            style={{ fontSize: '13px', padding: '4px 12px' }}
                                        >
                                            {record.role.name}
                                        </Tag>
                                    ) : (
                                        <Text type="secondary">No role assigned</Text>
                                    )}
                                </div>

                                <div>
                                    <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                                        <BankOutlined style={{ marginRight: '8px', color: '#52c41a' }} />
                                        Organization
                                    </Text>
                                    {record.organization ? (
                                        <Tag 
                                            color="#52c41a" 
                                            icon={<BankOutlined />}
                                            style={{ fontSize: '13px', padding: '4px 12px' }}
                                        >
                                            {record.organization.name}
                                        </Tag>
                                    ) : (
                                        <Text type="secondary">No organization assigned</Text>
                                    )}
                                </div>
                            </Card>
                        </Col>
                    </Row>

                    <Divider />

                    {/* Security & Setup Status */}
                    <Row gutter={20}>
                        <Col span={12}>
                            <Card 
                                title={
                                    <Space>
                                        <SafetyOutlined style={{ color: '#ff4d4f' }} />
                                        Security Information
                                    </Space>
                                }
                                size="small"
                            >
                                <div style={{ marginBottom: '16px' }}>
                                    <Text strong style={{ display: 'block', marginBottom: '4px' }}>
                                        <SafetyOutlined style={{ marginRight: '8px', color: '#ff4d4f' }} />
                                        Password Status
                                    </Text>
                                    <Text type="secondary">
                                        {record.passwordChangedAt ? 
                                            `Last changed: ${formatDate(record.passwordChangedAt)}` : 
                                            'Never changed'
                                        }
                                    </Text>
                                </div>

                                <div>
                                    <Text strong style={{ display: 'block', marginBottom: '4px' }}>
                                        Account Setup
                                    </Text>
                                    <Space>
                                        {record.isSetup ? (
                                            <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '16px' }} />
                                        ) : (
                                            <ExclamationCircleOutlined style={{ color: '#faad14', fontSize: '16px' }} />
                                        )}
                                        <Text style={{ color: getSetupStatusColor(record.isSetup) }}>
                                            {record.isSetup ? 'Setup Completed' : 'Setup Required'}
                                        </Text>
                                    </Space>
                                </div>
                            </Card>
                        </Col>

                        <Col span={12}>
                            <Card 
                                title={
                                    <Space>
                                        <ClockCircleOutlined style={{ color: '#1890ff' }} />
                                        Activity Timeline
                                    </Space>
                                }
                                size="small"
                            >
                                <div style={{ marginBottom: '16px' }}>
                                    <Text strong style={{ display: 'block', marginBottom: '4px' }}>
                                        <CalendarOutlined style={{ marginRight: '8px', color: '#52c41a' }} />
                                        Created Date
                                    </Text>
                                    <Text style={{ fontSize: '14px' }}>
                                        {formatDate(record.createdAt)}
                                    </Text>
                                </div>

                                <div>
                                    <Text strong style={{ display: 'block', marginBottom: '4px' }}>
                                        <EditOutlined style={{ marginRight: '8px', color: '#faad14' }} />
                                        Last Updated
                                    </Text>
                                    <Text style={{ fontSize: '14px' }}>
                                        {formatDate(record.updatedAt)}
                                    </Text>
                                </div>
                            </Card>
                        </Col>
                    </Row>

                    {/* Additional Information */}
                    <Divider />
                    
                    <Card 
                        title={
                            <Space>
                                <UserOutlined style={{ color: '#667eea' }} />
                                System Information
                            </Space>
                        }
                        size="small"
                    >
                        <Row gutter={20}>
                            <Col span={8}>
                                <div style={{ textAlign: 'center', padding: '16px' }}>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea' }}>
                                        {record._id.substring(0, 8)}...
                                    </div>
                                    <Text type="secondary">User ID</Text>
                                </div>
                            </Col>
                            <Col span={8}>
                                <div style={{ textAlign: 'center', padding: '16px' }}>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: getStatusColor(record.isDeleted) }}>
                                        {record.isDeleted ? 'INACTIVE' : 'ACTIVE'}
                                    </div>
                                    <Text type="secondary">Account Status</Text>
                                </div>
                            </Col>
                            <Col span={8}>
                                <div style={{ textAlign: 'center', padding: '16px' }}>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: getSetupStatusColor(record.isSetup) }}>
                                        {record.isSetup ? 'READY' : 'PENDING'}
                                    </div>
                                    <Text type="secondary">Setup Status</Text>
                                </div>
                            </Col>
                        </Row>
                    </Card>
                </div>
            )}
        </Modal>
    );
}

export default forwardRef(ViewUserModal);