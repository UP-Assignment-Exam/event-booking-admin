import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    Layout,
    Menu,
    Dropdown,
    Avatar,
    Badge,
    Button,
    Tooltip,
    Switch,
    Card,
    Row,
    Col,
    Table,
    Tag,
    Space,
    Statistic,
    Progress,
    Typography,
    Divider,
    Modal,
    Form,
    Input,
    Select,
    DatePicker,
    ConfigProvider,
    theme,
    Popconfirm,
    message,
    Spin
} from 'antd';
import {
    DashboardOutlined,
    CalendarOutlined,
    AppstoreOutlined,
    UserOutlined,
    BankOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    BellOutlined,
    SettingOutlined,
    LogoutOutlined,
    MoonOutlined,
    SunOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    CrownOutlined,
    SafetyOutlined,
    TrophyOutlined,
    RiseOutlined,
    TeamOutlined,
    ShoppingOutlined
} from '@ant-design/icons';
import httpClient from '../../../utils/HttpClient';
import { DASHBOARD_RECENT_EVENT_URL, DASHBOARD_STATIC_URL } from '../../../constants/Url';
import { debounce } from 'lodash';

const { Title, Text } = Typography;
const { Option } = Select;

export default function DashboardPage() {
    const defaultStatic = useMemo(() => ({
        totalEvents: 0,
        activeUsers: 0,
        totalRevenue: 0,
        ticketsSold: 0
    }), []);

    const { token } = theme.useToken(); // gets the current theme tokens
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState({
        list: true,
        static: true,
    });
    // Sample dashboard data
    const [statistic, setStatistic] = useState(defaultStatic);

    const [recentEvents, setRecentEvents] = useState([
        {
            id: 1,
            name: 'Tech Conference 2024',
            date: '2024-03-15',
            status: 'active',
            tickets: 450,
            revenue: 22500
        },
        {
            id: 2,
            name: 'Music Festival',
            date: '2024-03-20',
            status: 'planning',
            tickets: 1200,
            revenue: 48000
        },
        {
            id: 3,
            name: 'Art Exhibition',
            date: '2024-03-25',
            status: 'sold_out',
            tickets: 200,
            revenue: 8000
        }
    ]);


    const eventColumns = [
        {
            title: 'Event Name',
            dataIndex: 'title',
            key: 'title',
            render: (text) => <Text strong>{text}</Text>
        },
        {
            title: 'Date',
            dataIndex: 'startDate',
            key: 'startDate',
            render: (startDate) => new Date(startDate).toLocaleDateString()
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const colors = {
                    ACTIVE: 'green',
                    ENDED: 'red'
                };
                return <Tag color={colors[status]}>{status.replace('_', ' ').toUpperCase()}</Tag>;
            }
        },
        {
            title: 'Tickets Sold',
            dataIndex: 'totalTicketsSold',
            key: 'totalTicketsSold',
            render: (totalTicketsSold) => totalTicketsSold?.toLocaleString()
        },
        {
            title: 'Revenue',
            dataIndex: 'totalRevenue',
            key: 'totalRevenue',
            render: (totalRevenue) => `$${totalRevenue?.toLocaleString()}`
        },
    ];

    const fetchStatic = useCallback(async () => {
        try {
            setLoading(pre => ({ ...pre, static: true }));
            // Mock API call
            const res = await httpClient.get(DASHBOARD_STATIC_URL).then(res => res.data)

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
    }, [defaultStatic]);

    const debounceFetchStatic = useCallback(debounce(fetchStatic, 300), [fetchStatic]);

    useEffect(() => {
        debounceFetchStatic();
        return debounceFetchStatic.cancel;
    }, [debounceFetchStatic]);


    const fetchData = useCallback(async () => {
        try {
            setLoading(pre => ({ ...pre, list: true }));
            // Mock API call
            const res = await httpClient.get(DASHBOARD_RECENT_EVENT_URL).then(res => res.data)

            if (res.status === 200) {
                setRecentEvents([...res.data]);
            } else {
                setRecentEvents([]);
            }
        } catch (error) {
            setRecentEvents([]);
        } finally {
            setLoading(pre => ({ ...pre, list: false }));
        }
    }, []);

    const debounceFetchData = useCallback(debounce(fetchData, 300), [fetchData]);

    useEffect(() => {
        debounceFetchData();
        return debounceFetchData.cancel;
    }, [debounceFetchData]);

    return (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <Title level={2} style={{
                    margin: 0,
                }}>
                    Dashboard Overview
                </Title>
                <Text type="secondary">Welcome back! Here's what's happening with your events.</Text>
            </div>

            {/* Stats Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={12} md={6}>
                    <Spin spinning={loading.static}>
                        <Card>
                            <Statistic
                                title="Total Events"
                                value={statistic.totalEvents}
                                prefix={<CalendarOutlined style={{ color: token.colorPrimary }} />}
                                valueStyle={{ color: token.colorPrimary }}
                            />
                            <Progress
                                percent={75}
                                // strokeColor={brandColors.gradient}
                                size="small"
                                showInfo={false}
                                style={{ marginTop: '8px' }}
                            />
                        </Card>
                    </Spin>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Spin spinning={loading.static}>
                        <Card>
                            <Statistic
                                title="Active Users"
                                value={statistic.activeUsers}
                                prefix={<TeamOutlined style={{ color: token.colorSuccess }} />}
                                valueStyle={{ color: token.colorSuccess }}
                            />
                            <Progress
                                percent={85}
                                strokeColor="#52c41a"
                                size="small"
                                showInfo={false}
                                style={{ marginTop: '8px' }}
                            />
                        </Card>
                    </Spin>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Spin spinning={loading.static}>
                        <Card>
                            <Statistic
                                title="Total Revenue"
                                value={statistic.totalRevenue}
                                prefix="$"
                                suffix={<RiseOutlined style={{ color: token.colorWarning }} />}
                                valueStyle={{ color: token.colorWarning }}
                            />
                            <Progress
                                percent={90}
                                strokeColor="#faad14"
                                size="small"
                                showInfo={false}
                                style={{ marginTop: '8px' }}
                            />
                        </Card>
                    </Spin>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Spin spinning={loading.static}>
                        <Card>
                            <Statistic
                                title="Tickets Sold"
                                value={statistic.ticketsSold}
                                prefix={<TrophyOutlined style={{ color: token.colorError }} />}
                                valueStyle={{ color: token.colorError }}
                            />
                            <Progress
                                percent={65}
                                strokeColor="#ff4d4f"
                                size="small"
                                showInfo={false}
                                style={{ marginTop: '8px' }}
                            />
                        </Card>
                    </Spin>
                </Col>
            </Row>

            {/* Recent Events Table */}
            <Card
                title={
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <span>Recent Events</span>
                        {/* <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => setIsModalVisible(true)}
                            style={{
                                border: 'none'
                            }}
                        >
                            Create Event
                        </Button> */}
                    </div>
                }
            >
                <Table
                    columns={eventColumns}
                    dataSource={recentEvents}
                    rowKey="id"
                    pagination={false}
                    size="middle"
                />
            </Card>

            {/* Create Event Modal */}
            <Modal
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CalendarOutlined />
                        Create New Event
                    </div>
                }
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsModalVisible(false)}>
                        Cancel
                    </Button>,
                    <Button
                        key="create"
                        type="primary"
                        style={{
                            border: 'none'
                        }}
                    >
                        Create Event
                    </Button>
                ]}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                            Event Name *
                        </label>
                        <Input placeholder="Enter event name" />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                            Date *
                        </label>
                        <DatePicker style={{ width: '100%' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                            Category *
                        </label>
                        <Select placeholder="Select category" style={{ width: '100%' }}>
                            <Option value="conference">Conference</Option>
                            <Option value="festival">Festival</Option>
                            <Option value="exhibition">Exhibition</Option>
                        </Select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                            Description
                        </label>
                        <Input.TextArea rows={3} placeholder="Event description" />
                    </div>
                </div>
            </Modal>
        </div>
    )
}
