import React, { useState, forwardRef, useImperativeHandle } from 'react';
import {
    Button,
    Modal,
    Form,
    Input,
    Select,
    Switch,
    Row,
    Col,
    Divider,
    message,
    DatePicker,
    InputNumber,
    Card,
    Space,
    Tooltip,
    Typography,
    Image,
} from 'antd';
import {
    CalendarOutlined,
    BankOutlined,
    AppstoreOutlined,
    UserOutlined,
    DollarOutlined,
    // TicketOutlined,
    PlusOutlined,
    DeleteOutlined,
    InfoCircleOutlined,
    ShoppingCartOutlined,
    EnvironmentOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import httpClient from '../../../../../utils/HttpClient';
import { CREATE_EVENTS_URL, UPDATE_EVENTS_URL } from '../../../../../constants/Url';
import UploadComponent from '../../../../../components/uploads/UploadComponent';

const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;

function ToggleEventModal(props, ref) {
    const { organizations, categories, ticketTypes, fetchData } = props;
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
    const [record, setRecord] = useState(null);
    const [mode, setMode] = useState('create'); // 'create' or 'edit'
    const [loading, setLoading] = useState(false);

    const onClose = () => {
        setOpen(false);
        form.resetFields();
        setRecord(null);
    };

    const handleSubmit = async (data) => {
        try {
            setLoading(true);

            // Format the data according to your schema
            const payload = {
                title: data.title,
                description: data.description,
                organization: data.organization,
                category: data.category,
                imageUrl: data.imageUrl,
                location: data.location,
                ticketTypes: data.ticketTypes?.map(ticket => ({
                    ticketTypeId: ticket.ticketTypeId,
                    price: ticket.price,
                    quantity: ticket.quantity,
                    soldQuantity: mode === 'edit' ? (ticket.soldQuantity || 0) : 0,
                })) || [],
                isPurchasable: data.isPurchasable || false,
                disabledPurchase: {
                    unit: data.disabledPurchaseUnit || 'day',
                    value: data.disabledPurchaseValue || 0,
                },
                startDate: data.dateRange?.[0]?.toISOString(),
                endDate: data.dateRange?.[1]?.toISOString(),
            };

            console.log('Payload:', payload);

            if (mode === 'create') {
                // Mock API call for create
                const res = await httpClient.post(CREATE_EVENTS_URL, payload).then(res => res.data)

                if (res.status === 200) {
                    message.success('Event created successfully!');
                    fetchData();
                    onClose();
                } else {
                    message.error(res.message)
                }
            } else if (mode === 'edit') {
                // Mock API call for update
                const res = await httpClient.put(UPDATE_EVENTS_URL.replace(":id", record?._id), payload).then(res => res.data)

                if (res.status === 200) {
                    message.success('Event updated successfully!');
                    fetchData();
                    onClose();
                } else {
                    message.error(res.message)
                }
            }
        } catch (error) {
            console.error("Error saving event:", error);
            message.error('Failed to save event. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleUploadSuccess = (url) => {
        form.setFieldsValue({ imageUrl: url });
    };

    useImperativeHandle(ref, () => ({
        openModal: async (eventData, modalMode) => {
            setOpen(true);
            setRecord(eventData);
            setMode(modalMode);

            if (modalMode === 'edit') {
                // Populate form with existing data
                form.setFieldsValue({
                    title: eventData.title,
                    description: eventData.description,
                    organization: eventData.organization?._id,
                    category: eventData.category?._id,
                    imageUrl: eventData?.imageUrl,
                    location: eventData?.location,
                    ticketTypes: eventData.ticketTypes?.map(ticket => ({
                        ticketTypeId: ticket.ticketTypeId?._id,
                        price: ticket.price,
                        quantity: ticket.quantity,
                        soldQuantity: ticket.soldQuantity,
                    })) || [],
                    isPurchasable: eventData.isPurchasable,
                    disabledPurchaseUnit: eventData.disabledPurchase?.unit || 'day',
                    disabledPurchaseValue: eventData.disabledPurchase?.value || 0,
                    dateRange: eventData.startDate && eventData.endDate ? [
                        dayjs(eventData.startDate),
                        dayjs(eventData.endDate)
                    ] : null,
                });
            } else {
                // For create mode, set default values
                form.setFieldsValue({
                    isPurchasable: false,
                    disabledPurchaseUnit: 'day',
                    disabledPurchaseValue: 0,
                    ticketTypes: [],
                });
            }
        },
        closeModal: onClose
    }));

    return (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CalendarOutlined style={{ color: '#667eea' }} />
                    {`${mode === "edit" ? "Edit" : "Create New"} Event`}
                </div>
            }
            open={open}
            onCancel={onClose}
            width={900}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                style={{ marginTop: '20px' }}
            >
                {/* Basic Information */}
                <Card
                    title={
                        <Space>
                            <InfoCircleOutlined style={{ color: '#667eea' }} />
                            Basic Information
                        </Space>
                    }
                    size="small"
                    style={{ marginBottom: '20px' }}
                >
                    {/* Upload component */}
                    <Form.Item label="Image">
                        <UploadComponent onUploadSuccess={handleUploadSuccess} />
                    </Form.Item>

                    <Form.Item shouldUpdate={(prev, curr) => prev.imageUrl !== curr.imageUrl}>
                        {({ getFieldValue }) => {
                            const imageUrl = getFieldValue('imageUrl');
                            return imageUrl ? (
                                <Image
                                    width={150}
                                    src={imageUrl}
                                    alt="Image preview"
                                    style={{ marginBottom: 16, borderRadius: 8 }}
                                />
                            ) : null;
                        }}
                    </Form.Item>

                    {/* Hidden input for imageUrl */}
                    <Form.Item name="imageUrl" hidden>
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="title"
                        label="Event Title"
                        rules={[
                            { required: true, message: 'Please enter event title' },
                            { min: 3, message: 'Title must be at least 3 characters' },
                            { max: 200, message: 'Title cannot exceed 200 characters' }
                        ]}
                    >
                        <Input
                            prefix={<CalendarOutlined />}
                            placeholder="Enter event title"
                            showCount
                            maxLength={200}
                        />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Event Description"
                        rules={[
                            { required: true, message: 'Please enter event description' },
                            { min: 10, message: 'Description must be at least 10 characters' },
                            { max: 1000, message: 'Description cannot exceed 1000 characters' }
                        ]}
                    >
                        <TextArea
                            placeholder="Enter detailed event description"
                            rows={4}
                            showCount
                            maxLength={1000}
                        />
                    </Form.Item>

                    <Form.Item
                        name="location"
                        label="Event Location"
                        rules={[
                            { required: true, message: 'Please enter event location' },
                            { min: 3, message: 'Location must be at least 3 characters' },
                            { max: 200, message: 'Location cannot exceed 200 characters' }
                        ]}
                    >
                        <Input
                            prefix={<EnvironmentOutlined />}
                            placeholder="Enter event location"
                            showCount
                            maxLength={200}
                        />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="organization"
                                label="Organization"
                                rules={[{ required: true, message: 'Please select an organization' }]}
                            >
                                <Select
                                    placeholder="Select organization"
                                    suffixIcon={<BankOutlined />}
                                    showSearch
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {organizations?.map(org => (
                                        <Option key={org._id} value={org._id}>
                                            {org.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="category"
                                label="Category"
                                rules={[{ required: true, message: 'Please select a category' }]}
                            >
                                <Select
                                    placeholder="Select category"
                                    suffixIcon={<AppstoreOutlined />}
                                    showSearch
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {categories?.map(category => (
                                        <Option key={category._id} value={category._id}>
                                            {category.title}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>

                {/* Date & Time */}
                <Card
                    title={
                        <Space>
                            <CalendarOutlined style={{ color: '#52c41a' }} />
                            Date & Time
                        </Space>
                    }
                    size="small"
                    style={{ marginBottom: '20px' }}
                >
                    <Form.Item
                        name="dateRange"
                        label="Event Duration"
                        rules={[
                            { required: true, message: 'Please select event start and end dates' },
                            {
                                validator: (_, value) => {
                                    if (value && value[0] && value[1]) {
                                        if (value[0].isBefore(dayjs())) {
                                            return Promise.reject(new Error('Start date cannot be in the past'));
                                        }
                                        if (value[1].isBefore(value[0])) {
                                            return Promise.reject(new Error('End date must be after start date'));
                                        }
                                    }
                                    return Promise.resolve();
                                }
                            }
                        ]}
                    >
                        <DatePicker.RangePicker
                            showTime
                            format="YYYY-MM-DD HH:mm"
                            placeholder={['Start Date & Time', 'End Date & Time']}
                            style={{ width: '100%' }}
                            disabledDate={(current) => {
                                return current && current < dayjs().startOf('day');
                            }}
                        />
                    </Form.Item>
                </Card>

                {/* Purchase Settings */}
                <Card
                    title={
                        <Space>
                            <ShoppingCartOutlined style={{ color: '#faad14' }} />
                            Purchase Settings
                        </Space>
                    }
                    size="small"
                    style={{ marginBottom: '20px' }}
                >
                    <Form.Item
                        name="isPurchasable"
                        label="Enable Ticket Purchase"
                        valuePropName="checked"
                        tooltip="Allow users to purchase tickets for this event"
                    >
                        <Switch
                            checkedChildren="Enabled"
                            unCheckedChildren="Disabled"
                        />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="disabledPurchaseValue"
                                label="Disable Purchase Before Event"
                                tooltip="Stop ticket sales X time units before the event starts"
                            >
                                <InputNumber
                                    min={0}
                                    placeholder="Enter value"
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="disabledPurchaseUnit"
                                label="Time Unit"
                            >
                                <Select defaultValue="day">
                                    <Option value="minute">Minutes</Option>
                                    <Option value="hour">Hours</Option>
                                    <Option value="day">Days</Option>
                                    <Option value="week">Weeks</Option>
                                    <Option value="month">Months</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>

                {/* Ticket Types */}
                <Card
                    title={
                        <Space>
                            {/* <TicketOutlined style={{ color: '#667eea' }} /> */}
                            Ticket Types
                        </Space>
                    }
                    size="small"
                    style={{ marginBottom: '20px' }}
                >
                    <Form.List name="ticketTypes">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Card
                                        key={key}
                                        size="small"
                                        style={{
                                            marginBottom: '12px',
                                            border: '1px solid rgba(102, 126, 234, 0.2)'
                                        }}
                                        title={
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Text strong>Ticket Type #{name + 1}</Text>
                                                <Button
                                                    type="text"
                                                    danger
                                                    icon={<DeleteOutlined />}
                                                    onClick={() => remove(name)}
                                                    size="small"
                                                />
                                            </div>
                                        }
                                    >
                                        <Row gutter={16}>
                                            <Col span={12}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'ticketTypeId']}
                                                    label="Ticket Type"
                                                    rules={[{ required: true, message: 'Please select ticket type' }]}
                                                >
                                                    <Select
                                                        placeholder="Select ticket type"
                                                    // suffixIcon={<TicketOutlined />}
                                                    >
                                                        {ticketTypes?.map(type => (
                                                            <Option key={type._id} value={type._id}>
                                                                {type.title}
                                                            </Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'price']}
                                                    label="Price ($)"
                                                    rules={[
                                                        { required: true, message: 'Please enter price' },
                                                        { type: 'number', min: 0, message: 'Price must be positive' }
                                                    ]}
                                                >
                                                    <InputNumber
                                                        prefix={<DollarOutlined />}
                                                        placeholder="0.00"
                                                        min={0}
                                                        precision={2}
                                                        style={{ width: '100%' }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row gutter={16}>
                                            <Col span={12}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'quantity']}
                                                    label="Total Quantity"
                                                    rules={[
                                                        { required: true, message: 'Please enter quantity' },
                                                        { type: 'number', min: 1, message: 'Quantity must be at least 1' }
                                                    ]}
                                                >
                                                    <InputNumber
                                                        placeholder="Enter quantity"
                                                        min={1}
                                                        style={{ width: '100%' }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            {mode === 'edit' && (
                                                <Col span={12}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'soldQuantity']}
                                                        label="Sold Quantity"
                                                        tooltip="Number of tickets already sold (read-only in edit mode)"
                                                    >
                                                        <InputNumber
                                                            placeholder="Sold quantity"
                                                            min={0}
                                                            style={{ width: '100%' }}
                                                            disabled
                                                        />
                                                    </Form.Item>
                                                </Col>
                                            )}
                                        </Row>
                                    </Card>
                                ))}
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    block
                                    icon={<PlusOutlined />}
                                    style={{
                                        borderColor: '#667eea',
                                        color: '#667eea'
                                    }}
                                >
                                    Add Ticket Type
                                </Button>
                            </>
                        )}
                    </Form.List>
                </Card>

                <Divider />

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <Button onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            border: 'none'
                        }}
                        loading={loading}
                    >
                        {mode === "edit" ? 'Update Event' : 'Create Event'}
                    </Button>
                </div>
            </Form>
        </Modal>
    );
}

export default forwardRef(ToggleEventModal);