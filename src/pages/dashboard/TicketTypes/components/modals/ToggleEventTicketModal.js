import React, { forwardRef, useImperativeHandle, useState } from 'react';
import {
    Modal,
    Form,
    Input,
    message,
} from 'antd';
import {
    FileTextOutlined
} from '@ant-design/icons';
import { TiTicket } from 'react-icons/ti';
import httpClient from '../../../../../utils/HttpClient';
import { CREATE_TICKET_TYPES_URL, UPDATE_TICKET_TYPES_URL } from '../../../../../constants/Url';

const { TextArea } = Input;

function ToggleEventTicketModal(props, ref) {
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
    const [record, setRecord] = useState(null);
    const [mode, setMode] = useState('create'); // 'create' or 'edit' or 'view'
    const [loading, setLoading] = useState(false);

    const handleFinishForm = async (data) => {
        try {
            setLoading(true);
            if (mode === 'create') {
                // Handle create logic
                const res = await httpClient.post(CREATE_TICKET_TYPES_URL, data).then(res => res.data)

                if (res.status === 200) {
                    message.success('Ticket Type created successfully!');
                    props.fetchData(); // Refresh data after creation
                } else {
                    message.error(res.message || 'Failed to create ticket type');
                }
            } else if (mode === 'edit') {
                // Handle edit logic
                const res = await httpClient.put(UPDATE_TICKET_TYPES_URL.replace(":id", record?._id), data).then(res => res.data)

                if (res.status === 200) {
                    message.success('Ticket Type updated successfully!');
                    props.fetchData(); // Refresh data after creation
                } else {
                    message.error(res.message || 'Failed to update ticket type');
                }
            }
        } catch (error) {
            console.error("Error saving ticket type:", error);
            message.error('Failed to save ticket type. Please try again.');
        } finally {
            setLoading(false);
            onClose();
        }
    }

    const onClose = () => {
        setOpen(false);
        form.resetFields();
        setRecord(null);
    };

    useImperativeHandle(ref, () => ({
        openModal: (ticketType, mode) => {
            setOpen(true);
            setRecord(ticketType);
            form.setFieldsValue({
                title: ticketType ? ticketType.title : '',
                description: ticketType ? ticketType.description : ''
            });
            setMode(mode);
        },
        closeModal: onClose
    }));
    return (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <TiTicket style={{ color: '#667eea' }} />
                    {`${mode === "edit" ? "Edit" : mode === "view" ? "View" : "Create New"} Ticket Type`}
                </div>
            }
            open={open}
            onOk={() => form.submit()}
            onCancel={onClose}
            width={600}
            styles={{
                footer: {
                    display: mode === "view" ? "none" : "flex",
                    justifyContent: 'flex-end'
                }
            }}
            okText={`${mode === "edit" ? "Update" : mode === "view" ? "View" : "Create"} Ticket Type`}
            okButtonProps={{
                style: {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none'
                }
            }}
            confirmLoading={loading}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinishForm}
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
                        readOnly={mode === 'view'}
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
                        readOnly={mode === 'view'}
                    />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default forwardRef(ToggleEventTicketModal);