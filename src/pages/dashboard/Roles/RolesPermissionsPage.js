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
    Switch,
    Badge,
    Avatar
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
} from '@ant-design/icons';
import { GoShieldCheck } from 'react-icons/go';
import ToggleRolePermissionModal from './components/modals/ToggleRolePermissionModal';
import httpClient from '../../../utils/HttpClient';
import { DELETE_ROLES_URL, ROLES_URL, UPDATE_STATUS_ROLES_URL } from '../../../constants/Url';
import { debounce } from 'lodash';
import { objectToQuery } from '../../../utils/Utils';
import "./RolesPermissionsPage.css";

const RolesPermissionsCRUD = () => {
    const defaultFilter = useMemo(() => {
        return {
            pageNo: 1,
            pageSize: 10,
        }
    }, [])
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState(defaultFilter)
    const [total, setTotal] = useState(0);
    const [roles, setRoles] = useState([
        {
            id: 1,
            name: 'Super Admin',
            description: 'Full system access with all permissions',
            status: 'active',
            userCount: 2,
            permissions: ['users.create', 'users.read', 'users.update', 'users.delete', 'events.create', 'events.read', 'events.update', 'events.delete', 'tickets.create', 'tickets.read', 'tickets.update', 'tickets.delete', 'roles.create', 'roles.read', 'roles.update', 'roles.delete'],
            createdAt: '2024-01-15',
            level: 'system'
        },
        {
            id: 2,
            name: 'Event Manager',
            description: 'Can manage events and view user data',
            status: 'active',
            userCount: 5,
            permissions: ['events.create', 'events.read', 'events.update', 'events.delete', 'tickets.create', 'tickets.read', 'tickets.update', 'users.read'],
            createdAt: '2024-01-20',
            level: 'admin'
        },
        {
            id: 3,
            name: 'Content Editor',
            description: 'Can edit content and manage categories',
            status: 'active',
            userCount: 8,
            permissions: ['events.read', 'events.update', 'tickets.read', 'users.read'],
            createdAt: '2024-02-01',
            level: 'editor'
        },
        {
            id: 4,
            name: 'Support Agent',
            description: 'Customer support with limited access',
            status: 'inactive',
            userCount: 3,
            permissions: ['tickets.read', 'users.read'],
            createdAt: '2024-02-10',
            level: 'support'
        }
    ]);

    const toggleCategoriesModalRef = useRef(null);

    const handleDelete = async (id) => {
        try {
            setLoading(true);
            const res = await httpClient.delete(DELETE_ROLES_URL.replace(":id", id)).then(res => res.data)

            if (res.status === 200) {
                debounceFetchData()
                message.success("Successfully deleted Roles.");
            } else {
                message.success("Failed to delete roles");
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            message.error("Failed to delete roles")
        }
    };

    const levelColors = {
        // system: '#722ed1',
        admin: '#1890ff',
        // editor: '#52c41a',
        // support: '#faad14'
    };

    const levelIcons = {
        // system: <CrownOutlined />,
        admin: <GoShieldCheck />,
        // editor: <EditOutlined />,
        // support: <SafetyOutlined />
    };

    const showModal = (role = null, mode) => {
        if (role) {
            toggleCategoriesModalRef.current?.openModal(role, mode);
        } else {
            toggleCategoriesModalRef.current?.openModal({}, mode);
        }
    };

    const toggleStatus = async (id, status) => {
        try {
            setLoading(true);

            const payload = {
                status: status ? "active" : "inactive",
            }

            const res = await httpClient.put(UPDATE_STATUS_ROLES_URL.replace(":id", id), payload).then(res => res.data)

            if (res.status === 200) {
                debounceFetchData()
                message.success('Role status updated!');
            } else {
                message.success("Failed to update status roles");
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            message.error("Failed to update status roles")
        }
    };

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);

            const res = await httpClient.get(objectToQuery(ROLES_URL, filter)).then(res => res.data); // Simulate fetching data from API

            if (res.status === 200) {
                setRoles(res.data);
                setTotal(res.total)
            } else {
                setRoles([]);
                setTotal(0)
            }
        } catch (error) {
            setRoles([]);
            setTotal(0)
        } finally {
            setLoading(false);
        }
    }, [filter]);

    const debounceFetchData = useCallback(debounce(fetchData, 300), [fetchData])

    useEffect(() => {
        debounceFetchData()

        return debounceFetchData.cancel
    }, [debounceFetchData])

    const columns = [
        {
            title: 'Role',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {
                        record.superAdmin &&
                        <Avatar
                            style={{
                                backgroundColor: levelColors["admin"],
                                color: 'white'
                            }}
                            icon={levelIcons["admin"]}
                        />
                    }
                    <div>
                        <div style={{ fontWeight: 600, fontSize: '14px' }}>{text}</div>
                        {/* <div style={{ fontSize: '12px', color: '#64748b' }}>
                            Level: <Tag color={levelColors[record?.level]} size="small">
                                {record?.level?.charAt(0)?.toUpperCase() + record?.level?.slice(1)}
                            </Tag>
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
        },
        {
            title: 'Users',
            dataIndex: 'userCount',
            key: 'userCount',
            render: (count) => (
                <Badge
                    count={count}
                    style={{ backgroundColor: '#667eea' }}
                    showZero
                />
            ),
        },
        {
            title: 'Permissions',
            dataIndex: 'associatedRights',
            key: 'permissions',
            render: (associatedRights, record) => {
                if (record?.superAdmin) {
                    return <Tooltip title={`Full Access permissions assigned`}>
                        <Tag color="blue">Full Access</Tag>
                    </Tooltip>
                }

                return <Tooltip title={`${associatedRights?.length} permissions assigned`}>
                    <Tag color="blue">{associatedRights?.length} permissions</Tag>
                </Tooltip>
            },
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status, record) => (
                !record.superAdmin &&
                <Switch
                    checked={status === 'active'}
                    onChange={() => toggleStatus(record._id, !(status === 'active'))}
                    checkedChildren="Active"
                    unCheckedChildren="Inactive"
                    style={{
                        backgroundColor: status === 'active' ? '#52c41a' : undefined
                    }}
                />
            ),
        },
        {
            title: 'Created',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                !record.superAdmin &&
                <Space>
                    <Tooltip title="View Details">
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            onClick={() => showModal(record, "view")}
                            style={{ color: '#667eea' }}
                        />
                    </Tooltip>
                    <Tooltip title="Edit Role">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => showModal(record, "edit")}
                            style={{ color: '#52c41a' }}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Delete Role"
                        description="Are you sure you want to delete this role?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Tooltip title="Delete Role">
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
                        <h3 style={{ margin: 0, color: '#667eea' }}>Roles Overview</h3>
                        <p style={{ margin: '4px 0 0 0', color: '#64748b' }}>
                            Manage user roles and their access levels
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
                        Create Role
                    </Button>
                </div>

                <Card>
                    <Table
                        columns={columns}
                        dataSource={roles}
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
                                `${range[0]}-${range[1]} of ${total} roles`,
                        }}
                    />
                </Card>
            </div>
            <ToggleRolePermissionModal
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

export default RolesPermissionsCRUD;