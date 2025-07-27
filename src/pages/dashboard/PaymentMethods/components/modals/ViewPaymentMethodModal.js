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
    Form,
} from 'antd';
import { BankOutlined, CreditCardOutlined, DollarOutlined, QrcodeOutlined, WalletOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

function ViewPaymentMethodModal(props, ref) {
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
    const [record, setRecord] = useState(null);

    const onClose = () => {
        setOpen(false);
        form.resetFields();
        setRecord(null);
    };

    const getTypeIcon = (type) => {
        const icons = {
            card: <CreditCardOutlined />,
            bank: <BankOutlined />,
            wallet: <WalletOutlined />,
            crypto: <DollarOutlined />,
            qr: <QrcodeOutlined />
        };
        return icons[type] || <CreditCardOutlined />;
    };

    const getTypeColor = (type) => {
        const colors = {
            card: '#667eea',
            bank: '#52c41a',
            wallet: '#faad14',
            crypto: '#ff4d4f',
            qr: '#1890ff'
        };
        return colors[type] || '#667eea';
    };

    useImperativeHandle(ref, () => ({
        openModal: async (paymentMethods) => {
            setOpen(true);
            setRecord(paymentMethods);
            form.setFieldsValue({ ...paymentMethods });
        },
        closeModal: onClose
    }));

    return (
        <Modal
            title="Payment Method Details"
            open={open}
            onCancel={onClose}
            width={600}
            footer={[
                <Button key="close" onClick={onClose}>
                    Close
                </Button>
            ]}
        >
            {record && (
                <div style={{ marginTop: '20px' }}>
                    <Row gutter={16}>
                        <Col span={24}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                marginBottom: '20px',
                                padding: '16px',
                                background: 'rgba(102, 126, 234, 0.05)',
                                borderRadius: '8px'
                            }}>
                                <Avatar
                                    size={48}
                                    icon={getTypeIcon(record.type)}
                                    style={{
                                        backgroundColor: getTypeColor(record.type),
                                        color: 'white'
                                    }}
                                />
                                <div>
                                    <Title level={4} style={{ margin: 0 }}>{record.name}</Title>
                                    <Text type="secondary">{record.provider}</Text>
                                    <div>
                                        <Tag color={getTypeColor(record.type)} style={{ marginTop: '4px' }}>
                                            {record.type}
                                        </Tag>
                                        <Badge
                                            status={record.isActive ? 'success' : 'default'}
                                            text={record.isActive ? 'Active' : 'Inactive'}
                                            style={{ marginLeft: '8px' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <div style={{ marginBottom: '16px' }}>
                                <Text strong>Processing Fee</Text>
                                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#667eea' }}>
                                    {record.processingFee === 0 ? 'Free' : `${record.processingFee}%`}
                                </div>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div style={{ marginBottom: '16px' }}>
                                <Text strong>Created Date</Text>
                                <div>{record.createdAt}</div>
                            </div>
                        </Col>
                    </Row>

                    <div style={{ marginBottom: '16px' }}>
                        <Text strong>Description</Text>
                        <div style={{ marginTop: '4px' }}>{record.description}</div>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <Text strong>Supported Currencies</Text>
                        <div style={{ marginTop: '8px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                            {record.supportedCurrencies.map(currency => (
                                <Tag key={currency}>{currency}</Tag>
                            ))}
                        </div>
                    </div>

                    {record.apiKey && (
                        <div style={{ marginBottom: '16px' }}>
                            <Text strong>API Key</Text>
                            <div style={{
                                marginTop: '4px',
                                fontFamily: 'monospace',
                                background: 'rgba(0,0,0,0.05)',
                                padding: '8px',
                                borderRadius: '4px'
                            }}>
                                {record.apiKey}
                            </div>
                        </div>
                    )}

                    {record.webhookUrl && (
                        <div style={{ marginBottom: '16px' }}>
                            <Text strong>Webhook URL</Text>
                            <div style={{ marginTop: '4px' }}>{record.webhookUrl}</div>
                        </div>
                    )}

                    {record.lastUsed && (
                        <div>
                            <Text strong>Last Used</Text>
                            <div>{record.lastUsed}</div>
                        </div>
                    )}
                </div>
            )}
        </Modal>
    )
}


export default forwardRef(ViewPaymentMethodModal)