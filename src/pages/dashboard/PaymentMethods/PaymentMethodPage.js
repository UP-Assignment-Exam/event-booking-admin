import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
    Card,
    Table,
    Button,
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
    Avatar,
    Typography,
    Spin,
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    SearchOutlined,
    ReloadOutlined,
    CreditCardOutlined,
    BankOutlined,
    WalletOutlined,
    QrcodeOutlined,
    DollarOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined
} from '@ant-design/icons';
import TogglePaymentMethodModal from './components/modals/TogglePaymentMethodModal';
import ViewPaymentMethodModal from './components/modals/ViewPaymentMethodModal';
import { debounce } from 'lodash';
import httpClient from '../../../utils/HttpClient';
import { objectToQuery } from '../../../utils/Utils';
import { DELETE_PAYMENT_METHODS_URL, PAYMENT_METHODS_STATIC_URL, PAYMENT_METHODS_URL, UPDATE_STATUS_PAYMENT_METHODS_URL } from '../../../constants/Url';

const { Text } = Typography;
const { Option } = Select;

const PaymentMethodPage = () => {
    const defaultStatic = useMemo(() => {
        return {
            total: 0,
            active: 0,
            inactive: 0,
            avgFee: 0
        }
    }, [])
    const [paymentMethods, setPaymentMethods] = useState([]);
    const defaultFilter = useMemo(() => {
        return {
            pageNo: 1,
            pageSize: 10,
            status: "all",
            type: "all",
            keyword: ""
        }
    }, [])
    const [statistic, setStatistic] = useState(defaultStatic);
    // const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState(defaultFilter)
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState({
        list: true,
        static: true,
    });
    const viewPaymentMethodModalRef = useRef(null);
    const togglePaymentMethodModalRef = useRef(null);

    // Mock data
    // useEffect(() => {
    //     loadPaymentMethods();
    // }, []);

    // const loadPaymentMethods = () => {
    //     setLoading(true);
    //     // Simulate API call
    //     setTimeout(() => {
    //         const mockData = [
    //             {
    //                 id: 1,
    //                 name: 'Credit Card',
    //                 type: 'card',
    //                 provider: 'Stripe',
    //                 isActive: true,
    //                 description: 'Accept all major credit cards including Visa, MasterCard, American Express',
    //                 apiKey: 'sk_test_***************',
    //                 webhookUrl: 'https://api.example.com/stripe/webhook',
    //                 supportedCurrencies: ['USD', 'EUR', 'GBP'],
    //                 processingFee: 2.9,
    //                 createdAt: '2024-01-15',
    //                 lastUsed: '2024-07-19'
    //             },
    //             {
    //                 id: 2,
    //                 name: 'PayPal',
    //                 type: 'wallet',
    //                 provider: 'PayPal',
    //                 isActive: true,
    //                 description: 'PayPal payment gateway for secure online transactions',
    //                 apiKey: 'AQkquBDf***************',
    //                 webhookUrl: 'https://api.example.com/paypal/webhook',
    //                 supportedCurrencies: ['USD', 'EUR', 'CAD'],
    //                 processingFee: 3.5,
    //                 createdAt: '2024-02-10',
    //                 lastUsed: '2024-07-18'
    //             },
    //             {
    //                 id: 3,
    //                 name: 'Bank Transfer',
    //                 type: 'bank',
    //                 provider: 'Manual',
    //                 isActive: false,
    //                 description: 'Direct bank transfer for large transactions',
    //                 apiKey: null,
    //                 webhookUrl: null,
    //                 supportedCurrencies: ['USD', 'EUR'],
    //                 processingFee: 0,
    //                 createdAt: '2024-03-05',
    //                 lastUsed: '2024-07-10'
    //             },
    //             {
    //                 id: 4,
    //                 name: 'Apple Pay',
    //                 type: 'wallet',
    //                 provider: 'Apple',
    //                 isActive: true,
    //                 description: 'Apple Pay integration for iOS devices',
    //                 apiKey: 'merchant.com.example',
    //                 webhookUrl: 'https://api.example.com/applepay/webhook',
    //                 supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD'],
    //                 processingFee: 2.9,
    //                 createdAt: '2024-04-20',
    //                 lastUsed: '2024-07-19'
    //             },
    //             {
    //                 id: 5,
    //                 name: 'Cryptocurrency',
    //                 type: 'crypto',
    //                 provider: 'BitPay',
    //                 isActive: true,
    //                 description: 'Accept Bitcoin and other cryptocurrencies',
    //                 apiKey: 'btc_live_***************',
    //                 webhookUrl: 'https://api.example.com/crypto/webhook',
    //                 supportedCurrencies: ['BTC', 'ETH', 'LTC'],
    //                 processingFee: 1.0,
    //                 createdAt: '2024-05-12',
    //                 lastUsed: '2024-07-17'
    //             }
    //         ];
    //         setPaymentMethods(mockData);
    //         setLoading(false);
    //     }, 1000);
    // };

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
        togglePaymentMethodModalRef.current?.openModal({}, "create");
    };

    const handleEdit = (record) => {
        togglePaymentMethodModalRef.current?.openModal(record, "edit");
    };

    const handleView = (record) => {
        viewPaymentMethodModalRef?.current?.openModal(record)
    };

    const fetchStatic = useCallback(async (parseQuery) => {
        try {
            setLoading(pre => ({ ...pre, static: true }));

            const res = await httpClient.get(PAYMENT_METHODS_STATIC_URL).then((res) => res.data);

            if (res.status === 200) {
                setStatistic({ ...res.data });
            } else {
                setStatistic({ ...defaultStatic });
            }
        } catch (error) {
            setStatistic({ ...defaultStatic });
        } finally {
            setLoading(pre => ({ ...pre, static: false }));
        }
    }, []);

    const debounceFetchStatic = useCallback(debounce(fetchStatic, 300), [fetchStatic]);

    useEffect(() => {
        debounceFetchStatic()

        return debounceFetchStatic.cancel;
    }, [debounceFetchStatic]);

    const toggleStatus = async (id, currentStatus) => {
        try {
            setLoading(pre => ({ ...pre, list: true }));

            const payload = {
                isActive: !currentStatus,
            }

            const res = await httpClient.put(UPDATE_STATUS_PAYMENT_METHODS_URL.replace(":id", id), payload).then(res => res.data)

            if (res.status === 200) {
                debounceFetchData()
                message.success(`Payment method ${!currentStatus ? 'activated' : 'deactivated'}`);
            } else {
                message.success("Failed to update status payment method");
                setLoading(pre => ({ ...pre, list: false }));
            }
        } catch (error) {
            setLoading(pre => ({ ...pre, list: false }));
            message.error("Failed to update status payment method")
        }
    };

    const fetchData = useCallback(async (parseQuery) => {
        try {
            setLoading(pre => ({ ...pre, list: true }));

            const res = await httpClient.get(objectToQuery(PAYMENT_METHODS_URL, parseQuery ?? filter)).then(res => res.data); // Simulate fetching data from API

            if (res.status === 200) {
                setPaymentMethods(res.data);
                setTotal(res.total)
            } else {
                setPaymentMethods([]);
                setTotal(0)
            }
        } catch (error) {
            setPaymentMethods([]);
            setTotal(0)
        } finally {
            setLoading(pre => ({ ...pre, list: false }));
        }
    }, [filter]);

    const handleDelete = async (id) => {
        try {
            setLoading(true);
            const res = await httpClient.delete(DELETE_PAYMENT_METHODS_URL.replace(":id", id)).then(res => res.data)

            if (res.status === 200) {
                debounceFetchData()
                message.success('Payment method deleted successfully');
            } else {
                message.success("Failed to delete payment method");
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            message.error("Failed to delete payment method")
        }
    };

    const debounceFetchData = useCallback(debounce(fetchData, 300), [fetchData])

    useEffect(() => {
        debounceFetchData()

        return debounceFetchData.cancel
    }, [debounceFetchData])

    const columns = [
        {
            title: 'Payment Method',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Avatar
                        src={record.imageUrl || undefined}
                        icon={!record.imageUrl ? getTypeIcon(record.type) : undefined}
                        style={{
                            backgroundColor: record.imageUrl ? undefined : getTypeColor(record.type),
                            color: record.imageUrl ? undefined : 'white'
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
                <Switch
                    checked={isActive}
                    onChange={() => toggleStatus(record._id, isActive)}
                    checkedChildren="Active"
                    unCheckedChildren="Inactive"
                    style={{
                        backgroundColor: isActive ? '#52c41a' : undefined
                    }}
                />
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
                            onConfirm={() => handleDelete(record._id)}
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
                    <Spin spinning={loading.static}>
                        <Card size="small">
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <Text type="secondary">Total Methods</Text>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea' }}>
                                        {statistic.total}
                                    </div>
                                </div>
                                <Avatar icon={<CreditCardOutlined />} style={{ backgroundColor: '#667eea' }} />
                            </div>
                        </Card>
                    </Spin>
                </Col>
                <Col span={6}>
                    <Spin spinning={loading.static}>
                        <Card size="small">
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <Text type="secondary">Active</Text>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                                        {statistic.active}
                                    </div>
                                </div>
                                <Avatar icon={<CheckCircleOutlined />} style={{ backgroundColor: '#52c41a' }} />
                            </div>
                        </Card>
                    </Spin>
                </Col>
                <Col span={6}>
                    <Spin spinning={loading.static}>
                        <Card size="small">
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <Text type="secondary">Inactive</Text>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff4d4f' }}>
                                        {statistic.inactive}
                                    </div>
                                </div>
                                <Avatar icon={<CloseCircleOutlined />} style={{ backgroundColor: '#ff4d4f' }} />
                            </div>
                        </Card>
                    </Spin>
                </Col>
                <Col span={6}>
                    <Spin spinning={loading.static}>
                        <Card size="small">
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <Text type="secondary">Avg Fee</Text>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#faad14' }}>
                                        {statistic.avgFee}%
                                    </div>
                                </div>
                                <Avatar icon={<DollarOutlined />} style={{ backgroundColor: '#faad14' }} />
                            </div>
                        </Card>
                    </Spin>
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
                            value={filter.keyword}
                            onChange={(e) => setFilter(pre => ({ ...pre, keyword: e.target.value }))}
                            style={{ width: 250 }}
                        />
                        <Select
                            placeholder="Status"
                            value={filter.status}
                            onChange={(value) => setFilter(pre => ({ ...pre, status: value }))}
                            style={{ width: 120 }}
                        >
                            <Option value="all">All Status</Option>
                            <Option value="true">Active</Option>
                            <Option value="false">Inactive</Option>
                        </Select>
                        <Select
                            placeholder="Type"
                            value={filter.type}
                            onChange={(value) => setFilter(pre => ({ ...pre, type: value }))}
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
                            onClick={async () => {
                                setFilter(defaultFilter)
                                await Promise.all([
                                    debounceFetchData(defaultFilter),
                                    debounceFetchStatic(),
                                ])
                            }}
                            loading={loading.list}
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
                    dataSource={paymentMethods}
                    loading={loading.list}
                    rowKey="_id"
                    pagination={{
                        pageSize: filter.pageSize,
                        current: filter.pageNo,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        total: total,
                        onChange: (page, pageSize) => {
                            // Fetch data for the selected page
                            setFilter(pre => {
                                debounceFetchData({ ...pre, pageNo: page, pageSize });
                                return ({ ...pre, pageNo: page, pageSize })
                            });
                        },
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} payment methods`,
                    }}
                />
            </Card>


            {/* View Details Modal */}
            <ViewPaymentMethodModal
                ref={viewPaymentMethodModalRef}
            />

            {/* Add/Edit Modal */}
            <TogglePaymentMethodModal
                ref={togglePaymentMethodModalRef}
                fetchData={async () => {
                    await Promise.all([
                        debounceFetchData(),
                        debounceFetchStatic(),
                    ])
                }}
            />
        </div>
    );
};

export default PaymentMethodPage;