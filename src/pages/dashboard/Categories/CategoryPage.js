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
    Tag,
    Tooltip,
    Avatar,
    Badge,
    ColorPicker
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    FileTextOutlined,
    LinkOutlined,
} from '@ant-design/icons';
import { MdCategory } from 'react-icons/md';
import dayjs from 'dayjs';

const { TextArea } = Input;

const CategoryPage = () => {
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

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [form] = Form.useForm();

    const showModal = (category = null) => {
        setCurrentCategory(category);
        setIsModalVisible(true);
        if (category) {
            form.setFieldsValue({
                title: category.title,
                description: category.description,
                iconUrl: category.iconUrl,
                color: category.color
            });
        } else {
            form.resetFields();
        }
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const currentTime = dayjs().tz('Asia/Phnom_Penh').format();

            if (currentCategory) {
                // Update existing category
                setCategories(prev => prev.map(cat =>
                    cat.id === currentCategory.id
                        ? { ...cat, ...values, updatedAt: currentTime }
                        : cat
                ));
                message.success('Category updated successfully!');
            } else {
                // Create new category
                const newCategory = {
                    id: Date.now(),
                    ...values,
                    createdAt: currentTime,
                    updatedAt: null
                };
                setCategories(prev => [...prev, newCategory]);
                message.success('Category created successfully!');
            }

            setIsModalVisible(false);
            form.resetFields();
            setCurrentCategory(null);
        } catch (error) {
            message.error('Please fill in all required fields');
        }
    };

    const handleDelete = (id) => {
        setCategories(prev => prev.filter(cat => cat.id !== id));
        message.success('Category deleted successfully!');
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Never';
        return dayjs(dateString).tz('Asia/Phnom_Penh').format('MMM DD, YYYY HH:mm');
    };

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
                            onClick={() => showModal(record)}
                            style={{ color: '#667eea' }}
                        />
                    </Tooltip>
                    <Tooltip title="Edit Category">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => showModal(record)}
                            style={{ color: '#52c41a' }}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Delete Category"
                        description="Are you sure you want to delete this category?"
                        onConfirm={() => handleDelete(record.id)}
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

    const renderCategoryModal = () => (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MdCategory style={{ color: '#667eea' }} />
                    {currentCategory ? 'Edit Category' : 'Create New Category'}
                </div>
            }
            open={isModalVisible}
            onOk={handleSubmit}
            onCancel={() => {
                setIsModalVisible(false);
                form.resetFields();
                setCurrentCategory(null);
            }}
            width={600}
            okText={currentCategory ? 'Update Category' : 'Create Category'}
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
                    label="Category Title"
                    rules={[
                        { required: true, message: 'Please enter category title' },
                        { min: 3, message: 'Title must be at least 3 characters' },
                        { max: 50, message: 'Title cannot exceed 50 characters' }
                    ]}
                >
                    <Input 
                        placeholder="Enter category title" 
                        prefix={<FileTextOutlined />}
                        showCount
                        maxLength={50}
                    />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Description"
                    rules={[
                        { required: true, message: 'Please enter description' },
                        { min: 10, message: 'Description must be at least 10 characters' },
                        { max: 200, message: 'Description cannot exceed 200 characters' }
                    ]}
                >
                    <TextArea 
                        rows={3} 
                        placeholder="Describe the category and its purpose"
                        showCount
                        maxLength={200}
                    />
                </Form.Item>

                <Form.Item
                    name="iconUrl"
                    label="Icon URL"
                    rules={[
                        { required: true, message: 'Please enter icon URL' },
                        { type: 'url', message: 'Please enter a valid URL' }
                    ]}
                >
                    <Input 
                        placeholder="https://example.com/icon.svg" 
                        prefix={<LinkOutlined />}
                    />
                </Form.Item>

                <Form.Item
                    name="color"
                    label="Category Color"
                    rules={[
                        { required: true, message: 'Please select a color' }
                    ]}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <ColorPicker 
                            format="hex"
                            showText
                            onChange={(color) => {
                                form.setFieldsValue({ color: color.toHexString() });
                            }}
                        />
                        <span style={{ fontSize: '12px', color: '#64748b' }}>
                            Click to choose a color for this category
                        </span>
                    </div>
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
                        <h3 style={{ margin: 0, color: '#667eea' }}>Category Management</h3>
                        <p style={{ margin: '4px 0 0 0', color: '#64748b' }}>
                            Organize your events into different categories
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
                        columns={columns}
                        dataSource={categories}
                        rowKey="id"
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) =>
                                `${range[0]}-${range[1]} of ${total} categories`,
                        }}
                    />
                </Card>
            </div>
            {renderCategoryModal()}
        </div>
    );
};

export default CategoryPage;