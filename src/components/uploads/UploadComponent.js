import React, { useState } from 'react';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { UPLOAD_FILE } from '../../constants/Url';
import { useSelector } from 'react-redux';

const UploadComponent = ({ onUploadSuccess }) => {
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  const uploadProps = {
    name: 'file',
    action: process.env.REACT_APP_API_ENDPOINT + UPLOAD_FILE, // Replace with your upload endpoint
    accept: 'image/*',
    headers: {
      Authorization: token, // or sessionStorage
    },
    showUploadList: false, // Hide the default file list display
    onChange(info) {
      const { status } = info.file;
      if (status === 'uploading') {
        setLoading(true);
      }
      if (status === 'done') {
        setLoading(false);
        message.success(`${info.file.name} file uploaded successfully.`);
        // The response should include the file URL.
        const imageUrl = info.file.response?.url;
        if (onUploadSuccess && imageUrl) {
          onUploadSuccess(imageUrl);
        }
      } else if (status === 'error') {
        setLoading(false);
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  return (
    <Upload {...uploadProps}>
      <Button icon={<UploadOutlined />} loading={loading}>
        Click to Upload Image
      </Button>
    </Upload>
  );
};

export default UploadComponent;
