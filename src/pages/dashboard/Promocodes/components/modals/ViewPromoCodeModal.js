
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import {
    Typography,
    Tag,
    Space,
    Modal,
    message,
    Button,
    Avatar,
    Progress,
    Descriptions,
    Form
} from 'antd';
import {
    GiftOutlined,
    CopyOutlined,
    EditOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

function ViewPromoCodeModal(props, ref) {
    const { copyPromoCode, openEditModal } = props;
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
    const [record, setRecord] = useState(null);

    const onClose = () => {
        setOpen(false);
        form.resetFields();
        setRecord(null);
    };

    // Get status color
    const getStatusColor = (status) => {
        const colors = {
            active: '#52c41a',
            inactive: '#faad14',
            expired: '#ff4d4f'
        };
        return colors[status] || colors.active;
    };

    // Get priority color
    const getPriorityColor = (priority) => {
        const colors = {
            critical: '#ff4d4f',
            high: '#fa8c16',
            medium: '#1890ff',
            low: '#52c41a'
        };
        return colors[priority] || colors.medium;
    };

    // Format discount display
    const formatDiscount = (promoCode) => {
        return promoCode.discountType === 'percentage'
            ? `${promoCode.discountValue}% OFF`
            : `$${promoCode.discountValue} OFF`;
    };


    // Calculate usage percentage
    const getUsagePercentage = (current, max) => {
        return Math.round((current / max) * 100);
    };

    // Format timestamp
    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    useImperativeHandle(ref, () => ({
        openModal: (promoData) => {
            setOpen(true);
            form.setFieldsValue(promoData);
            setRecord(promoData);
        },
        closeModal: onClose
    }));

    return (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <GiftOutlined style={{ color: '#667eea' }} />
                    Promo Code Details
                </div>
            }
            open={open}
            onCancel={onClose}
            footer={[
                <Button key="copy" icon={<CopyOutlined />} onClick={() => copyPromoCode(record?.promoCode)}>
                    Copy Code
                </Button>,
                <Button key="edit" type="primary" icon={<EditOutlined />} onClick={() => openEditModal(record)}>
                    Edit Code
                </Button>,
                <Button key="close" onClick={onClose}>
                    Close
                </Button>
            ]}
            width={700}
        >
            {record && (
                <div>
                    <div style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        padding: '20px',
                        borderRadius: '12px',
                        marginBottom: '20px',
                        color: 'white',
                        textAlign: 'center'
                    }}>
                        <Title level={2} style={{ color: 'white', margin: '0 0 8px 0' }}>
                            {record.promoCode}
                        </Title>
                        <Title level={3} style={{ color: 'white', margin: '0 0 8px 0' }}>
                            {formatDiscount(record)}
                        </Title>
                        <Text style={{ color: 'rgba(255,255,255,0.9)' }}>
                            {record.title}
                        </Text>
                    </div>

                    <Descriptions bordered column={2} size="small">
                        <Descriptions.Item label="Description" span={2}>
                            {record.description}
                        </Descriptions.Item>
                        <Descriptions.Item label="Status">
                            <Tag color={getStatusColor(record.status)}>
                                {record.status.toUpperCase()}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Priority">
                            <Tag color={getPriorityColor(record.priority)}>
                                {record.priority.toUpperCase()}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Minimum Order">
                            ${record.minOrder}
                        </Descriptions.Item>
                        <Descriptions.Item label="Usage">
                            <Progress
                                percent={getUsagePercentage(record.currentUses, record.maxUses)}
                                format={() => `${record.currentUses}/${record.maxUses}`}
                                strokeColor={{
                                    '0%': '#667eea',
                                    '100%': '#764ba2',
                                }}
                            />
                        </Descriptions.Item>
                        <Descriptions.Item label="Valid Period" span={2}>
                            {formatDate(record.startDate)} - {formatDate(record.endDate)}
                        </Descriptions.Item>
                        <Descriptions.Item label="Created By" span={2}>
                            <Space>
                                {record.createdBy?.avatar ? (
                                    <Avatar src={record.createdBy?.avatar} size={24} />
                                ) : (
                                    <Avatar size={24}>
                                        {record.createdBy?.username.charAt(0)}
                                    </Avatar>
                                )}
                                <Text>{record.createdBy?.username}</Text>
                            </Space>
                        </Descriptions.Item>
                    </Descriptions>
                </div>
            )}
        </Modal>
    )
}


export default forwardRef(ViewPromoCodeModal)