import { CloseOutlined } from '@ant-design/icons';
import { Button, Form, message, Modal, Select, Typography } from 'antd'
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import httpClient from '../../../../../utils/HttpClient';
import { UPDATE_ORGANIZATION_REQUESTS_URL } from '../../../../../constants/Url';

const { Text } = Typography;
const { Option } = Select;

const rejectionReasons = {
  'incomplete_documentation': {
    title: 'Incomplete Documentation',
    description: 'Required documentation or information is missing from your application.',
    details: 'Please ensure all required documents, certificates, and forms are properly submitted and complete.'
  },
  'verification_failed': {
    title: 'Verification Process Failed',
    description: 'We were unable to verify your organization\'s credentials or legal status.',
    details: 'Please provide valid business registration, tax documents, or other required verification materials.'
  },
  'insufficient_experience': {
    title: 'Insufficient Experience',
    description: 'Your organization does not meet our minimum experience requirements.',
    details: 'We require organizers to have demonstrable experience in event management or related fields.'
  },
  'policy_compliance': {
    title: 'Policy Compliance Issues',
    description: 'Your organization or application does not meet our platform policies.',
    details: 'Please review our organizer guidelines and ensure full compliance with all requirements.'
  },
  'financial_requirements': {
    title: 'Financial Requirements Not Met',
    description: 'Your organization does not meet our financial stability or insurance requirements.',
    details: 'Valid business insurance, financial statements, or bonding may be required for approval.'
  },
  'capacity_concerns': {
    title: 'Capacity and Resource Concerns',
    description: 'We have concerns about your organization\'s capacity to manage events effectively.',
    details: 'This may include staffing, technical capabilities, or operational infrastructure concerns.'
  },
  'reputation_issues': {
    title: 'Reputation or Background Issues',
    description: 'Background checks or reputation research raised concerns about your organization.',
    details: 'This decision is based on our due diligence process and platform safety requirements.'
  },
  'market_saturation': {
    title: 'Market Saturation',
    description: 'We currently have sufficient organizers in your category or geographic area.',
    details: 'We may reconsider your application when market conditions change or demand increases.'
  },
  'application_quality': {
    title: 'Application Quality Issues',
    description: 'Your application did not meet our quality standards or was incomplete.',
    details: 'Please provide more detailed information about your organization, experience, and event planning capabilities.'
  },
  'other': {
    title: 'Other Reason',
    description: 'Your application was rejected for reasons not covered by standard categories.',
    details: 'Please see additional notes below or contact support for more information.'
  }
};

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
            onClose();
          } else {
            message.error(`Failed to rejected ${record.organizationName}`);
          }
        } catch (error) {
          console.error("Error during action:", error);
          message.error(`Failed to rejected ${record.organizationName}`);
        } finally {
          setLoading(false);
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
              rules={[{ required: true, message: 'Please select a reason for rejection' }]}
            >
              <Select placeholder="Select a rejection reason">
                {Object.entries(rejectionReasons).map(([key, value]) => (
                  <Option key={key} value={key}>
                    {value.title}
                  </Option>
                ))}
              </Select>
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