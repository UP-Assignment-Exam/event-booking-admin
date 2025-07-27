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
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    SearchOutlined,
    ReloadOutlined,
    UserOutlined,
    TeamOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    UserAddOutlined,
    PhoneOutlined,
    MailOutlined,
    BankOutlined,
    KeyOutlined,
} from '@ant-design/icons';
import ToggleUserModal from './components/modals/ToggleUserModal';
import ViewUserModal from './components/modals/ViewUserModal';
import { debounce } from 'lodash';
import httpClient from '../../../utils/HttpClient';
import { objectToQuery } from '../../../utils/Utils';
import { DELETE_USER_URL, GET_ALL_ORGANIZATIONS_URL, GET_ALL_ROLES_URL, UPDATE_USER_STATUS_URL, USERS_STATIC_URL, USERS_URL } from '../../../constants/Url';

const { Text } = Typography;
const { Option } = Select;

const UserManagementPage = () => {
    const defaultStatic = useMemo(() => {
        return {
            total: 0,
            active: 0,
            inactive: 0,
            withSetup: 0,
            withoutSetup: 0,
            withOrganization: 0
        }
    }, [])

    const [users, setUsers] = useState([]);
    const defaultFilter = useMemo(() => {
        return {
            pageNo: 1,
            pageSize: 10,
            isDeleted: "false",
            isSetup: "all",
            role: "all",
            organization: "all",
            keyword: ""
        }
    }, [])

    const [statistic, setStatistic] = useState(defaultStatic);
    const [filter, setFilter] = useState(defaultFilter)
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState({
        list: true,
        static: true,
    });
    const [roles, setRoles] = useState([]);
    const [organizations, setOrganizations] = useState([]);

    const viewUserModalRef = useRef(null);
    const toggleUserModalRef = useRef(null);

    // Fetch roles and organizations for filters
    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const [rolesRes, orgsRes] = await Promise.all([
                    httpClient.get(GET_ALL_ROLES_URL).then(res => res.data),
                    httpClient.get(GET_ALL_ORGANIZATIONS_URL).then(res => res.data)
                ]);

                if (rolesRes.status === 200) setRoles(rolesRes.data);
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

            const res = await httpClient.get(USERS_STATIC_URL).then((res) => res.data);

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
        debounceFetchStatic()
        return debounceFetchStatic.cancel;
    }, [debounceFetchStatic]);

    const fetchData = useCallback(async (parseQuery) => {
        try {
            setLoading(pre => ({ ...pre, list: true }));

            const res = await httpClient.get(objectToQuery(USERS_URL, parseQuery ?? filter)).then(res => res.data);

            if (res.status === 200) {
                setUsers(res.data);
                setTotal(res.total)
            } else {
                setUsers([]);
                setTotal(0)
            }
        } catch (error) {
            setUsers([]);
            setTotal(0)
        } finally {
            setLoading(pre => ({ ...pre, list: false }));
        }
    }, [filter]);

    const debounceFetchData = useCallback(debounce(fetchData, 300), [fetchData])

    useEffect(() => {
        debounceFetchData()
        return debounceFetchData.cancel
    }, [debounceFetchData])

    const handleAdd = () => {
        toggleUserModalRef.current?.openModal({}, "create");
    };

    const handleEdit = (record) => {
        toggleUserModalRef.current?.openModal(record, "edit");
    };

    const handleView = (record) => {
        viewUserModalRef?.current?.openModal(record)
    };

    const toggleUserStatus = async (id, currentStatus) => {
        try {
            setLoading(pre => ({ ...pre, list: true, static: true }));

            const payload = {
                status: !currentStatus,
            }

            const res = await httpClient.put(UPDATE_USER_STATUS_URL.replace(":id", id), payload).then(res => res.data)

            if (res.status === 200) {
                await Promise.all([
                    debounceFetchData(),
                    debounceFetchStatic()
                ])
                message.success(`User ${!currentStatus ? 'deactivated' : 'activated'}`);
            } else {
                message.error("Failed to update user status");
            setLoading(pre => ({ ...pre, list: false, static: false }));
            }
        } catch (error) {
            setLoading(pre => ({ ...pre, list: false, static: false }));
            message.error("Failed to update user status")
        }
    };

    const handleDelete = async (id) => {
        try {
            setLoading(pre => ({ ...pre, static: true, list: true }));
            const res = await httpClient.delete(DELETE_USER_URL.replace(":id", id)).then(res => res.data)

            if (res.status === 200) {
                await Promise.all([
                    debounceFetchData(),
                    debounceFetchStatic()
                ])
                message.success('User deleted successfully');
            } else {
                message.error("Failed to delete user");
                setLoading(pre => ({ ...pre, static: false, list: false }));
            }
        } catch (error) {
            setLoading(pre => ({ ...pre, static: false, list: false }));
            message.error("Failed to delete user")
        }
    };

    // const getStatusColor = (isDeleted) => {
    //     return isDeleted ? '#ff4d4f' : '#52c41a';
    // };

    // const getSetupStatusColor = (isSetup) => {
    //     return isSetup ? '#52c41a' : '#faad14';
    // };

    const columns = [
        {
            title: 'User',
            dataIndex: 'username',
            key: 'user',
            render: (text, record) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Avatar
                        src={record.avatar || undefined}
                        icon={!record.avatar ? <UserOutlined /> : undefined}
                        style={{
                            backgroundColor: '#667eea',
                            color: 'white'
                        }}
                    />
                    <div>
                        <div style={{ fontWeight: 600, marginBottom: '2px' }}>
                            {record.firstName} {record.lastName}
                        </div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>@{text}</Text>
                    </div>
                </div>
            ),
        },
        {
            title: 'Contact',
            dataIndex: 'email',
            key: 'contact',
            render: (email, record) => (
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                        <MailOutlined style={{ fontSize: '12px', color: '#64748b' }} />
                        <Text style={{ fontSize: '12px' }}>{email}</Text>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <PhoneOutlined style={{ fontSize: '12px', color: '#64748b' }} />
                        <Text style={{ fontSize: '12px' }}>{record.phone}</Text>
                    </div>
                </div>
            ),
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (role) => (
                <Tag color="#667eea" style={{ textTransform: 'capitalize' }}>
                    {role?.name || 'No Role'}
                </Tag>
            ),
        },
        {
            title: 'Organization',
            dataIndex: 'organization',
            key: 'organization',
            render: (organization) => (
                organization ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <BankOutlined style={{ fontSize: '12px', color: '#64748b' }} />
                        <Text style={{ fontSize: '12px' }}>{organization.name}</Text>
                    </div>
                ) : (
                    <Text type="secondary" style={{ fontSize: '12px' }}>No Organization</Text>
                )
            ),
        },
        {
            title: 'Setup Status',
            dataIndex: 'isSetup',
            key: 'setup',
            render: (isSetup) => (
                <Badge
                    status={isSetup ? 'success' : 'warning'}
                    text={isSetup ? 'Completed' : 'Pending'}
                />
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status, record) => (
                <Switch
                    checked={status}
                    onChange={() => toggleUserStatus(record._id, status)}
                    checkedChildren="Active"
                    unCheckedChildren="Inactive"
                    style={{
                        backgroundColor: status ? '#52c41a' : undefined
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
                    {
                        !record?.role?.superAdmin &&
                        <Tooltip title="Delete">
                            <Popconfirm
                                title="Are you sure you want to delete this user?"
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
                    }
                </Space>
            ),
        },
    ];

    return (
        <div style={{ background: 'transparent' }}>
            {/* Header Section */}
            <div style={{ marginBottom: '16px' }}>
                <h3 style={{ margin: 0, color: '#667eea' }}>
                    User Management
                </h3>
                <p style={{ margin: '4px 0 0 0', color: '#64748b' }}>
                    Manage system users, roles, and permissions
                </p>
            </div>

            {/* Stats Cards */}
            <Row gutter={16} style={{ marginBottom: '24px' }}>
                <Col span={4}>
                    <Spin spinning={loading.static}>
                        <Card size="small">
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <Text type="secondary">Total Users</Text>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea' }}>
                                        {statistic.total}
                                    </div>
                                </div>
                                <Avatar icon={<TeamOutlined />} style={{ backgroundColor: '#667eea' }} />
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
                <Col span={4}>
                    <Spin spinning={loading.static}>
                        <Card size="small">
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <Text type="secondary">Setup Complete</Text>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                                        {statistic.withSetup}
                                    </div>
                                </div>
                                <Avatar icon={<KeyOutlined />} style={{ backgroundColor: '#52c41a' }} />
                            </div>
                        </Card>
                    </Spin>
                </Col>
                <Col span={4}>
                    <Spin spinning={loading.static}>
                        <Card size="small">
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <Text type="secondary">Setup Pending</Text>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#faad14' }}>
                                        {statistic.withoutSetup}
                                    </div>
                                </div>
                                <Avatar icon={<UserAddOutlined />} style={{ backgroundColor: '#faad14' }} />
                            </div>
                        </Card>
                    </Spin>
                </Col>
                <Col span={4}>
                    <Spin spinning={loading.static}>
                        <Card size="small">
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <Text type="secondary">With Org</Text>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                                        {statistic.withOrganization}
                                    </div>
                                </div>
                                <Avatar icon={<BankOutlined />} style={{ backgroundColor: '#1890ff' }} />
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
                            placeholder="Search users..."
                            prefix={<SearchOutlined />}
                            value={filter.keyword}
                            onChange={(e) => setFilter(pre => ({ ...pre, keyword: e.target.value }))}
                            style={{ width: 250 }}
                        />
                        <Select
                            placeholder="Setup Status"
                            value={filter.isSetup}
                            onChange={(value) => setFilter(pre => ({ ...pre, isSetup: value }))}
                            style={{ width: 140 }}
                        >
                            <Option value="all">All Setup</Option>
                            <Option value="true">Completed</Option>
                            <Option value="false">Pending</Option>
                        </Select>
                        <Select
                            placeholder="Role"
                            value={filter.role}
                            onChange={(value) => setFilter(pre => ({ ...pre, role: value }))}
                            style={{ width: 140 }}
                        >
                            <Option value="all">All Roles</Option>
                            {roles.map(role => (
                                <Option key={role._id} value={role._id}>{role.name}</Option>
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
                            Add User
                        </Button>
                    </Space>
                </div>

                {/* Table */}
                <Table
                    columns={columns}
                    dataSource={users}
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
                                return ({ ...pre, pageNo: page, pageSize })
                            });
                        },
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} users`,
                    }}
                />
            </Card>

            {/* View Details Modal */}
            <ViewUserModal
                ref={viewUserModalRef}
            />

            {/* Add/Edit Modal */}
            <ToggleUserModal
                ref={toggleUserModalRef}
                fetchData={async () => {
                    await Promise.all([
                        debounceFetchData(),
                        debounceFetchStatic(),
                    ])
                }}
                roles={roles}
                organizations={organizations}
            />
        </div>
    );
};

export default UserManagementPage;