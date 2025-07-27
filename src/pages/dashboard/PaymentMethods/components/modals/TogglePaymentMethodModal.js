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
    message
} from 'antd';
import httpClient from '../../../../../utils/HttpClient';
import { CREATE_PAYMENT_METHODS_URL, PAYMENT_METHODS_URL, UPDATE_PAYMENT_METHODS_URL } from '../../../../../constants/Url';
import { extractErrorMessage } from '../../../../../utils/Utils';

const { Option } = Select;
const { TextArea } = Input;

function TogglePaymentMethodModal(props, ref) {
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
    const [record, setRecord] = useState(null);
    const [mode, setMode] = useState('create'); // 'create' or 'edit' or 'view'
    const [loading, setLoading] = useState(false);

    const onClose = () => {
        setOpen(false);
        form.resetFields();
        setRecord(null);
    };

    const handleSubmit = async (data) => {
        try {
            setLoading(true);
            console.log("data =", data)
            if (mode === 'create') {
                // Handle create logic
                const res = await httpClient.post(CREATE_PAYMENT_METHODS_URL, data).then(res => res.data)

                if (res.status === 200) {
                    message.success('Role created successfully!');
                    props.fetchData(); // Refresh data after creation
                    onClose();
                } else {
                    message.error(res.message || 'Failed to create Role');
                }
            } else if (mode === 'edit') {
                // Handle edit logic
                const res = await httpClient.put(UPDATE_PAYMENT_METHODS_URL.replace(":id", record?._id), data).then(res => res.data)

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

    useImperativeHandle(ref, () => ({
        openModal: async (paymentMethods, mode) => {
            setOpen(true);
            setRecord(paymentMethods);
            form.setFieldsValue({ ...paymentMethods });
            setMode(mode);
        },
        closeModal: onClose
    }));

    return (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {`${mode === "edit" ? "Edit" : mode === "view" ? "View" : "Create New"} Payment Method`}
                </div>
            }
            open={open}
            onCancel={onClose}
            width={600}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                style={{ marginTop: '20px' }}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="name"
                            label="Payment Method Name"
                            rules={[{ required: true, message: 'Please enter payment method name' }]}
                        >
                            <Input placeholder="e.g., Credit Card, PayPal" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="provider"
                            label="Provider"
                            rules={[{ required: true, message: 'Please enter provider name' }]}
                        >
                            <Input placeholder="e.g., Stripe, PayPal, Square" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="type"
                            label="Payment Type"
                            rules={[{ required: true, message: 'Please select payment type' }]}
                        >
                            <Select placeholder="Select payment type">
                                <Option value="card">Credit/Debit Card</Option>
                                <Option value="bank">Bank Transfer</Option>
                                <Option value="wallet">Digital Wallet</Option>
                                <Option value="crypto">Cryptocurrency</Option>
                                <Option value="qr">QR Code</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="processingFee"
                            label="Processing Fee (%)"
                            rules={[{ required: true, message: 'Please enter processing fee' }]}
                        >
                            <Input type="number" min="0" max="100" step="0.1" />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ required: true, message: 'Please enter description' }]}
                >
                    <TextArea rows={3} placeholder="Brief description of the payment method" />
                </Form.Item>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="apiKey"
                            label="API Key / Identifier"
                        >
                            <Input.Password
                                placeholder="API key or merchant identifier"
                                autoComplete="new-password"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="supportedCurrencies"
                            label="Supported Currencies"
                            rules={[{ required: true, message: 'Please enter supported currencies' }]}
                        >
                            <Input placeholder="USD,EUR,GBP (comma separated)" />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="webhookUrl"
                    label="Webhook URL"
                >
                    <Input placeholder="https://api.example.com/webhook" />
                </Form.Item>

                <Form.Item
                    name="isActive"
                    label="Status"
                    valuePropName="checked"
                    initialValue={true}
                >
                    <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                </Form.Item>

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
                    >
                        {mode === "edit" ? 'Update' : 'Create'}
                    </Button>
                </div>
            </Form>
        </Modal>
    )
}


export default forwardRef(TogglePaymentMethodModal)