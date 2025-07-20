import React, { useState, useEffect } from 'react';
import {
    Card,
    Table,
    Button,
    Modal,
    Form,
    Input,
    Select,
    Switch,
    Space,
    Popconfirm,
    message,
    Tag,
    Tooltip,
    Row,
    Col,
    Badge,
    Avatar,
    Typography,
    Divider
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    SearchOutlined,
    ReloadOutlined,
    FilterOutlined,
    CreditCardOutlined,
    BankOutlined,
    WalletOutlined,
    QrcodeOutlined,
    DollarOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const PaymentMethodPage = () => {
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [editingMethod, setEditingMethod] = useState(null);
    const [viewingMethod, setViewingMethod] = useState(null);
    const [form] = Form.useForm();
    const [searchText, setSearchText] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterType, setFilterType] = useState('all');

    // Mock data
    useEffect(() => {
        loadPaymentMethods();
    }, []);

    const loadPaymentMethods = () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            const mockData = [
                {
                    id: 1,
                    name: 'Credit Card',
                    type: 'card',
                    provider: 'Stripe',
                    isActive: true,
                    description: 'Accept all major credit cards including Visa, MasterCard, American Express',
                    apiKey: 'sk_test_***************',
                    webhookUrl: 'https://api.example.com/stripe/webhook',
                    supportedCurrencies: ['USD', 'EUR', 'GBP'],
                    processingFee: 2.9,
                    createdAt: '2024-01-15',
                    lastUsed: '2024-07-19'
                },
                {
                    id: 2,
                    name: 'PayPal',
                    type: 'wallet',
                    provider: 'PayPal',
                    isActive: true,
                    description: 'PayPal payment gateway for secure online transactions',
                    apiKey: 'AQkquBDf***************',
                    webhookUrl: 'https://api.example.com/paypal/webhook',
                    supportedCurrencies: ['USD', 'EUR', 'CAD'],
                    processingFee: 3.5,
                    createdAt: '2024-02-10',
                    lastUsed: '2024-07-18'
                },
                {
                    id: 3,
                    name: 'Bank Transfer',
                    type: 'bank',
                    provider: 'Manual',
                    isActive: false,
                    description: 'Direct bank transfer for large transactions',
                    apiKey: null,
                    webhookUrl: null,
                    supportedCurrencies: ['USD', 'EUR'],
                    processingFee: 0,
                    createdAt: '2024-03-05',
                    lastUsed: '2024-07-10'
                },
                {
                    id: 4,
                    name: 'Apple Pay',
                    type: 'wallet',
                    provider: 'Apple',
                    isActive: true,
                    description: 'Apple Pay integration for iOS devices',
                    apiKey: 'merchant.com.example',
                    webhookUrl: 'https://api.example.com/applepay/webhook',
                    supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD'],
                    processingFee: 2.9,
                    createdAt: '2024-04-20',
                    lastUsed: '2024-07-19'
                },
                {
                    id: 5,
                    name: 'Cryptocurrency',
                    type: 'crypto',
                    provider: 'BitPay',
                    isActive: true,
                    description: 'Accept Bitcoin and other cryptocurrencies',
                    apiKey: 'btc_live_***************',
                    webhookUrl: 'https://api.example.com/crypto/webhook',
                    supportedCurrencies: ['BTC', 'ETH', 'LTC'],
                    processingFee: 1.0,
                    createdAt: '2024-05-12',
                    lastUsed: '2024-07-17'
                }
            ];
            setPaymentMethods(mockData);
            setLoading(false);
        }, 1000);
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

    const handleAdd = () => {
        setEditingMethod(null);
        setModalVisible(true);
        form.resetFields();
    };

    const handleEdit = (record) => {
        setEditingMethod(record);
        setModalVisible(true);
        form.setFieldsValue({
            ...record,
            supportedCurrencies: record.supportedCurrencies.join(',')
        });
    };

    const handleDelete = (id) => {
        setPaymentMethods(prev => prev.filter(item => item.id !== id));
        message.success('Payment method deleted successfully');
    };

    const handleView = (record) => {
        setViewingMethod(record);
        setViewModalVisible(true);
    };

    const handleSubmit = async (values) => {
        try {
            const supportedCurrencies = values.supportedCurrencies.split(',').map(c => c.trim());
            const methodData = {
                ...values,
                supportedCurrencies,
                id: editingMethod ? editingMethod.id : Date.now(),
                createdAt: editingMethod ? editingMethod.createdAt : new Date().toISOString().split('T')[0],
                lastUsed: editingMethod ? editingMethod.lastUsed : null
            };

            if (editingMethod) {
                setPaymentMethods(prev =>
                    prev.map(item => item.id === editingMethod.id ? methodData : item)
                );
                message.success('Payment method updated successfully');
            } else {
                setPaymentMethods(prev => [...prev, methodData]);
                message.success('Payment method added successfully');
            }

            setModalVisible(false);
            form.resetFields();
        } catch (error) {
            message.error('Error saving payment method');
        }
    };

    const toggleStatus = (id, currentStatus) => {
        setPaymentMethods(prev =>
            prev.map(item =>
                item.id === id ? { ...item, isActive: !currentStatus } : item
            )
        );
        message.success(`Payment method ${!currentStatus ? 'activated' : 'deactivated'}`);
    };

    const filteredData = paymentMethods.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchText.toLowerCase()) ||
            item.provider.toLowerCase().includes(searchText.toLowerCase());
        const matchesStatus = filterStatus === 'all' ||
            (filterStatus === 'active' && item.isActive) ||
            (filterStatus === 'inactive' && !item.isActive);
        const matchesType = filterType === 'all' || item.type === filterType;

        return matchesSearch && matchesStatus && matchesType;
    });

    const columns = [
        {
            title: 'Payment Method',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Avatar
                        icon={getTypeIcon(record.type)}
                        style={{
                            backgroundColor: getTypeColor(record.type),
                            color: 'white'
                        }}
                    />
                    <div>
                        <div style={{ fontWeight: 600, marginBottom: '2px' }}>{text}</div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>{record.provider}</Text>
                    </div>
                </div>
            ),
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (type) => (
                <Tag color={getTypeColor(type)} style={{ textTransform: 'capitalize' }}>
                    {type}
                </Tag>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'isActive',
            key: 'status',
            render: (isActive, record) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Badge
                        status={isActive ? 'success' : 'default'}
                        text={isActive ? 'Active' : 'Inactive'}
                    />
                    <Switch
                        size="small"
                        checked={isActive}
                        onChange={() => toggleStatus(record.id, isActive)}
                    />
                </div>
            ),
        },
        {
            title: 'Processing Fee',
            dataIndex: 'processingFee',
            key: 'processingFee',
            render: (fee) => (
                <Text style={{ fontWeight: 600 }}>
                    {fee === 0 ? 'Free' : `${fee}%`}
                </Text>
            ),
        },
        {
            title: 'Currencies',
            dataIndex: 'supportedCurrencies',
            key: 'currencies',
            render: (currencies) => (
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {currencies.slice(0, 2).map(currency => (
                        <Tag key={currency} size="small">{currency}</Tag>
                    ))}
                    {currencies.length > 2 && (
                        <Tag size="small">+{currencies.length - 2}</Tag>
                    )}
                </div>
            ),
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
                            onClick={() => handleView(record)}
                            style={{ color: '#667eea' }}
                        />
                    </Tooltip>
                    <Tooltip title="Edit">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record)}
                            style={{ color: '#52c41a' }}
                        />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Popconfirm
                            title="Are you sure you want to delete this payment method?"
                            onConfirm={() => handleDelete(record.id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                type="text"
                                icon={<DeleteOutlined />}
                                style={{ color: '#ff4d4f' }}
                            />
                        </Popconfirm>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ background: 'transparent' }}>
            {/* Header Section */}
            <div
                style={{
                    marginBottom: '16px'
                }}
            >
                <h3 style={{ margin: 0, color: '#667eea' }}>
                    Payment Methods
                </h3>
                <p style={{ margin: '4px 0 0 0', color: '#64748b' }}>
                    Manage your payment gateways and processing methods
                </p>
            </div>

            {/* Stats Cards */}
            <Row gutter={16} style={{ marginBottom: '24px' }}>
                <Col span={6}>
                    <Card size="small">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <Text type="secondary">Total Methods</Text>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea' }}>
                                    {paymentMethods.length}
                                </div>
                            </div>
                            <Avatar icon={<CreditCardOutlined />} style={{ backgroundColor: '#667eea' }} />
                        </div>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <Text type="secondary">Active</Text>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                                    {paymentMethods.filter(m => m.isActive).length}
                                </div>
                            </div>
                            <Avatar icon={<CheckCircleOutlined />} style={{ backgroundColor: '#52c41a' }} />
                        </div>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <Text type="secondary">Inactive</Text>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff4d4f' }}>
                                    {paymentMethods.filter(m => !m.isActive).length}
                                </div>
                            </div>
                            <Avatar icon={<CloseCircleOutlined />} style={{ backgroundColor: '#ff4d4f' }} />
                        </div>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <Text type="secondary">Avg Fee</Text>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#faad14' }}>
                                    {(paymentMethods.reduce((acc, m) => acc + m.processingFee, 0) / paymentMethods.length).toFixed(1)}%
                                </div>
                            </div>
                            <Avatar icon={<DollarOutlined />} style={{ backgroundColor: '#faad14' }} />
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Main Content Card */}
            <Card>
                {/* Toolbar */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px'
                }}>
                    <Space>
                        <Input
                            placeholder="Search payment methods..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{ width: 250 }}
                        />
                        <Select
                            placeholder="Status"
                            value={filterStatus}
                            onChange={setFilterStatus}
                            style={{ width: 120 }}
                        >
                            <Option value="all">All Status</Option>
                            <Option value="active">Active</Option>
                            <Option value="inactive">Inactive</Option>
                        </Select>
                        <Select
                            placeholder="Type"
                            value={filterType}
                            onChange={setFilterType}
                            style={{ width: 120 }}
                        >
                            <Option value="all">All Types</Option>
                            <Option value="card">Card</Option>
                            <Option value="bank">Bank</Option>
                            <Option value="wallet">Wallet</Option>
                            <Option value="crypto">Crypto</Option>
                        </Select>
                    </Space>

                    <Space>
                        <Button
                            icon={<ReloadOutlined />}
                            onClick={loadPaymentMethods}
                            loading={loading}
                        >
                            Refresh
                        </Button>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={handleAdd}
                            style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                border: 'none'
                            }}
                        >
                            Add Payment Method
                        </Button>
                    </Space>
                </div>

                {/* Table */}
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    loading={loading}
                    rowKey="id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} payment methods`,
                    }}
                />
            </Card>

            {/* Add/Edit Modal */}
            <Modal
                title={editingMethod ? 'Edit Payment Method' : 'Add Payment Method'}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                width={600}
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
                                name="name"
                                label="Payment Method Name"
                                rules={[{ required: true, message: 'Please enter payment method name' }]}
                            >
                                <Input placeholder="e.g., Credit Card, PayPal" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="provider"
                                label="Provider"
                                rules={[{ required: true, message: 'Please enter provider name' }]}
                            >
                                <Input placeholder="e.g., Stripe, PayPal, Square" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="type"
                                label="Payment Type"
                                rules={[{ required: true, message: 'Please select payment type' }]}
                            >
                                <Select placeholder="Select payment type">
                                    <Option value="card">Credit/Debit Card</Option>
                                    <Option value="bank">Bank Transfer</Option>
                                    <Option value="wallet">Digital Wallet</Option>
                                    <Option value="crypto">Cryptocurrency</Option>
                                    <Option value="qr">QR Code</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="processingFee"
                                label="Processing Fee (%)"
                                rules={[{ required: true, message: 'Please enter processing fee' }]}
                            >
                                <Input type="number" min="0" max="100" step="0.1" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[{ required: true, message: 'Please enter description' }]}
                    >
                        <TextArea rows={3} placeholder="Brief description of the payment method" />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="apiKey"
                                label="API Key / Identifier"
                            >
                                <Input.Password placeholder="API key or merchant identifier" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="supportedCurrencies"
                                label="Supported Currencies"
                                rules={[{ required: true, message: 'Please enter supported currencies' }]}
                            >
                                <Input placeholder="USD,EUR,GBP (comma separated)" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="webhookUrl"
                        label="Webhook URL"
                    >
                        <Input placeholder="https://api.example.com/webhook" />
                    </Form.Item>

                    <Form.Item
                        name="isActive"
                        label="Status"
                        valuePropName="checked"
                        initialValue={true}
                    >
                        <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                    </Form.Item>

                    <Divider />

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                        <Button onClick={() => setModalVisible(false)}>
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                border: 'none'
                            }}
                        >
                            {editingMethod ? 'Update' : 'Create'}
                        </Button>
                    </div>
                </Form>
            </Modal>

            {/* View Details Modal */}
            <Modal
                title="Payment Method Details"
                open={viewModalVisible}
                onCancel={() => setViewModalVisible(false)}
                width={600}
                footer={[
                    <Button key="close" onClick={() => setViewModalVisible(false)}>
                        Close
                    </Button>
                ]}
            >
                {viewingMethod && (
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
                                        icon={getTypeIcon(viewingMethod.type)}
                                        style={{
                                            backgroundColor: getTypeColor(viewingMethod.type),
                                            color: 'white'
                                        }}
                                    />
                                    <div>
                                        <Title level={4} style={{ margin: 0 }}>{viewingMethod.name}</Title>
                                        <Text type="secondary">{viewingMethod.provider}</Text>
                                        <div>
                                            <Tag color={getTypeColor(viewingMethod.type)} style={{ marginTop: '4px' }}>
                                                {viewingMethod.type}
                                            </Tag>
                                            <Badge
                                                status={viewingMethod.isActive ? 'success' : 'default'}
                                                text={viewingMethod.isActive ? 'Active' : 'Inactive'}
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
                                        {viewingMethod.processingFee === 0 ? 'Free' : `${viewingMethod.processingFee}%`}
                                    </div>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div style={{ marginBottom: '16px' }}>
                                    <Text strong>Created Date</Text>
                                    <div>{viewingMethod.createdAt}</div>
                                </div>
                            </Col>
                        </Row>

                        <div style={{ marginBottom: '16px' }}>
                            <Text strong>Description</Text>
                            <div style={{ marginTop: '4px' }}>{viewingMethod.description}</div>
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <Text strong>Supported Currencies</Text>
                            <div style={{ marginTop: '8px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                {viewingMethod.supportedCurrencies.map(currency => (
                                    <Tag key={currency}>{currency}</Tag>
                                ))}
                            </div>
                        </div>

                        {viewingMethod.apiKey && (
                            <div style={{ marginBottom: '16px' }}>
                                <Text strong>API Key</Text>
                                <div style={{
                                    marginTop: '4px',
                                    fontFamily: 'monospace',
                                    background: 'rgba(0,0,0,0.05)',
                                    padding: '8px',
                                    borderRadius: '4px'
                                }}>
                                    {viewingMethod.apiKey}
                                </div>
                            </div>
                        )}

                        {viewingMethod.webhookUrl && (
                            <div style={{ marginBottom: '16px' }}>
                                <Text strong>Webhook URL</Text>
                                <div style={{ marginTop: '4px' }}>{viewingMethod.webhookUrl}</div>
                            </div>
                        )}

                        {viewingMethod.lastUsed && (
                            <div>
                                <Text strong>Last Used</Text>
                                <div>{viewingMethod.lastUsed}</div>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default PaymentMethodPage;