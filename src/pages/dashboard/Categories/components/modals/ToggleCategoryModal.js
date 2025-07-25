import React, { forwardRef, useImperativeHandle, useState } from 'react';
import {
    Modal,
    Form,
    Input,
    message,
    ColorPicker
} from 'antd';
import {
    FileTextOutlined,
    LinkOutlined,
} from '@ant-design/icons';
import { MdCategory } from 'react-icons/md';
import httpClient from '../../../../../utils/HttpClient';
import { CREATE_CATEGORIES_URL, UPDATE_CATEGORIES_URL } from '../../../../../constants/Url';

const { TextArea } = Input;


function ToggleCategoryModal(props, ref) {
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
                const res = await httpClient.post(CREATE_CATEGORIES_URL, data).then(res => res.data)

                if (res.status === 200) {
                    message.success('Category created successfully!');
                    props.fetchData(); // Refresh data after creation
                } else {
                    message.error(res.message || 'Failed to create Category');
                }
            } else if (mode === 'edit') {
                // Handle edit logic
                const res = await httpClient.put(UPDATE_CATEGORIES_URL.replace(":id", record?._id), data).then(res => res.data)

                if (res.status === 200) {
                    message.success('Category updated successfully!');
                    props.fetchData(); // Refresh data after creation
                } else {
                    message.error(res.message || 'Failed to update category');
                }
            }
        } catch (error) {
            console.error("Error saving category:", error);
            message.error('Failed to save category. Please try again.');
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
        openModal: (category, mode) => {
            setOpen(true);
            setRecord(category);
            form.setFieldsValue({
                ...category
            });
            setMode(mode);
        },
        closeModal: onClose
    }));
    return (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MdCategory style={{ color: '#667eea' }} />
                    {`${mode === "edit" ? "Edit" : mode === "view" ? "View" : "Create New"} Category`}
                </div>
            }
            open={open}
            onOk={() => form.submit()}
            onCancel={onClose}
            confirmLoading={loading}
            width={600}
            styles={{
                footer: {
                    display: mode === "view" ? "none" : "flex",
                    justifyContent: 'flex-end'
                }
            }}
            okText={`${mode === "edit" ? "Update" : mode === "view" ? "View" : "Create"} Category`}
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
                onFinish={handleFinishForm}
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
    )
}

export default forwardRef(ToggleCategoryModal)