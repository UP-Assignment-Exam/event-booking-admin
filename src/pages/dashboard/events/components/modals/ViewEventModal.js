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
    Tooltip,
    Progress,
    Table,
    Statistic,
} from 'antd';
import {
    CalendarOutlined,
    BankOutlined,
    AppstoreOutlined,
    UserOutlined,
    DollarOutlined,
    // TicketOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    ShoppingCartOutlined,
    StopOutlined,
    FireOutlined,
    TrophyOutlined,
    EditOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

function ViewEventModal(props, ref) {
    const [open, setOpen] = useState(false);
    const [record, setRecord] = useState(null);

    const onClose = () => {
        setOpen(false);
        setRecord(null);
    };

    const getEventStatus = (startDate, endDate) => {
        const now = dayjs();
        const start = dayjs(startDate);
        const end = dayjs(endDate);

        if (now.isBefore(start)) return { status: 'upcoming', color: '#1890ff', text: 'Upcoming', icon: <ClockCircleOutlined /> };
        if (now.isAfter(end)) return { status: 'ended', color: '#8c8c8c', text: 'Ended', icon: <StopOutlined /> };
        return { status: 'live', color: '#52c41a', text: 'Live Now', icon: <FireOutlined /> };
    };

    const getPurchaseStatusColor = (isPurchasable) => {
        return isPurchasable ? '#52c41a' : '#ff4d4f';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return dayjs(dateString).format('MMM DD, YYYY HH:mm');
    };

    const calculateTotalTickets = (ticketTypes) => {
        return ticketTypes?.reduce((total, ticket) => total + ticket.quantity, 0) || 0;
    };

    const calculateSoldTickets = (ticketTypes) => {
        return ticketTypes?.reduce((total, ticket) => total + ticket.soldQuantity, 0) || 0;
    };

    const calculateRevenue = (ticketTypes) => {
        return ticketTypes?.reduce((total, ticket) => total + (ticket.price * ticket.soldQuantity), 0) || 0;
    };

    const calculateAvailableTickets = (ticketTypes) => {
        return ticketTypes?.reduce((total, ticket) => total + (ticket.quantity - ticket.soldQuantity), 0) || 0;
    };

    useImperativeHandle(ref, () => ({
        openModal: async (event) => {
            setOpen(true);
            setRecord(event);
        },
        closeModal: onClose
    }));

    const ticketColumns = [
        {
            title: 'Ticket Type',
            dataIndex: ['ticketTypeId', 'title'],
            key: 'type',
            render: (title) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {/* <TicketOutlined style={{ color: '#667eea' }} /> */}
                    <Text strong>{title}</Text>
                </div>
            ),
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (price) => (
                <Text style={{ fontSize: '14px', fontWeight: 600, color: '#52c41a' }}>
                    ${price.toLocaleString()}
                </Text>
            ),
        },
        {
            title: 'Total',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (quantity) => (
                <Text>{quantity.toLocaleString()}</Text>
            ),
        },
        {
            title: 'Sold',
            dataIndex: 'soldQuantity',
            key: 'sold',
            render: (sold) => (
                <Text style={{ color: '#faad14' }}>{sold.toLocaleString()}</Text>
            ),
        },
        {
            title: 'Available',
            key: 'available',
            render: (_, ticketRecord) => (
                <Text style={{ color: '#1890ff' }}>
                    {(ticketRecord.quantity - ticketRecord.soldQuantity).toLocaleString()}
                </Text>
            ),
        },
        {
            title: 'Sales Progress',
            key: 'progress',
            render: (_, ticketRecord) => {
                const percentage = ticketRecord.quantity > 0 ? (ticketRecord.soldQuantity / ticketRecord.quantity) * 100 : 0;
                return (
                    <div style={{ minWidth: '100px' }}>
                        <Progress 
                            percent={percentage} 
                            size="small" 
                            format={() => `${percentage.toFixed(1)}%`}
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
            render: (_, ticketRecord) => (
                <Text style={{ fontSize: '14px', fontWeight: 600, color: '#52c41a' }}>
                    ${(ticketRecord.price * ticketRecord.soldQuantity).toLocaleString()}
                </Text>
            ),
        },
    ];

    if (!record) return null;

    const eventStatus = getEventStatus(record.startDate, record.endDate);
    const totalTickets = calculateTotalTickets(record.ticketTypes);
    const soldTickets = calculateSoldTickets(record.ticketTypes);
    const availableTickets = calculateAvailableTickets(record.ticketTypes);
    const totalRevenue = calculateRevenue(record.ticketTypes);
    const salesPercentage = totalTickets > 0 ? (soldTickets / totalTickets) * 100 : 0;

    return (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Avatar
                        size={40}
                        icon={<CalendarOutlined />}
                        style={{
                            backgroundColor: '#667eea',
                            color: 'white'
                        }}
                    />
                    <div>
                        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>Event Details</div>
                        <Text type="secondary" style={{ fontSize: '14px' }}>
                            Complete event information and analytics
                        </Text>
                    </div>
                </div>
            }
            open={open}
            onCancel={onClose}
            width={1200}
            footer={[
                <Button key="close" onClick={onClose}>
                    Close
                </Button>
            ]}
        >
            <div style={{ marginTop: '20px' }}>
                {/* Event Header Card */}
                <Card style={{ marginBottom: '20px', background: 'rgba(102, 126, 234, 0.05)' }}>
                    <Row align="middle" gutter={20}>
                        <Col>
                            <Avatar
                                size={80}
                                icon={<CalendarOutlined />}
                                style={{
                                    backgroundColor: '#667eea',
                                    color: 'white',
                                    fontSize: '32px'
                                }}
                            />
                        </Col>
                        <Col flex={1}>
                            <Title level={3} style={{ margin: 0, color: '#667eea' }}>
                                {record.title}
                            </Title>
                            <Paragraph style={{ fontSize: '16px', marginBottom: '8px', color: '#64748b' }}>
                                {record.description}
                            </Paragraph>
                            <Space size="middle">
                                <Badge
                                    status={eventStatus.status === 'live' ? 'processing' : 'default'}
                                    color={eventStatus.color}
                                    text={
                                        <Text strong style={{ color: eventStatus.color }}>
                                            {eventStatus.icon} {eventStatus.text}
                                        </Text>
                                    }
                                />
                                <Badge
                                    status={record.isPurchasable ? 'success' : 'error'}
                                    text={
                                        <Text strong style={{ color: getPurchaseStatusColor(record.isPurchasable) }}>
                                            <ShoppingCartOutlined /> {record.isPurchasable ? 'Purchase Enabled' : 'Purchase Disabled'}
                                        </Text>
                                    }
                                />
                            </Space>
                        </Col>
                    </Row>
                </Card>

                {/* Quick Stats */}
                <Row gutter={16} style={{ marginBottom: '20px' }}>
                    <Col span={6}>
                        <Card size="small">
                            <Statistic
                                title="Total Revenue"
                                value={totalRevenue}
                                precision={0}
                                valueStyle={{ color: '#52c41a' }}
                                prefix={<DollarOutlined />}
                                formatter={(value) => `$${value.toLocaleString()}`}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card size="small">
                            <Statistic
                                title="Tickets Sold"
                                value={soldTickets}
                                valueStyle={{ color: '#faad14' }}
                                // prefix={<TicketOutlined />}
                                suffix={`/ ${totalTickets.toLocaleString()}`}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card size="small">
                            <Statistic
                                title="Sales Progress"
                                value={salesPercentage}
                                precision={1}
                                valueStyle={{ color: '#667eea' }}
                                prefix={<TrophyOutlined />}
                                suffix="%"
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card size="small">
                            <Statistic
                                title="Available"
                                value={availableTickets}
                                valueStyle={{ color: '#1890ff' }}
                                prefix={<CheckCircleOutlined />}
                            />
                        </Card>
                    </Col>
                </Row>

                <Row gutter={20}>
                    {/* Event Information */}
                    <Col span={12}>
                        <Card 
                            title={
                                <Space>
                                    <CalendarOutlined style={{ color: '#667eea' }} />
                                    Event Information
                                </Space>
                            }
                            size="small"
                            style={{ height: '100%' }}
                        >
                            <div style={{ marginBottom: '16px' }}>
                                <Text strong style={{ display: 'block', marginBottom: '4px' }}>
                                    <CalendarOutlined style={{ marginRight: '8px', color: '#667eea' }} />
                                    Start Date & Time
                                </Text>
                                <Text style={{ fontSize: '14px' }}>
                                    {formatDate(record.startDate)}
                                </Text>
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <Text strong style={{ display: 'block', marginBottom: '4px' }}>
                                    <CalendarOutlined style={{ marginRight: '8px', color: '#ff4d4f' }} />
                                    End Date & Time
                                </Text>
                                <Text style={{ fontSize: '14px' }}>
                                    {formatDate(record.endDate)}
                                </Text>
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                                    <AppstoreOutlined style={{ marginRight: '8px', color: '#52c41a' }} />
                                    Category
                                </Text>
                                <Tag 
                                    color="#52c41a" 
                                    icon={<AppstoreOutlined />}
                                    style={{ fontSize: '13px', padding: '4px 12px' }}
                                >
                                    {record.category?.title}
                                </Tag>
                            </div>
                        </Card>
                    </Col>

                    {/* Organization & Creator */}
                    <Col span={12}>
                        <Card 
                            title={
                                <Space>
                                    <BankOutlined style={{ color: '#faad14' }} />
                                    Organization & Creator
                                </Space>
                            }
                            size="small"
                            style={{ height: '100%' }}
                        >
                            <div style={{ marginBottom: '16px' }}>
                                <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                                    <BankOutlined style={{ marginRight: '8px', color: '#52c41a' }} />
                                    Organization
                                </Text>
                                <Tag 
                                    color="#52c41a" 
                                    icon={<BankOutlined />}
                                    style={{ fontSize: '13px', padding: '4px 12px' }}
                                >
                                    {record.organization?.name}
                                </Tag>
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                                    <UserOutlined style={{ marginRight: '8px', color: '#667eea' }} />
                                    Created By
                                </Text>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Avatar 
                                        size={24} 
                                        icon={<UserOutlined />}
                                        style={{ backgroundColor: '#667eea' }}
                                    />
                                    <Text style={{ fontSize: '14px' }}>
                                        {record.createdBy?.firstName} {record.createdBy?.lastName}
                                    </Text>
                                </div>
                            </div>

                            <div>
                                <Text strong style={{ display: 'block', marginBottom: '4px' }}>
                                    Purchase Settings
                                </Text>
                                <Space>
                                    {record.isPurchasable ? (
                                        <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '16px' }} />
                                    ) : (
                                        <ExclamationCircleOutlined style={{ color: '#ff4d4f', fontSize: '16px' }} />
                                    )}
                                    <Text style={{ color: getPurchaseStatusColor(record.isPurchasable) }}>
                                        {record.isPurchasable ? 'Purchase Enabled' : 'Purchase Disabled'}
                                    </Text>
                                </Space>
                                {record.disabledPurchase?.value > 0 && (
                                    <div style={{ marginTop: '4px' }}>
                                        <Text type="secondary" style={{ fontSize: '12px' }}>
                                            Disabled {record.disabledPurchase.value} {record.disabledPurchase.unit}(s) before event
                                        </Text>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </Col>
                </Row>

                <Divider />

                {/* Ticket Types Table */}
                <Card 
                    title={
                        <Space>
                            {/* <TicketOutlined style={{ color: '#667eea' }} /> */}
                            Ticket Types & Sales Performance
                        </Space>
                    }
                    size="small"
                >
                    <Table
                        columns={ticketColumns}
                        dataSource={record.ticketTypes}
                        pagination={false}
                        rowKey={(ticketRecord) => ticketRecord.ticketTypeId?._id}
                        size="small"
                    />
                </Card>

                <Divider />
                
                {/* System Information */}
                <Card 
                    title={
                        <Space>
                            <EditOutlined style={{ color: '#667eea' }} />
                            System Information
                        </Space>
                    }
                    size="small"
                >
                    <Row gutter={20}>
                        <Col span={8}>
                            <div style={{ textAlign: 'center', padding: '16px' }}>
                                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#667eea' }}>
                                    {record._id?.substring(0, 8)}...
                                </div>
                                <Text type="secondary">Event ID</Text>
                            </div>
                        </Col>
                        <Col span={8}>
                            <div style={{ textAlign: 'center', padding: '16px' }}>
                                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#52c41a' }}>
                                    {formatDate(record.createdAt)}
                                </div>
                                <Text type="secondary">Created At</Text>
                            </div>
                        </Col>
                        <Col span={8}>
                            <div style={{ textAlign: 'center', padding: '16px' }}>
                                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#faad14' }}>
                                    {formatDate(record.updatedAt)}
                                </div>
                                <Text type="secondary">Last Updated</Text>
                            </div>
                        </Col>
                    </Row>
                </Card>
            </div>
        </Modal>
    );
}

export default forwardRef(ViewEventModal);