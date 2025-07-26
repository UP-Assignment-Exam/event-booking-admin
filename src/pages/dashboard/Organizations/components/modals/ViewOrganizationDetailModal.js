import React, { forwardRef, useImperativeHandle, useState } from 'react';
import {
    Button,
    Modal,
    Form,
    Input,
    Select,
    Space,
    Tag,
    Badge,
    Avatar,
    Typography,
    Divider,
    Descriptions,
} from 'antd';
import {
    CheckOutlined,
    CloseOutlined,
    CalendarOutlined,
    UserOutlined,
    PhoneOutlined,
    MailOutlined,
    GlobalOutlined,
    EnvironmentOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

function ViewOrganizationDetailModal(props, ref) {
    const { handleReject, handleApprove } = props;
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
    const [record, setRecord] = useState(null);

    const onClose = () => {
        setOpen(false);
        setRecord(null);
        form.resetFields();
    }

    const getStatusText = (status) => {
        const texts = {
            pending: 'Pending',
            under_review: 'Under Review',
            approved: 'Approved',
            rejected: 'Rejected'
        };
        return texts[status] || 'Pending';
    };

    const getPriorityColor = (priority) => {
        const colors = {
            low: '#52c41a',
            medium: '#faad14',
            high: '#ff4d4f'
        };
        return colors[priority] || '#faad14';
    };

    useImperativeHandle(ref, () => ({
        openModal: (record) => {
            setRecord(record);
            setOpen(true);
            form.resetFields();
        },
        closeModal: onClose
    }));
    return (
        <Modal
            title="Organization Request Details"
            open={open}
            onCancel={onClose}
            width={900}
            footer={record && (record.status === 'pending' || record.status === 'under_review') ? [
                <Button key="reject" onClick={() => {
                    onClose();
                    handleReject(record);
                }} style={{ color: '#ff4d4f', borderColor: '#ff4d4f' }}>
                    <CloseOutlined /> Reject
                </Button>,
                <Button
                    key="approve"
                    type="primary"
                    onClick={() => {
                        onClose();
                        handleApprove(record);
                    }}
                    style={{
                        background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
                        border: 'none'
                    }}
                >
                    <CheckOutlined /> Approve
                </Button>
            ] : [
                <Button key="close" onClick={onClose}>
                    Close
                </Button>
            ]}
        >
            {record && (
                <div style={{ marginTop: '20px' }}>
                    {/* Organization Header */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                        marginBottom: '24px',
                        padding: '20px',
                        background: 'rgba(102, 126, 234, 0.05)',
                        borderRadius: '12px'
                    }}>
                        <Avatar
                            src={record.logo}
                            size={64}
                            style={{
                                backgroundColor: '#667eea',
                                color: 'white',
                                fontSize: '24px'
                            }}
                        >
                            {record.organizationName.charAt(0)}
                        </Avatar>
                        <div style={{ flex: 1 }}>
                            <Title level={3} style={{ margin: 0, marginBottom: '4px' }}>
                                {record.organizationName}
                            </Title>
                            <Text type="secondary" style={{ fontSize: '14px' }}>
                                {record.organizationCategory} • Founded {record.foundedYear}
                            </Text>
                            <div style={{ marginTop: '8px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <Badge
                                    status={record.status === 'approved' ? 'success' : record.status === 'rejected' ? 'error' : 'processing'}
                                    text={getStatusText(record.status)}
                                />
                                <Tag color={getPriorityColor(record.priority)}>
                                    {record.priority} priority
                                </Tag>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Information */}
                    <Descriptions title="Organization Details" bordered column={2} size="small">
                        <Descriptions.Item label="Contact Person" span={1}>
                            <UserOutlined style={{ marginRight: '4px' }} />
                            {record.contactName}
                        </Descriptions.Item>
                        <Descriptions.Item label="Email" span={1}>
                            <MailOutlined style={{ marginRight: '4px' }} />
                            {record.email}
                        </Descriptions.Item>
                        <Descriptions.Item label="Phone" span={1}>
                            <PhoneOutlined style={{ marginRight: '4px' }} />
                            {record.phone}
                        </Descriptions.Item>
                        <Descriptions.Item label="Website" span={1}>
                            <GlobalOutlined style={{ marginRight: '4px' }} />
                            <a href={record.website} target="_blank" rel="noopener noreferrer">
                                {record.website}
                            </a>
                        </Descriptions.Item>
                        <Descriptions.Item label="Address" span={2}>
                            <EnvironmentOutlined style={{ marginRight: '4px' }} />
                            {record.address}
                        </Descriptions.Item>
                        {/* <Descriptions.Item label="Employee Count" span={1}>
                {record.employeeCount}
              </Descriptions.Item> */}
                        <Descriptions.Item label="Request Date" span={1}>
                            <CalendarOutlined style={{ marginRight: '4px' }} />
                            {dayjs(record.createdAt).format('YYYY-MM-DD')}
                        </Descriptions.Item>
                        <Descriptions.Item label="Revenue Range" span={1}>
                            {record.revenue}
                        </Descriptions.Item>
                        {/* <Descriptions.Item label="Previous Partnerships" span={1}>
                {record.previousPartnerships}
              </Descriptions.Item> */}
                    </Descriptions>

                    <Divider />

                    {/* Description */}
                    <div style={{ marginBottom: '20px' }}>
                        <Title level={5}>Organization Description</Title>
                        <Paragraph>{record.description}</Paragraph>
                    </div>

                    {/* Request Reason */}
                    <div style={{ marginBottom: '20px' }}>
                        <Title level={5}>Request Reason</Title>
                        <Paragraph>{record.requestReason}</Paragraph>
                    </div>

                    {/* Documents Section */}
                    {/* <div style={{ marginBottom: '20px' }}>
              <Title level={5}>Submitted Documents</Title>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {record.documents.map((doc, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '8px 12px',
                      background: 'rgba(0,0,0,0.02)',
                      borderRadius: '6px',
                      border: `1px solid ${doc.verified ? '#52c41a' : '#faad14'}`
                    }}
                  >
                    <FileImageOutlined style={{ color: '#667eea' }} />
                    <span style={{ flex: 1 }}>{doc.name}</span>
                    <Tag color={doc.verified ? 'success' : 'warning'}>
                      {doc.verified ? 'Verified' : 'Pending'}
                    </Tag>
                    <Button type="link" size="small">View</Button>
                  </div>
                ))}
              </div>
            </div> */}

                    {/* Social Media */}
                    {record.socialMedia && Object.keys(record.socialMedia).length > 0 && (
                        <div style={{ marginBottom: '20px' }}>
                            <Title level={5}>Social Media</Title>
                            <Space wrap>
                                {Object.entries(record.socialMedia).map(([platform, url]) => (
                                    <Tag key={platform} color="#667eea">
                                        <a href={url} target="_blank" rel="noopener noreferrer">
                                            {platform.charAt(0).toUpperCase() + platform.slice(1)}
                                        </a>
                                    </Tag>
                                ))}
                            </Space>
                        </div>
                    )}

                    {/* Rejection Reason (if rejected) */}
                    {record.status === 'rejected' && record.actionReason && (
                        <div style={{ marginTop: '20px' }}>
                            <Title level={5} style={{ color: '#ff4d4f' }}>
                                <ExclamationCircleOutlined style={{ marginRight: '8px' }} />
                                Rejection Reason
                            </Title>
                            <div style={{
                                padding: '12px',
                                background: 'rgba(255, 77, 79, 0.1)',
                                border: '1px solid rgba(255, 77, 79, 0.3)',
                                borderRadius: '6px'
                            }}>
                                {record.actionReason}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </Modal>
    )
}


export default forwardRef(ViewOrganizationDetailModal);