import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import {
    Modal,
    Form,
    Input,
    InputNumber,
    DatePicker,
    Select,
    Button,
    Row,
    Col,
    Divider,
    message,
} from 'antd';
import dayjs from 'dayjs';
import httpClient from '../../../../../utils/HttpClient';
import { CREATE_PROMO_URL, UPDATE_PROMO_URL } from '../../../../../constants/Url';
import { extractErrorMessage } from '../../../../../utils/Utils';

const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

function TogglePromoCodeModal(props, ref) {
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState('create');
    const [record, setRecord] = useState(null);
    const [loading, setLoading] = useState(false);

    const onClose = () => {
        setOpen(false);
        form.resetFields();
        setRecord(null);
    };

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            const payload = {
                ...values,
                startDate: values.dateRange[0].toISOString(),
                endDate: values.dateRange[1].toISOString(),
            };
            delete payload.dateRange;

            let res;
            if (mode === 'create') {
                res = await httpClient.post(CREATE_PROMO_URL, payload).then(res => res.data);
            } else {
                res = await httpClient.put(UPDATE_PROMO_URL.replace(':id', record?._id), payload).then(res => res.data);
            }

            if (res.status === 200) {
                message.success(`Promo code ${mode === 'create' ? 'created' : 'updated'} successfully!`);
                props.fetchData?.();
                onClose();
            } else {
                message.error(res.message || 'Something went wrong');
            }
        } catch (error) {
            console.error(error);
            message.error(extractErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    useImperativeHandle(ref, () => ({
        openModal: (promoData, mode = 'create') => {
            setMode(mode);
            setOpen(true);
            if (promoData) {
                const preset = {
                    ...promoData,
                    dateRange: [dayjs(promoData.startDate), dayjs(promoData.endDate)],
                };
                form.setFieldsValue(preset);
                setRecord(promoData);
            } else {
                form.resetFields();
                setRecord(null);
            }
        },
        closeModal: onClose
    }));

    return (
        <Modal
            title={`${mode === 'edit' ? 'Edit' : 'Create'} Promo Code`}
            open={open}
            onCancel={onClose}
            width={700}
            footer={null}
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                style={{ marginTop: 20 }}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="promoCode" label="Code" rules={[{ required: true }]}>
                            <Input
                                placeholder="e.g. SUMMER25"
                                onKeyPress={(event) => {
                                    if (!/^[a-zA-Z0-9]$/.test(event.key)) {
                                        event.preventDefault();
                                    }
                                }}
                                onChange={(e) => {
                                    const sanitized = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
                                    form.setFieldsValue({ promoCode: sanitized.toUpperCase() });
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                            <Input placeholder="e.g. Summer Promo" />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                    <TextArea rows={3} />
                </Form.Item>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="discountType" label="Discount Type" rules={[{ required: true }]}>
                            <Select placeholder="Select type">
                                <Option value="percentage">Percentage</Option>
                                <Option value="fixed">Fixed Amount</Option>
                        </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="discountValue" label="Discount Value" rules={[{ required: true }]}>
                            <InputNumber min={0} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="minOrder" label="Minimum Order" rules={[{ required: true }]}>
                            <InputNumber min={0} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="maxUses" label="Max Uses" rules={[{ required: true }]}>
                            <InputNumber min={1} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item name="dateRange" label="Start - End Date" rules={[{ required: true }]}>
                    <RangePicker style={{ width: '100%' }} />
                </Form.Item>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                            <Select placeholder="Select status">
                                <Option value="active">Active</Option>
                                <Option value="inactive">Inactive</Option>
                                <Option value="expired">Expired</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="priority" label="Priority" rules={[{ required: true }]}>
                            <Select placeholder="Select priority">
                                <Option value="low">Low</Option>
                                <Option value="medium">Medium</Option>
                                <Option value="high">High</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Divider />

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            border: 'none'
                        }}
                    >
                        {mode === 'edit' ? 'Update' : 'Create'}
                    </Button>
                </div>
            </Form>
        </Modal>
    );
}

export default forwardRef(TogglePromoCodeModal);