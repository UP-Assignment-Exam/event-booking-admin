import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    Table,
    Button,
    Space,
    Popconfirm,
    message,
    Card,
    Tag,
    Tooltip,
    Avatar,
    Badge
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
} from '@ant-design/icons';
import { TiTicket } from 'react-icons/ti';
import dayjs from 'dayjs';
import ToggleEventTicketModal from './components/modals/ToggleEventTicketModal';
import httpClient from '../../../utils/HttpClient';
import { DELETE_TICKET_TYPES_URL, TICKET_TYPES_URL } from '../../../constants/Url';
import { debounce } from 'lodash';


const TicketTypePage = () => {
    const defaultFilter = useMemo(() => {
        return {
            pageNo: 1,
            pageSize: 10,
        }
    }, [])
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState(defaultFilter)
    const [total, setTotal] = useState(0);
    const [ticketTypes, setTicketTypes] = useState([
        {
            id: 1,
            title: 'VIP Premium',
            description: 'Premium access with exclusive perks and priority seating',
            createdAt: '2024-01-15T10:30:00Z',
            updatedAt: '2024-01-20T14:45:00Z'
        },
        {
            id: 2,
            title: 'General Admission',
            description: 'Standard entry ticket with access to main event area',
            createdAt: '2024-01-18T09:15:00Z',
            updatedAt: '2024-01-25T16:20:00Z'
        },
        {
            id: 3,
            title: 'Early Bird',
            description: 'Discounted tickets available for limited time before event',
            createdAt: '2024-02-01T08:00:00Z',
            updatedAt: '2024-02-05T11:30:00Z'
        },
        {
            id: 4,
            title: 'Student Discount',
            description: 'Special pricing for students with valid ID verification',
            createdAt: '2024-02-10T12:45:00Z',
            updatedAt: null
        }
    ]);

    const toggleEventTicketModalRef = useRef(null);

    const showModal = (ticketType = null, mode) => {
        if (ticketType) {
            toggleEventTicketModalRef.current?.openModal(ticketType, mode);
        } else {
            toggleEventTicketModalRef.current?.openModal({}, mode);
        }
    };

    const handleDelete = async (id) => {
        try {
            setLoading(true);
            const res = await httpClient.delete(DELETE_TICKET_TYPES_URL.replace(":id", id)).then(res => res.data)

            if (res.status === 200) {
                debounceFetchData()
                message.success("Successfully deleted Ticket type.");
            } else {
                message.success("Failed to delete Ticket type");
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            message.error("Failed to delete Ticket type")
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Never';
        return dayjs(dateString).tz('Asia/Phnom_Penh').format('MMM DD, YYYY HH:mm');
    };

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);

            const res = await httpClient.get(TICKET_TYPES_URL).then(res => res.data); // Simulate fetching data from API

            if (res.status === 200) {
                setTicketTypes(res.data);
                setTotal(res.total)
            } else {
                setTicketTypes([]);
                setTotal(0)
            }
        } catch (error) {
            setTicketTypes([]);
            setTotal(0)
        } finally {
            setLoading(false);
        }
    }, []);

    const debounceFetchData = useCallback(debounce(fetchData, 300), [fetchData])

    useEffect(() => {
        debounceFetchData()

        return debounceFetchData.cancel
    }, [debounceFetchData])

    const columns = [
        {
            title: 'Ticket Type',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Avatar
                        style={{
                            backgroundColor: '#667eea',
                            color: 'white'
                        }}
                        icon={<TiTicket />}
                    />
                    <div>
                        <div style={{ fontWeight: 600, fontSize: '14px' }}>{text}</div>
                        {/* <div style={{ fontSize: '12px', color: '#64748b' }}>
                            ID: <Tag size="small">#{record._id}</Tag>
                        </div> */}
                    </div>
                </div>
            ),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
            render: (text) => (
                <Tooltip title={text}>
                    <span>{text}</span>
                </Tooltip>
            )
        },
        {
            title: 'Created',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => (
                <div style={{ fontSize: '13px' }}>
                    <div>{formatDate(date)}</div>
                </div>
            ),
        },
        {
            title: 'Last Updated',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (date) => (
                <div style={{ fontSize: '13px' }}>
                    {date ? (
                        <>
                            <div>{formatDate(date)}</div>
                        </>
                    ) : (
                        <Tag color="default">Not modified</Tag>
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
                            onClick={() => showModal(record, 'view')}
                            style={{ color: '#667eea' }}
                        />
                    </Tooltip>
                    <Tooltip title="Edit Ticket Type">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => showModal(record, 'edit')}
                            style={{ color: '#52c41a' }}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Delete Ticket Type"
                        description="Are you sure you want to delete this ticket type?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Tooltip title="Delete Ticket Type">
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
                        <h3 style={{ margin: 0, color: '#667eea' }}>Ticket Types Management</h3>
                        <p style={{ margin: '4px 0 0 0', color: '#64748b' }}>
                            Manage different types of tickets for your events
                        </p>
                    </div>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => showModal({}, "create")}
                        style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            border: 'none',
                            borderRadius: '8px'
                        }}
                    >
                        Create Ticket Type
                    </Button>
                </div>

                <Card>
                    <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Badge
                            count={total}
                            style={{ backgroundColor: '#667eea' }}
                            showZero
                        >
                            <span style={{ marginRight: '8px', fontWeight: 500 }}>Total Ticket Types</span>
                        </Badge>
                    </div>

                    <Table
                        columns={columns}
                        dataSource={ticketTypes}
                        loading={loading}
                        rowKey="id"
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
                                `${range[0]}-${range[1]} of ${total} ticket types`,
                        }}
                    />
                </Card>
            </div>

            <ToggleEventTicketModal
                ref={toggleEventTicketModalRef}
                fetchData={async () => {
                    await Promise.all([
                        debounceFetchData()
                    ])
                }}
            />
        </div>
    );
};

export default TicketTypePage;