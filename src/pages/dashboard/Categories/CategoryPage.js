import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    Table,
    Button,
    Input,
    Space,
    Popconfirm,
    message,
    Card,
    Tag,
    Tooltip,
    Avatar,
    Badge,
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
} from '@ant-design/icons';
import { MdCategory } from 'react-icons/md';
import dayjs from 'dayjs';
import ToggleCategoryModal from './components/modals/ToggleCategoryModal';
import { debounce } from 'lodash';
import { CATEGORIES_URL, DELETE_CATEGORIES_URL } from '../../../constants/Url';
import httpClient from '../../../utils/HttpClient';

const CategoryPage = () => {
    const defaultFilter = useMemo(() => {
        return {
            pageNo: 1,
            pageSize: 10,
        }
    }, [])
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState(defaultFilter)
    const [total, setTotal] = useState(0);
    const [categories, setCategories] = useState([
        {
            id: 1,
            title: 'Entertainment',
            description: 'Movies, concerts, shows and other entertainment events',
            iconUrl: 'https://cdn.jsdelivr.net/npm/@ant-design/icons@4.7.0/lib/icons/PlayCircleOutlined.js',
            color: '#ff6b6b',
            createdAt: '2024-01-15T10:30:00Z',
            updatedAt: '2024-01-20T14:45:00Z'
        },
        {
            id: 2,
            title: 'Sports',
            description: 'Football, basketball, tennis and all sports activities',
            iconUrl: 'https://cdn.jsdelivr.net/npm/@ant-design/icons@4.7.0/lib/icons/TrophyOutlined.js',
            color: '#4ecdc4',
            createdAt: '2024-01-18T09:15:00Z',
            updatedAt: '2024-01-25T16:20:00Z'
        },
        {
            id: 3,
            title: 'Business',
            description: 'Conferences, seminars, workshops and business events',
            iconUrl: 'https://cdn.jsdelivr.net/npm/@ant-design/icons@4.7.0/lib/icons/BankOutlined.js',
            color: '#45b7d1',
            createdAt: '2024-02-01T08:00:00Z',
            updatedAt: '2024-02-05T11:30:00Z'
        },
        {
            id: 4,
            title: 'Education',
            description: 'Training sessions, courses, and educational programs',
            iconUrl: 'https://cdn.jsdelivr.net/npm/@ant-design/icons@4.7.0/lib/icons/BookOutlined.js',
            color: '#f39c12',
            createdAt: '2024-02-10T12:45:00Z',
            updatedAt: null
        }
    ]);

    const toggleCategoriesModalRef = useRef(null);

    const showModal = (category = null, mode) => {
        if (category) {
            toggleCategoriesModalRef.current?.openModal(category, mode);
        } else {
            toggleCategoriesModalRef.current?.openModal({}, mode);
        }
    };

    const handleDelete = async (id) => {
        try {
            setLoading(true);
            const res = await httpClient.delete(DELETE_CATEGORIES_URL.replace(":id", id)).then(res => res.data)

            if (res.status === 200) {
                debounceFetchData()
                message.success("Successfully deleted Category.");
            } else {
                message.success("Failed to delete categories");
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            message.error("Failed to delete categories")
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Never';
        return dayjs(dateString).tz('Asia/Phnom_Penh').format('MMM DD, YYYY HH:mm');
    };

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);

            const res = await httpClient.get(CATEGORIES_URL).then(res => res.data); // Simulate fetching data from API

            if (res.status === 200) {
                setCategories(res.data);
                setTotal(res.total)
            } else {
                setCategories([]);
                setTotal(0)
            }
        } catch (error) {
            setCategories([]);
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
            title: 'Category',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Avatar
                        style={{
                            backgroundColor: record.color,
                            color: 'white'
                        }}
                        icon={<MdCategory />}
                    />
                    <div>
                        <div style={{ fontWeight: 600, fontSize: '14px' }}>{text}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>
                            ID: <Tag size="small">#{record.id}</Tag>
                        </div>
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
            title: 'Color',
            dataIndex: 'color',
            key: 'color',
            render: (color) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                        style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '4px',
                            backgroundColor: color,
                            border: '1px solid #d9d9d9'
                        }}
                    />
                    <span style={{ fontSize: '12px', fontFamily: 'monospace' }}>{color}</span>
                </div>
            )
        },
        {
            title: 'Icon URL',
            dataIndex: 'iconUrl',
            key: 'iconUrl',
            ellipsis: true,
            render: (url) => (
                <Tooltip title={url}>
                    <Tag color="blue" style={{ fontSize: '11px', maxWidth: '150px' }}>
                        {url ? url.split('/').pop().substring(0, 20) + '...' : 'No icon'}
                    </Tag>
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
                            onClick={() => showModal(record, "view")}
                            style={{ color: '#667eea' }}
                        />
                    </Tooltip>
                    <Tooltip title="Edit Category">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => showModal(record, "edit")}
                            style={{ color: '#52c41a' }}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Delete Category"
                        description="Are you sure you want to delete this category?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Tooltip title="Delete Category">
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
                        <h3 style={{ margin: 0, color: '#667eea' }}>Category Management</h3>
                        <p style={{ margin: '4px 0 0 0', color: '#64748b' }}>
                            Organize your events into different categories
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
                        Create Category
                    </Button>
                </div>

                <Card>
                    <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Badge
                            count={categories.length}
                            style={{ backgroundColor: '#667eea' }}
                            showZero
                        >
                            <span style={{ marginRight: '8px', fontWeight: 500 }}>Total Categories</span>
                        </Badge>
                    </div>

                    <Table
                        loading={loading}
                        columns={columns}
                        dataSource={categories}
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
                                `${range[0]}-${range[1]} of ${total} categories`,
                        }}
                    />
                </Card>
            </div>
            <ToggleCategoryModal
                ref={toggleCategoriesModalRef}
                fetchData={async () => {
                    await Promise.all([
                        debounceFetchData()
                    ])
                }}
            />
        </div>
    );
};

export default CategoryPage;