import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
    Card,
    Table,
    Button,
    Modal,
    Form,
    Input,
    Select,
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
    Divider,
    Image,
    Rate,
    Timeline,
    Descriptions,
    Spin
} from 'antd';
import {
    EyeOutlined,
    SearchOutlined,
    ReloadOutlined,
    CheckOutlined,
    CloseOutlined,
    BankOutlined,
    CalendarOutlined,
    UserOutlined,
    PhoneOutlined,
    MailOutlined,
    GlobalOutlined,
    EnvironmentOutlined,
    FileTextOutlined,
    ClockCircleOutlined,
    ExclamationCircleOutlined,
    CheckCircleOutlined,
    FileImageOutlined,
    SettingOutlined,
    DatabaseOutlined,
    PauseCircleOutlined
} from '@ant-design/icons';
import { debounce } from 'lodash';
import httpClient from '../../../utils/HttpClient';
import { ORGANIZATION_REQUESTS_STATIC_URL, ORGANIZATION_REQUESTS_URL, ORGANIZATIONS_STATIC_URL, ORGANIZATIONS_URL, UPDATE_ORGANIZATION_REQUESTS_URL, UPDATE_ORGANIZATIONS_URL } from '../../../constants/Url';
import dayjs from 'dayjs';
import { objectToQuery } from '../../../utils/Utils';
import RejectOrganizationModal from './components/modals/RejectOrganizationModal';
import ViewOrganizationDetailModal from './components/modals/ViewOrganizationDetailModal';
import ManageOrganizationStatusModal from './components/modals/ManageOrganizationStatusModal';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const OrganizationRequestPage = () => {
    const defaultStatic = useMemo(() => {
        return { pending: 0, approved: 0, rejected: 0 }
    }, [])
    const defaultFilter = useMemo(() => {
        return {
            pageNo: 1,
            pageSize: 10,
            keyword: '',
            isActive: 'all',
            type: 'all'
        }
    }, [])
    const [filter, setFilter] = useState(defaultFilter)
    const [dataSource, setDataSource] = useState({ data: [], total: 0 });
    const [statistic, setStatistic] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
    const [loading, setLoading] = useState({
        list: true,
        static: true,
    });

    const viewModalRef = useRef(null);
    const manageOrganizationStatusModalRef = useRef(null);

    const fetchStatic = useCallback(async (parseQuery) => {
        try {
            setLoading(pre => ({ ...pre, static: true }));

            const res = await httpClient.get(ORGANIZATIONS_STATIC_URL).then((res) => res.data);

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

    const fetchData = useCallback(async (parseQuery) => {
        try {
            setLoading(pre => ({ ...pre, list: true }));

            const query = {
                keyword: parseQuery?.keyword || filter.keyword,
                isActive: parseQuery?.isActive || filter.isActive,
                type: parseQuery?.type || filter.type,
                pageNo: parseQuery?.pageNo || filter.pageNo,
                pageSize: parseQuery?.pageSize || filter.pageSize,
            }

            // Simulate API call
            const res = await httpClient.get(objectToQuery(ORGANIZATIONS_URL, query)).then((res) => res.data);

            console.log('Fetched data:', res.data);

            if (res.status === 200) {
                setDataSource({ data: res.data, total: res.total });
            } else {
                setDataSource({ data: [], total: 0 });
            }
        } catch (error) {
            setDataSource({ data: [], total: 0 });
        } finally {
            setLoading(pre => ({ ...pre, list: false }));
        }
    }, [filter]);

    const debounceFetchData = useCallback(debounce(fetchData, 300), [fetchData]);

    // Mock data
    useEffect(() => {
        debounceFetchData();

        return debounceFetchData.cancel
    }, [debounceFetchData]);

    const handleView = (record) => {
        viewModalRef?.current?.openModal(record);
    };

    const columns = [
        {
            title: 'Organization',
            dataIndex: 'name',
            key: 'organization',
            render: (text, record) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Avatar
                        src={record.logo}
                        size={40}
                        style={{
                            backgroundColor: '#667eea',
                            color: 'white'
                        }}
                    >
                        {text?.charAt(0)}
                    </Avatar>
                    <div>
                        <div style={{ fontWeight: 600, marginBottom: '2px' }}>{text}</div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>{record.type}</Text>
                    </div>
                </div>
            ),
        },
        {
            title: 'Contact Info',
            dataIndex: ["adminUserRequest", 'contactName'],
            key: 'contact',
            render: (text, record) => (
                <div>
                    <div style={{ fontWeight: 500 }}>{text}</div>
                    <Text type="secondary" style={{ fontSize: '12px' }}>{record.email}</Text>
                </div>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'isActive',
            key: 'status',
            render: (isActive) => {
                const status = isActive ? 'Active' : 'Suspended';

                return (
                    <Tag color={isActive ? 'green' : 'orange'}>
                        {status}
                    </Tag>
                )
            }
        },
        {
            title: 'Members',
            dataIndex: 'memberCount',
            key: 'members',
            render: (count) => `${count || 0} user${count > 1 ? 's' : ''}`
        },
        {
            title: 'Created',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => dayjs(date).format('YYYY-MM-DD')
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
                            onClick={() => handleView(record?.adminUserRequest)}
                            style={{ color: '#667eea' }}
                        />
                    </Tooltip>
                    <Tooltip title="Manage">
                        <Button type="text" icon={<SettingOutlined />} onClick={() => handleManage(record)} />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const handleManage = (record) => {
        manageOrganizationStatusModalRef?.current?.openModal(record);
    }

    return (
        <div style={{ background: 'transparent' }}>
            {/* Header Section */}
            <div
                style={{
                    marginBottom: '16px'
                }}
            >
                <h3 style={{ margin: 0, color: '#667eea' }}>
                    Organization
                </h3>
                <p style={{ margin: '4px 0 0 0', color: '#64748b' }}>
                    Review and manage organization
                </p>
            </div>

            {/* Stats Cards */}
            <Row gutter={16} style={{ marginBottom: '24px' }}>
                <Col span={6}>
                    <Spin spinning={loading.static}>
                        <Card size="small">
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <Text type="secondary">Total Organizations</Text>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea' }}>
                                        {statistic.total || 0}
                                    </div>
                                </div>
                                <Avatar icon={<DatabaseOutlined />} style={{ backgroundColor: '#667eea' }} />
                            </div>
                        </Card>
                    </Spin>
                </Col>
                <Col span={6}>
                    <Spin spinning={loading.static}>
                        <Card size="small">
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <Text type="secondary">Active Organizations</Text>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                                        {statistic?.active || 0}
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
                                    <Text type="secondary">Suspended Organizations</Text>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#faad14' }}>
                                        {statistic?.suspend || 0}
                                    </div>
                                </div>
                                <Avatar icon={<PauseCircleOutlined />} style={{ backgroundColor: '#faad14' }} />
                            </div>
                        </Card>
                    </Spin>
                </Col>
                <Col span={6}>
                    <Spin spinning={loading.static}>
                        <Card size="small">
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <Text type="secondary">Recently Registered (Last 30days)</Text>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                                        {statistic?.recent || 0}
                                    </div>
                                </div>
                                <Avatar icon={<ClockCircleOutlined />} style={{ backgroundColor: '#1890ff' }} />
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
                            placeholder="Search organizations..."
                            prefix={<SearchOutlined />}
                            value={filter.keyword}
                            onChange={(e) => {
                                setFilter(pre => ({ ...pre, keyword: e.target.value, pageNo: 1 }));
                                // setSearchText(e.target.value)
                            }}
                            style={{ width: 250 }}
                        />
                        <Select
                            placeholder="Status"
                            value={filter.isActive}
                            onChange={(value) => {
                                setFilter(pre => ({ ...pre, isActive: value, pageNo: 1 }));
                            }}
                            style={{ width: 140 }}
                        >
                            <Option value="all">All Status</Option>
                            <Option value="true">Active</Option>
                            <Option value="false">Suspended</Option>
                        </Select>
                        <Select
                            placeholder="Category"
                            value={filter.type}
                            onChange={(value) => {
                                setFilter(pre => ({ ...pre, type: value, pageNo: 1 }));
                            }}
                            style={{ width: 160 }}
                        >
                            <Option value="all">All Categories</Option>
                            <Option value="Company">Company</Option>
                            <Option value="Non-Profit">Non-Profit</Option>
                            <Option value="Government">Government</Option>
                            <Option value="School">School</Option>
                            <Option value="Other">Other</Option>
                        </Select>
                    </Space>

                    <Button
                        icon={<ReloadOutlined />}
                        onClick={() => {
                            setFilter(defaultFilter);
                            Promise.all([
                                debounceFetchStatic(defaultFilter),
                                debounceFetchData()
                            ])
                        }}
                        loading={loading.list}
                    >
                        Refresh
                    </Button>
                </div>

                {/* Table */}
                <Table
                    columns={columns}
                    dataSource={dataSource?.data}
                    loading={loading.list}
                    rowKey="id"
                    pagination={{
                        pageSize: filter.pageSize,
                        current: filter.pageNo,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        total: dataSource.total,
                        onChange: (page, pageSize) => {
                            // Fetch data for the selected page
                            setFilter(pre => {
                                debounceFetchData({ ...pre, pageNo: page, pageSize });
                                return ({ ...pre, pageNo: page, pageSize })
                            });
                        },
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} organization`,
                    }}
                />
            </Card>

            {/* View Details Modal */}
            <ViewOrganizationDetailModal
                ref={viewModalRef}
            />

            <ManageOrganizationStatusModal
                ref={manageOrganizationStatusModalRef}
                debounceFetchData={async () => {
                    await Promise.all([
                        debounceFetchStatic(),
                        debounceFetchData()
                    ]);
                }}
            />
        </div>
    );
};

export default OrganizationRequestPage;