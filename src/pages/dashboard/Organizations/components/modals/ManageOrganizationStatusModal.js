import React, { forwardRef, useImperativeHandle } from 'react';
import { Modal, Avatar, Select, Form, Typography, message } from 'antd';
import httpClient from '../../../../../utils/HttpClient';
import { UPDATE_ORGANIZATIONS_URL } from '../../../../../constants/Url';

const { Option } = Select;
const { Text, Title } = Typography;

const ManageOrganizationStatusModal = (props, ref) => {
    const [form] = Form.useForm();
    const [open, setOpen] = React.useState(false);
    const [organization, setOrganization] = React.useState(null);
    const [loading, setLoading] = React.useState(false);

    const onClose = () => {
        setOpen(false);
        setOrganization(null);
        form.resetFields();
    }

    const handleFinish = async (values) => {
        try {
            setLoading(true);
            const updated = {
                isActive: values.isActive === 'true',
            };

            const res = await httpClient.put(UPDATE_ORGANIZATIONS_URL.replace(":id", organization._id), updated).then((res) => res.data);

            if (res.status === 200) {
                message.success(`Organization status updated successfully`);
                props.debounceFetchData();
                onClose();
            } else {
                message.error(`Failed to update organization status`);
            }
        } catch (error) {
            console.error("Error updating organization status:", error);
            message.error("Failed to update organization status");
        } finally {
            setLoading(false);
        }
    };

    useImperativeHandle(ref, () => ({
        openModal: (org) => {
            setOrganization({ ...org });
            form.setFieldsValue({ isActive: `${org.isActive}` });
            setOpen(true);
        },
        closeModal: () => onClose()
    }));

    return (
        <Modal
            title="Manage Organization Status"
            open={open}
            onCancel={onClose}
            onOk={() => form.submit()}
            okText="Save"
            confirmLoading={loading}
        >
            {organization && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                    <Avatar src={organization.logo} size={48}>
                        {organization.name?.charAt(0)}
                    </Avatar>
                    <div>
                        <Title level={5} style={{ margin: 0 }}>{organization.name}</Title>
                        <Text type="secondary">{organization.category}</Text>
                    </div>
                </div>
            )}

            <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={{ status: organization?.status }}>
                <Form.Item name="isActive" label="Status" rules={[{ required: true }]}>
                    <Select>
                        <Option value="true">Active</Option>
                        <Option value="false">Suspended</Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default forwardRef(ManageOrganizationStatusModal);