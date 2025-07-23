import { CloseOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Modal, Typography } from 'antd'
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import httpClient from '../../../../../utils/HttpClient';
import { UPDATE_ORGANIZATION_REQUESTS_URL } from '../../../../../constants/Url';

const { Text } = Typography;
const { TextArea } = Input;

function RejectOrganizationModal(props, ref) {
  const { debounceFetchData } = props;
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [record, setRecord] = useState(null);

  const handleRejectSubmit = async (data) => {
    Modal.confirm({
      title: 'Reject Organization Request',
      content: `Are you sure you want to reject "${record.organizationName}"?`,
      okText: 'Ok',
      okType: 'primary',
      cancelText: 'Cancel',
      async onOk() {
        try {
          setLoading(true);

          const payload = {
            status: "rejected",
            reason: data.reason,
          }

          const res = await httpClient.put(UPDATE_ORGANIZATION_REQUESTS_URL.replace(":id", record?._id), payload).then((res) => res.data);

          if (res.status === 200) {
            debounceFetchData();
            message.success(`${record.organizationName} has been rejected successfully`);
          } else {
            message.error(`Failed to rejected ${record.organizationName}`);
          }
        } catch (error) {
          console.error("Error during action:", error);
          message.error(`Failed to rejected ${record.organizationName}`);
        } finally {
          setLoading(false);
          onClose();
        }
      },
    });
  }

  const onClose = () => {
    setOpen(false);
    setRecord(null);
    form.resetFields();
  }

  useImperativeHandle(ref, () => ({
    openModal: (record) => {
      setRecord(record);
      setOpen(true);
      form.resetFields();
    },
    closeModal: onClose
  }));

  return (
    <Modal
      title="Reject Organization Request"
      open={open}
      onCancel={onClose}
      width={500}
      footer={null}
    >
      <Form form={form} layout='vertical' onFinish={handleRejectSubmit}>
        {record && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <Text>You are about to reject the registration request for:</Text>
              <div style={{
                fontWeight: 'bold',
                fontSize: '16px',
                color: '#667eea',
                margin: '8px 0'
              }}>
                {record.organizationName}
              </div>
            </div>


            <Form.Item
              name="reason"
              label="Rejection Reason"
              rules={[{ required: true, message: 'Please provide a reason for rejection' }]}
            >
              <TextArea
                rows={4}
                placeholder="Please explain why this request is being rejected..."
              />
            </Form.Item>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <Button onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="primary"
                danger
                htmlType="submit"
                icon={<CloseOutlined />}
                loading={loading}
              >
                Reject Request
              </Button>
            </div>
          </div>
        )}
      </Form>
    </Modal>
  )
}

export default forwardRef(RejectOrganizationModal);