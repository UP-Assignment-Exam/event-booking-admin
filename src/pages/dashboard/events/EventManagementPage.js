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
    Badge,
    Progress,
    DatePicker,
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    SearchOutlined,
    ReloadOutlined,
    CalendarOutlined,
    TeamOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    DollarOutlined,
    // TicketOutlined,
    BankOutlined,
    AppstoreOutlined,
    ShoppingCartOutlined,
    FireOutlined,
} from '@ant-design/icons';
import { debounce } from 'lodash';
import dayjs from 'dayjs';
import ViewEventModal from './components/modals/ViewEventModal';
import ToggleEventModal from './components/modals/ToggleEventModal';
import httpClient from '../../../utils/HttpClient';
import { DELETE_EVENTS_URL, EVENTS_STATIC_URL, EVENTS_URL, GET_ALL_CATEGORIES_URL, GET_ALL_ORGANIZATIONS_URL, GET_ALL_TICKET_TYPES_URL, UPDATE_EVENTS_PURCHASE_URL, UPDATE_EVENTS_STATUS_URL } from '../../../constants/Url';
import { objectToQuery } from '../../../utils/Utils';

const { Text, Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

// Mock data for demonstration
const mockEvents = [
    {
        _id: '1',
        title: 'Summer Music Festival 2024',
        description: 'Join us for the biggest music festival of the year featuring top artists from around the world.',
        organization: { _id: 'org1', name: 'Entertainment Plus' },
        createdBy: { _id: 'user1', firstName: 'John', lastName: 'Doe' },
        category: { _id: 'cat1', name: 'Music & Concert' },
        ticketTypes: [
            { ticketTypeId: { _id: 'tt1', name: 'General Admission' }, price: 50, quantity: 1000, soldQuantity: 750 },
            { ticketTypeId: { _id: 'tt2', name: 'VIP' }, price: 150, quantity: 200, soldQuantity: 180 },
        ],
        isPurchasable: true,
        disabledPurchase: { unit: 'hour', value: 2 },
        startDate: '2024-08-15T18:00:00Z',
        endDate: '2024-08-17T23:00:00Z',
        isDeleted: false,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-02-01T14:30:00Z',
    },
    {
        _id: '2',
        title: 'Tech Conference 2024',
        description: 'Annual technology conference featuring latest innovations and industry leaders.',
        organization: { _id: 'org2', name: 'Tech Solutions' },
        createdBy: { _id: 'user2', firstName: 'Jane', lastName: 'Smith' },
        category: { _id: 'cat2', name: 'Technology' },
        ticketTypes: [
            { ticketTypeId: { _id: 'tt3', name: 'Early Bird' }, price: 200, quantity: 500, soldQuantity: 450 },
            { ticketTypeId: { _id: 'tt4', name: 'Regular' }, price: 300, quantity: 300, soldQuantity: 120 },
        ],
        isPurchasable: false,
        disabledPurchase: { unit: 'day', value: 1 },
        startDate: '2024-09-20T09:00:00Z',
        endDate: '2024-09-21T17:00:00Z',
        isDeleted: false,
        createdAt: '2024-02-10T08:00:00Z',
        updatedAt: '2024-02-15T16:45:00Z',
    },
];


const EventManagementPage = () => {
    const defaultStatic = useMemo(() => ({
        total: 0,
        active: 0,
        // inactive: 0,
        purchasable: 0,
        // nonPurchasable: 0,
        totalRevenue: 0,
        totalTicketsSold: 0,
        hotEvents: 0,
    }), []);

    const [events, setEvents] = useState(mockEvents);
    const defaultFilter = useMemo(() => ({
        pageNo: 1,
        pageSize: 10,
        isDeleted: "false",
        isPurchasable: "all",
        category: "all",
        organization: "all",
        keyword: "",
        dateRange: null,
    }), []);

    const [statistic, setStatistic] = useState(defaultStatic);
    const [filter, setFilter] = useState(defaultFilter);
    const [total, setTotal] = useState(2);
    const [loading, setLoading] = useState({
        list: false,
        static: false,
    });
    const [categories, setCategories] = useState([]);
    const [organizations, setOrganizations] = useState([]);
    const [ticketTypes, setTicketTypes] = useState([]);

    const viewEventModalRef = useRef(null);
    const toggleEventModalRef = useRef(null);

    // Fetch roles and organizations for filters
    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const [categoriesRes, orgsRes, ticketTypesRes] = await Promise.all([
                    httpClient.get(GET_ALL_CATEGORIES_URL).then(res => res.data),
                    httpClient.get(GET_ALL_ORGANIZATIONS_URL).then(res => res.data),
                    httpClient.get(GET_ALL_TICKET_TYPES_URL).then(res => res.data)
                ]);

                if (ticketTypesRes.status === 200) setTicketTypes(ticketTypesRes.data);
                if (categoriesRes.status === 200) setCategories(categoriesRes.data);
                if (orgsRes.status === 200) setOrganizations(orgsRes.data);
            } catch (error) {
                console.error('Failed to fetch dropdown data:', error);
            }
        };

        fetchDropdownData();
    }, []);

    const fetchStatic = useCallback(async () => {
        try {
            setLoading(pre => ({ ...pre, static: true }));
            // Mock API call
            const res = await httpClient.get(EVENTS_STATIC_URL).then(res => res.data)

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

    const fetchData = useCallback(async (parseQuery) => {
        try {
            setLoading(pre => ({ ...pre, list: true }));
            // Mock API call
            const res = await httpClient.get(objectToQuery(EVENTS_URL, parseQuery ?? filter)).then(res => res.data)

            if (res.status === 200) {
                setEvents([...res.data]);
                setTotal(res.total)
            } else {
                setEvents([]);
                setTotal(0);
            }
        } catch (error) {
            setEvents([]);
            setTotal(0);
        } finally {
            setLoading(pre => ({ ...pre, list: false }));
        }
    }, [filter]);

    const debounceFetchData = useCallback(debounce(fetchData, 300), [fetchData]);

    useEffect(() => {
        debounceFetchData();
        return debounceFetchData.cancel;
    }, [debounceFetchData]);

    const handleAdd = () => {
        toggleEventModalRef.current?.openModal({}, "create");
        // message.info('Create Event Modal would open here');
    };

    const handleEdit = (record) => {
        // message.info('Edit Event Modal would open here');
        toggleEventModalRef.current?.openModal(record, "edit");
    };

    const handleView = (record) => {
        viewEventModalRef?.current?.openModal(record);
        // message.info('View Event Modal would open here');
    };

    const toggleEventStatus = async (id, currentStatus) => {
        try {
            setLoading(pre => ({ ...pre, list: true, static: true }));

            const payload = { isPurchasable: !currentStatus };
            // Mock API call
            const res = await httpClient.put(UPDATE_EVENTS_PURCHASE_URL.replace(":id", id), payload).then(res => res.data)

            if (res.status === 200) {
                await Promise.all([
                    debounceFetchData(),
                    debounceFetchStatic()
                ])
                message.success(`Event ${!currentStatus ? 'enabled' : 'disabled'} for purchase`);
            } else {
                setLoading(pre => ({ ...pre, list: false, static: false }));
                message.error(res.message);
            }
        } catch (error) {
            setLoading(pre => ({ ...pre, list: false, static: false }));
            message.error("Failed to update event status");
        }
    };

    const handleDelete = async (id) => {
        try {
            setLoading(pre => ({ ...pre, static: true, list: true }));

            // Mock API call
            const res = await httpClient.delete(DELETE_EVENTS_URL.replace(":id", id)).then(res => res.data)

            if (res.status === 200) {
                await Promise.all([
                    debounceFetchData(),
                    debounceFetchStatic()
                ])
                message.success('Event deleted successfully');
            } else {
                setLoading(pre => ({ ...pre, static: false, list: false }));
                message.error(res.message);
            }
        } catch (error) {
            setLoading(pre => ({ ...pre, static: false, list: false }));
            message.error("Failed to delete event");
        }
    };

    const calculateTotalTickets = (ticketTypes) => {
        return ticketTypes.reduce((total, ticket) => total + ticket.quantity, 0);
    };

    const calculateSoldTickets = (ticketTypes) => {
        return ticketTypes.reduce((total, ticket) => total + ticket.soldQuantity, 0);
    };

    const calculateRevenue = (ticketTypes) => {
        return ticketTypes.reduce((total, ticket) => total + (ticket.price * ticket.soldQuantity), 0);
    };

    const getEventStatus = (startDate, endDate) => {
        const now = dayjs();
        const start = dayjs(startDate);
        const end = dayjs(endDate);

        if (now.isBefore(start)) return { status: 'upcoming', color: '#1890ff', text: 'Upcoming' };
        if (now.isAfter(end)) return { status: 'ended', color: '#8c8c8c', text: 'Ended' };
        return { status: 'live', color: '#52c41a', text: 'Live' };
    };

    const columns = [
        {
            title: 'Event',
            dataIndex: 'title',
            key: 'event',
            render: (text, record) => {
                const eventStatus = getEventStatus(record.startDate, record.endDate);
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Avatar
                            icon={<CalendarOutlined />}
                            style={{
                                backgroundColor: '#667eea',
                                color: 'white'
                            }}
                        />
                        <div>
                            <div style={{ fontWeight: 600, marginBottom: '2px' }}>
                                {text}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Badge
                                    status={eventStatus.status === 'live' ? 'processing' : 'default'}
                                    color={eventStatus.color}
                                    text={<Text style={{ fontSize: '12px', color: eventStatus.color }}>{eventStatus.text}</Text>}
                                />
                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                    {dayjs(record.startDate).format('MMM DD, YYYY')}
                                </Text>
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            title: 'Organization',
            dataIndex: 'organization',
            key: 'organization',
            render: (organization) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <BankOutlined style={{ fontSize: '12px', color: '#64748b' }} />
                    <Text style={{ fontSize: '12px' }}>{organization?.name}</Text>
                </div>
            ),
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            render: (category) => (
                <Tag color="#667eea" icon={<AppstoreOutlined />}>
                    {category?.title}
                </Tag>
            ),
        },
        {
            title: 'Tickets',
            key: 'tickets',
            render: (_, record) => {
                const totalTickets = calculateTotalTickets(record.ticketTypes);
                const soldTickets = calculateSoldTickets(record.ticketTypes);
                const percentage = totalTickets > 0 ? (soldTickets / totalTickets) * 100 : 0;

                return (
                    <div style={{ minWidth: '120px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <Text style={{ fontSize: '12px' }}>
                                {soldTickets.toLocaleString()} / {totalTickets.toLocaleString()}
                            </Text>
                            <Text style={{ fontSize: '12px', color: '#52c41a' }}>
                                {percentage.toFixed(1)}%
                            </Text>
                        </div>
                        <Progress
                            percent={percentage}
                            size="small"
                            showInfo={false}
                            strokeColor={{
                                '0%': '#667eea',
                                '100%': '#764ba2',
                            }}
                        />
                    </div>
                );
            },
        },
        {
            title: 'Revenue',
            key: 'revenue',
            render: (_, record) => {
                const revenue = calculateRevenue(record.ticketTypes);
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <DollarOutlined style={{ fontSize: '12px', color: '#52c41a' }} />
                        <Text style={{ fontSize: '14px', fontWeight: 600, color: '#52c41a' }}>
                            ${revenue.toLocaleString()}
                        </Text>
                    </div>
                );
            },
        },
        {
            title: 'Purchase',
            dataIndex: 'isPurchasable',
            key: 'purchasable',
            render: (isPurchasable, record) => (
                <Switch
                    checked={isPurchasable}
                    onChange={() => toggleEventStatus(record._id, isPurchasable)}
                    checkedChildren="Enabled"
                    unCheckedChildren="Disabled"
                    style={{
                        backgroundColor: isPurchasable ? '#52c41a' : undefined
                    }}
                />
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
                            title="Are you sure you want to delete this event?"
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
            <div style={{ marginBottom: '16px' }}>
                <Title level={3} style={{ margin: 0, color: '#667eea' }}>
                    Event Management
                </Title>
                <Text style={{ color: '#64748b' }}>
                    Manage events, tickets, and sales performance
                </Text>
            </div>

            {/* Stats Cards */}
            <Row gutter={16} style={{ marginBottom: '24px' }}>
                <Col span={4}>
                    <Spin spinning={loading.static}>
                        <Card size="small">
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <Text type="secondary">Total Events</Text>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea' }}>
                                        {statistic.total}
                                    </div>
                                </div>
                                <Avatar icon={<CalendarOutlined />} style={{ backgroundColor: '#667eea' }} />
                            </div>
                        </Card>
                    </Spin>
                </Col>
                <Col span={4}>
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
                <Col span={4}>
                    <Spin spinning={loading.static}>
                        <Card size="small">
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <Text type="secondary">Purchasable</Text>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                                        {statistic.purchasable}
                                    </div>
                                </div>
                                <Avatar icon={<ShoppingCartOutlined />} style={{ backgroundColor: '#1890ff' }} />
                            </div>
                        </Card>
                    </Spin>
                </Col>
                <Col span={4}>
                    <Spin spinning={loading.static}>
                        <Card size="small">
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <Text type="secondary">Tickets Sold</Text>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#faad14' }}>
                                        {statistic.totalTicketsSold.toLocaleString()}
                                    </div>
                                </div>
                                {/* <Avatar icon={<TicketOutlined />} style={{ backgroundColor: '#faad14' }} /> */}
                            </div>
                        </Card>
                    </Spin>
                </Col>
                <Col span={4}>
                    <Spin spinning={loading.static}>
                        <Card size="small">
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <Text type="secondary">Revenue</Text>
                                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#52c41a' }}>
                                        ${(statistic.totalRevenue / 1000).toFixed(0)}K
                                    </div>
                                </div>
                                <Avatar icon={<DollarOutlined />} style={{ backgroundColor: '#52c41a' }} />
                            </div>
                        </Card>
                    </Spin>
                </Col>
                <Col span={4}>
                    <Spin spinning={loading.static}>
                        <Card size="small">
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <Text type="secondary">Hot Events</Text>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff4d4f' }}>
                                        {statistic.hotEvents}
                                    </div>
                                </div>
                                <Avatar icon={<FireOutlined />} style={{ backgroundColor: '#ff4d4f' }} />
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
                    <Space wrap>
                        <Input
                            placeholder="Search events..."
                            prefix={<SearchOutlined />}
                            value={filter.keyword}
                            onChange={(e) => setFilter(pre => ({ ...pre, keyword: e.target.value }))}
                            style={{ width: 250 }}
                        />
                        <Select
                            placeholder="Purchase Status"
                            value={filter.isPurchasable}
                            onChange={(value) => setFilter(pre => ({ ...pre, isPurchasable: value }))}
                            style={{ width: 140 }}
                        >
                            <Option value="all">All Status</Option>
                            <Option value="true">Purchasable</Option>
                            <Option value="false">Not Purchasable</Option>
                        </Select>
                        <Select
                            placeholder="Category"
                            value={filter.category}
                            onChange={(value) => setFilter(pre => ({ ...pre, category: value }))}
                            style={{ width: 140 }}
                        >
                            <Option value="all">All Categories</Option>
                            {categories.map(category => (
                                <Option key={category._id} value={category._id}>{category.title}</Option>
                            ))}
                        </Select>
                        <Select
                            placeholder="Organization"
                            value={filter.organization}
                            onChange={(value) => setFilter(pre => ({ ...pre, organization: value }))}
                            style={{ width: 140 }}
                        >
                            <Option value="all">All Organizations</Option>
                            {organizations.map(org => (
                                <Option key={org._id} value={org._id}>{org.name}</Option>
                            ))}
                        </Select>
                        <RangePicker
                            placeholder={['Start Date', 'End Date']}
                            value={filter.dateRange}
                            onChange={(dates) => setFilter(pre => ({ ...pre, dateRange: dates }))}
                            style={{ width: 240 }}
                        />
                    </Space>

                    <Space>
                        <Button
                            icon={<ReloadOutlined />}
                            onClick={async () => {
                                setFilter(defaultFilter);
                                await Promise.all([
                                    debounceFetchData(defaultFilter),
                                    debounceFetchStatic(),
                                ]);
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
                            Create Event
                        </Button>
                    </Space>
                </div>

                {/* Table */}
                <Table
                    columns={columns}
                    dataSource={events}
                    loading={loading.list}
                    rowKey="_id"
                    pagination={{
                        pageSize: filter.pageSize,
                        current: filter.pageNo,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        total: total,
                        onChange: (page, pageSize) => {
                            setFilter(pre => {
                                debounceFetchData({ ...pre, pageNo: page, pageSize });
                                return { ...pre, pageNo: page, pageSize };
                            });
                        },
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} events`,
                    }}
                />
            </Card>

            <ViewEventModal
                ref={viewEventModalRef}
            />

            <ToggleEventModal
                ref={toggleEventModalRef}
                organizations={organizations}
                categories={categories}
                ticketTypes={ticketTypes}
                fetchData={async () => {
                    await Promise.all([
                        debounceFetchData(),
                        debounceFetchStatic()
                    ])
                }}
            />
        </div>
    );
};

export default EventManagementPage;