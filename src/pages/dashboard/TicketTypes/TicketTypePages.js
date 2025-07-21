import React, { useState } from 'react';
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Space,
    Popconfirm,
    message,
    Card,
    Row,
    Col,
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
    FileTextOutlined
} from '@ant-design/icons';
import { TiTicket } from 'react-icons/ti';
import dayjs from 'dayjs';

const { TextArea } = Input;

const TicketTypePage = () => {
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

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentTicketType, setCurrentTicketType] = useState(null);
    const [form] = Form.useForm();

    const showModal = (ticketType = null) => {
        setCurrentTicketType(ticketType);
        setIsModalVisible(true);
        if (ticketType) {
            form.setFieldsValue({
                title: ticketType.title,
                description: ticketType.description
            });
        } else {
            form.resetFields();
        }
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const currentTime = dayjs().tz('Asia/Phnom_Penh').format();

            if (currentTicketType) {
                // Update existing ticket type
                setTicketTypes(prev => prev.map(type =>
                    type.id === currentTicketType.id
                        ? { ...type, ...values, updatedAt: currentTime }
                        : type
                ));
                message.success('Ticket type updated successfully!');
            } else {
                // Create new ticket type
                const newTicketType = {
                    id: Date.now(),
                    ...values,
                    createdAt: currentTime,
                    updatedAt: null
                };
                setTicketTypes(prev => [...prev, newTicketType]);
                message.success('Ticket type created successfully!');
            }

            setIsModalVisible(false);
            form.resetFields();
            setCurrentTicketType(null);
        } catch (error) {
            message.error('Please fill in all required fields');
        }
    };

    const handleDelete = (id) => {
        setTicketTypes(prev => prev.filter(type => type.id !== id));
        message.success('Ticket type deleted successfully!');
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Never';
        return dayjs(dateString).tz('Asia/Phnom_Penh').format('MMM DD, YYYY HH:mm');
    };

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
                            onClick={() => showModal(record)}
                            style={{ color: '#667eea' }}
                        />
                    </Tooltip>
                    <Tooltip title="Edit Ticket Type">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => showModal(record)}
                            style={{ color: '#52c41a' }}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Delete Ticket Type"
                        description="Are you sure you want to delete this ticket type?"
                        onConfirm={() => handleDelete(record.id)}
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

    const renderTicketTypeModal = () => (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <TiTicket style={{ color: '#667eea' }} />
                    {currentTicketType ? 'Edit Ticket Type' : 'Create New Ticket Type'}
                </div>
            }
            open={isModalVisible}
            onOk={handleSubmit}
            onCancel={() => {
                setIsModalVisible(false);
                form.resetFields();
                setCurrentTicketType(null);
            }}
            width={600}
            okText={currentTicketType ? 'Update Ticket Type' : 'Create Ticket Type'}
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
                initialValues={{}}
            >
                <Form.Item
                    name="title"
                    label="Ticket Type Title"
                    rules={[
                        { required: true, message: 'Please enter ticket type title' },
                        { min: 3, message: 'Title must be at least 3 characters' },
                        { max: 100, message: 'Title cannot exceed 100 characters' }
                    ]}
                >
                    <Input
                        placeholder="Enter ticket type title"
                        prefix={<FileTextOutlined />}
                        showCount
                        maxLength={100}
                    />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Description"
                    rules={[
                        { required: true, message: 'Please enter description' },
                        { min: 10, message: 'Description must be at least 10 characters' },
                        { max: 500, message: 'Description cannot exceed 500 characters' }
                    ]}
                >
                    <TextArea
                        rows={4}
                        placeholder="Describe the ticket type and its features"
                        showCount
                        maxLength={500}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );

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
                        onClick={() => showModal()}
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
                            count={ticketTypes.length}
                            style={{ backgroundColor: '#667eea' }}
                            showZero
                        >
                            <span style={{ marginRight: '8px', fontWeight: 500 }}>Total Ticket Types</span>
                        </Badge>
                    </div>

                    <Table
                        columns={columns}
                        dataSource={ticketTypes}
                        rowKey="id"
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) =>
                                `${range[0]}-${range[1]} of ${total} ticket types`,
                        }}
                    />
                </Card>
            </div>
            {renderTicketTypeModal()}
        </div>
    );
};

export default TicketTypePage;