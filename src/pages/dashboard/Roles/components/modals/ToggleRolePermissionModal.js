import React, { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Select,
    Space,
    Popconfirm,
    message,
    Card,
    Row,
    Col,
    Tag,
    Tooltip,
    Divider,
    Switch,
    Checkbox,
    Tabs,
    Badge,
    Avatar
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    UserOutlined,
    // ShieldCheckOutlined,
    SettingOutlined,
    CrownOutlined,
    SafetyOutlined
} from '@ant-design/icons';
import { GoShieldCheck } from 'react-icons/go';
import httpClient from '../../../../../utils/HttpClient';
import { CREATE_ROLES_URL, RIGHT_PERMISSIONS_URL, UPDATE_ROLES_URL } from '../../../../../constants/Url';
import { extractErrorMessage, groupRightsByCategory } from '../../../../../utils/Utils';
import _ from 'lodash';

const { Option } = Select;
const { TextArea } = Input;

function ToggleRolePermissionModal(props, ref) {
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
    const [record, setRecord] = useState(null);
    const [mode, setMode] = useState('create'); // 'create' or 'edit' or 'view'
    const [loading, setLoading] = useState(false);
    const [permissions, setPermissions] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    const fetchRight = useCallback(async () => {
        setLoading(true);
        try {
            const res = await httpClient.get(RIGHT_PERMISSIONS_URL).then(res => res.data)

            if (res.status === 200) {
                setPermissions(groupRightsByCategory(res.data));
            } else {
                setPermissions([]);
            }
        } catch (error) {
            setPermissions([]);
            console.error("Error fetching permissions:", error);
        } finally {
            setLoading(false);
        }
    }, [])

    const handleFinishForm = async (data) => {
        try {
            setLoading(true);
            if (mode === 'create') {
                // Handle create logic
                const res = await httpClient.post(CREATE_ROLES_URL, data).then(res => res.data)

                if (res.status === 200) {
                    message.success('Role created successfully!');
                    props.fetchData(); // Refresh data after creation
                    onClose();
                } else {
                    message.error(res.message || 'Failed to create Role');
                }
            } else if (mode === 'edit') {
                // Handle edit logic
                const res = await httpClient.put(UPDATE_ROLES_URL.replace(":id", record?._id), data).then(res => res.data)

                if (res.status === 200) {
                    message.success('Role updated successfully!');
                    props.fetchData(); // Refresh data after creation
                    onClose();
                } else {
                    message.error(res.message || 'Failed to update Role');
                }
            }
        } catch (error) {
            console.error("Error saving role:", error);
            message.error(extractErrorMessage(error) || 'Failed to save role. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    const onChangeCheckBoxValue = (event) => {
        if (event?.target?.checked) {
            setSelectedPermissions(pre => {
                const newSelected = _.uniq([...pre, event?.target.value])

                form.setFieldValue("associatedRights", newSelected)

                return [...newSelected]
            });
        } else {
            setSelectedPermissions(pre => {
                const newSelected = pre.filter(id => event?.target.value !== id)

                form.setFieldValue("associatedRights", newSelected)

                return [...newSelected]
            });
        }
    }

    const onChangeValueCategory = (e, category) => {
        const checked = e.target.checked;
        const ids = category.permissions.map(p => p._id);
        setSelectedPermissions(pre => {
            const updated = checked
                ? _.uniq([...pre, ...ids])
                : pre.filter(id => !ids.includes(id));
            form.setFieldValue('associatedRights', updated);
            return [...updated];
        });
    }

    const onClose = () => {
        setOpen(false);
        form.resetFields();
        setRecord(null);
        setSelectedPermissions([])
    };

    useImperativeHandle(ref, () => ({
        openModal: async (role, mode) => {
            setOpen(true);
            setRecord(role);
            setSelectedPermissions(role?.associatedRights || [])
            form.setFieldsValue({
                ...role
            });
            setMode(mode);
            if (permissions.length === 0) {
                await fetchRight();
            }
        },
        closeModal: onClose
    }));

    return (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {`${mode === "edit" ? "Edit" : mode === "view" ? "View" : "Create New"} Role`}
                </div>
            }
            open={open}
            onOk={() => form.submit()}
            onCancel={onClose}
            width={800}
            confirmLoading={loading}
            styles={{
                footer: {
                    display: mode === "view" ? "none" : "flex",
                    justifyContent: 'flex-end'
                }
            }}
            okText={`${mode === "edit" ? "Update" : mode === "view" ? "View" : "Create"} Role`}
            okButtonProps={{
                style: {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none'
                }
            }}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinishForm}
                initialValues={{ status: 'active', associatedRights: [] }}
            >
                <Form.Item
                    name="name"
                    label="Role Name"
                    rules={[{ required: true, message: 'Please enter role name' }]}
                >
                    <Input placeholder="Enter role name" prefix={<UserOutlined />} />
                </Form.Item>
                <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ required: true, message: 'Please enter description' }]}
                >
                    <TextArea rows={3} placeholder="Describe the role and its purpose" />
                </Form.Item>

                <Form.Item
                    name="status"
                    label="Status"
                >
                    <Select>
                        <Option value="active">Active</Option>
                        <Option value="inactive">Inactive</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="associatedRights"
                    label="Permissions"
                    initialValue={[]}
                    rules={[{ required: true, message: 'Please select at least one permission' }]}
                    noStyle
                >
                    <Select mode="multiple" className='d-none' />
                </Form.Item>

                {/* Checkbox UI styled like AntD input box */}
                <Form.Item label="Permissions" shouldUpdate required>
                    {({ getFieldError }) => {
                        const hasError = getFieldError('associatedRights')?.length > 0;
                        const borderColor = !hasError ? '#d9d9d9' : '#ff4d4f';

                        return (
                            <>
                                <div
                                    className={`ant-input ${hasError ? 'ant-input-status-error' : 'ant-input-status-normal'}`}
                                    style={{
                                        maxHeight: '300px',
                                        overflowY: 'auto',
                                        border: `1px solid ${borderColor}`,
                                        borderRadius: '6px',
                                        padding: '12px',
                                    }}
                                >
                                    {permissions.map((category) => (
                                        <div key={category.category}>

                                            <div
                                                className="d-flex align-items-center"
                                                style={{ width: '100%', gap: 12 }} // gap between label, line, and checkbox
                                            >
                                                {/* Left: Category label */}
                                                <span style={{ color: '#667eea', fontWeight: 600, whiteSpace: 'nowrap' }}>
                                                    {category.category}
                                                </span>

                                                {/* Middle: horizontal line that fills available space */}
                                                <div
                                                    style={{
                                                        flexGrow: 1,
                                                        height: 1,
                                                        backgroundColor: borderColor,
                                                        opacity: 0.6,
                                                        margin: "24px 8px"
                                                    }}
                                                />

                                                {/* Right: Select All checkbox */}
                                                <Checkbox
                                                    onChange={(e) => onChangeValueCategory(e, category)}
                                                    checked={category.permissions.every(p => selectedPermissions.includes(p._id))}
                                                    indeterminate={
                                                        category.permissions.some(p => selectedPermissions.includes(p._id)) &&
                                                        !category.permissions.every(p => selectedPermissions.includes(p._id))
                                                    }
                                                >
                                                    {category.permissions.every(p => selectedPermissions.includes(p._id))
                                                        ? 'Deselect All'
                                                        : 'Select All'}
                                                </Checkbox>

                                            </div>

                                            <Row>
                                                {category.permissions.map((perm) => (
                                                    <Col
                                                        span={12}
                                                        key={perm?._id}
                                                        style={{ marginBottom: '8px' }}
                                                    >
                                                        <Checkbox
                                                            value={perm?._id}
                                                            onChange={(event) => onChangeCheckBoxValue(event, category.permissions, category)}
                                                            checked={selectedPermissions?.includes(perm?._id)}
                                                        // indeterminate={selectedPermissions?.includes(perm?._id)}
                                                        >
                                                            {console.log(perm?._id, selectedPermissions, selectedPermissions?.includes(perm?._id))}
                                                            <span style={{ fontSize: '13px' }}>
                                                                {perm?.name?.split(':')[1]?.toUpperCase()}{' '}
                                                                {perm?.name?.split(':')[0]}
                                                            </span>
                                                        </Checkbox>
                                                    </Col>
                                                ))}
                                            </Row>
                                        </div>
                                    ))}
                                </div>

                                {/* Show error below the checkbox area */}
                                {hasError && (
                                    <div className="ant-form-item-explain-error" style={{ marginTop: 4 }}>
                                        {getFieldError('associatedRights')[0]}
                                    </div>
                                )}
                            </>
                        );
                    }}
                </Form.Item>
            </Form>
        </Modal>
    )
}


export default forwardRef(ToggleRolePermissionModal)