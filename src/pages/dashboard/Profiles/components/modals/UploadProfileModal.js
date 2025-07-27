import { EnvironmentOutlined, MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Form, Input, message, Modal, Row } from 'antd';
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { extractErrorMessage } from '../../../../../utils/Utils';
import httpClient from '../../../../../utils/HttpClient';
import { UPDATE_PROFILE_URL } from '../../../../../constants/Url';
import { updateProfile } from '../../../../../global/slices/AuthSlice';
import UploadComponent from '../../../../../components/uploads/UploadComponent';

function UploadProfileModal(props, ref) {
    const [form] = Form.useForm();
    const { user } = useSelector(state => state.auth)
    const dispatch = useDispatch();
    const [avatar, setAvatar] = useState("");
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
            setAvatar(user?.avatar || "");
        },
        closeModal: () => onClose()
    }))
    return (
        <Modal
            title="Update Profile Picture"
            open={open}
            onCancel={onClose}
            footer={null}
            className="avatar-modal"
        >
            <div className="avatar-upload-section">
                <Avatar size={120} src={avatar} className="current-avatar" />
                <UploadComponent
                    onUploadSuccess={(value) => {
                        setAvatar(value);
                    }}
                />
                <p className="upload-hint">Recommended size: 400x400px, Max size: 2MB</p>
            </div>
            <div className="modal-actions justify-content-end d-flex gap-3">
                <Button onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    type="primary"
                    onClick={() => handleSave({ avatar: avatar })}
                    loading={loading}
                >
                    Save Changes
                </Button>
            </div>
        </Modal>
    )
}


export default forwardRef(UploadProfileModal)