import { EnvironmentOutlined, MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, message, Modal, Row } from 'antd';
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { extractErrorMessage } from '../../../../../utils/Utils';
import httpClient from '../../../../../utils/HttpClient';
import { UPDATE_PROFILE_URL } from '../../../../../constants/Url';
import { updateProfile } from '../../../../../global/slices/AuthSlice';

const { TextArea } = Input;

function EditProfileModal(props, ref) {
    const [form] = Form.useForm();
    const { user } = useSelector(state => state.auth)
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const onClose = () => {
        setOpen(false)
    }

    const handleSave = async (data) => {
        try {
            setLoading(true);
            const res = await httpClient.put(UPDATE_PROFILE_URL, {
                ...data
            }).then(res => res.data)

            if (res.status === 200) {
                message.success("Profile Saved successfully");
                dispatch(updateProfile({ ...res?.data }));
                onClose()
            } else {
                message.error(res.error);
            }
        } catch (error) {
            message.error(extractErrorMessage(error));
        } finally {
            setLoading(false);
        }
    }

    useImperativeHandle(ref, () => ({
        openModal: () => {
            setOpen(true)
            form.setFieldsValue({
                ...user,
                name: [user.firstName, user?.lastName].join(" ")
            });
        },
        closeModal: () => onClose()
    }))

    return (
        <Modal
            title="Edit Profile"
            open={open}
            onCancel={onClose}
            footer={null}
            width={800}
            className="edit-profile-modal"
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={user}
                onFinish={handleSave}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Full Name" name="name" rules={[{ required: true }]}>
                            <Input prefix={<UserOutlined />} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
                            <Input prefix={<MailOutlined />} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Phone" name="phone">
                            <Input prefix={<PhoneOutlined />} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Location" name="location">
                            <Input prefix={<EnvironmentOutlined />} />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label="Bio" name="bio">
                            <TextArea rows={4} placeholder="Tell us about yourself..." />
                        </Form.Item>
                    </Col>
                </Row>
                <div className="modal-actions justify-content-end d-flex gap-3">
                    <Button onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                    >
                        Save Changes
                    </Button>
                </div>
            </Form>
        </Modal>

    )
}


export default forwardRef(EditProfileModal)