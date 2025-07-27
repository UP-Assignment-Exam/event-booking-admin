
import React, { useState } from 'react';
import {
  Card,
  List,
  Typography,
  Tag,
  Space,
  Divider,
  Empty,
  Row,
  Col,
  Statistic,
  Input,
  Select,
  Tabs,
  Modal,
  message,
  Button,
  Tooltip,
  Avatar,
  Progress,
  Descriptions
} from 'antd';
import {
  GiftOutlined,
  CopyOutlined,
  CheckOutlined,
  ExclamationCircleOutlined,
  PercentageOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  ClearOutlined,
  ReloadOutlined,
  EyeOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ShareAltOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

// Mock promo code data
const mockPromoCodes = [
  {
    id: 1,
    code: 'SAVE20',
    title: '20% Off Everything',
    description: 'Get 20% discount on all products. Perfect for new customers!',
    discountType: 'percentage',
    discountValue: 20,
    minOrder: 50,
    maxUses: 1000,
    currentUses: 245,
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2025-08-31T23:59:59Z',
    status: 'active',
    category: 'general',
    priority: 'high',
    creator: {
      name: 'Marketing Team',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marketing'
    }
  },
  {
    id: 2,
    code: 'WELCOME10',
    title: 'Welcome Bonus',
    description: '$10 off for new customers. Welcome to our store!',
    discountType: 'fixed',
    discountValue: 10,
    minOrder: 25,
    maxUses: 500,
    currentUses: 127,
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2025-12-31T23:59:59Z',
    status: 'active',
    category: 'welcome',
    priority: 'medium',
    creator: {
      name: 'Sales Team',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sales'
    }
  },
  {
    id: 3,
    code: 'FLASH50',
    title: 'Flash Sale Special',
    description: '50% discount for limited time. Hurry up, only few hours left!',
    discountType: 'percentage',
    discountValue: 50,
    minOrder: 100,
    maxUses: 200,
    currentUses: 189,
    startDate: '2024-01-15T00:00:00Z',
    endDate: '2025-07-30T23:59:59Z',
    status: 'active',
    category: 'flash',
    priority: 'critical',
    creator: {
      name: 'Event Manager',
      avatar: null
    }
  },
  {
    id: 4,
    code: 'EXPIRED15',
    title: '15% Student Discount',
    description: 'Special discount for students. Show your student ID.',
    discountType: 'percentage',
    discountValue: 15,
    minOrder: 30,
    maxUses: 300,
    currentUses: 300,
    startDate: '2023-09-01T00:00:00Z',
    endDate: '2024-01-31T23:59:59Z',
    status: 'expired',
    category: 'student',
    priority: 'low',
    creator: {
      name: 'Admin',
      avatar: null
    }
  },
  {
    id: 5,
    code: 'VIP25',
    title: 'VIP Member Exclusive',
    description: '25% off for VIP members only. Exclusive access!',
    discountType: 'percentage',
    discountValue: 25,
    minOrder: 200,
    maxUses: 100,
    currentUses: 45,
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2025-12-31T23:59:59Z',
    status: 'active',
    category: 'vip',
    priority: 'high',
    creator: {
      name: 'VIP Manager',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vip'
    }
  },
  {
    id: 6,
    code: 'INACTIVE5',
    title: '5% First Order',
    description: 'Small discount for first-time buyers.',
    discountType: 'percentage',
    discountValue: 5,
    minOrder: 10,
    maxUses: 1000,
    currentUses: 0,
    startDate: '2024-02-01T00:00:00Z',
    endDate: '2025-02-01T23:59:59Z',
    status: 'inactive',
    category: 'first-order',
    priority: 'low',
    creator: {
      name: 'System',
      avatar: null
    }
  }
];

export default function PromocodePage() {
  const [promoCodes, setPromoCodes] = useState(mockPromoCodes);
  const [selectedPromoCode, setSelectedPromoCode] = useState(null);
  const [copiedCode, setCopiedCode] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('all');

  // Get promo code statistics
  const promoStats = {
    total: promoCodes.length,
    active: promoCodes.filter(p => p.status === 'active').length,
    expired: promoCodes.filter(p => p.status === 'expired').length,
    nearExpiry: promoCodes.filter(p => {
      const endDate = new Date(p.endDate);
      const now = new Date();
      const diffDays = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
      return diffDays <= 7 && diffDays > 0;
    }).length
  };

  // Get discount icon based on type
  const getDiscountIcon = (type) => {
    return type === 'percentage' ?
      <PercentageOutlined style={{ color: '#52c41a' }} /> :
      <DollarOutlined style={{ color: '#1890ff' }} />;
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      active: '#52c41a',
      inactive: '#faad14',
      expired: '#ff4d4f'
    };
    return colors[status] || colors.active;
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    const colors = {
      critical: '#ff4d4f',
      high: '#fa8c16',
      medium: '#1890ff',
      low: '#52c41a'
    };
    return colors[priority] || colors.medium;
  };

  // Check if promo code is expiring soon
  const isExpiringSoon = (endDate) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffDays = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0;
  };

  // Format discount display
  const formatDiscount = (promoCode) => {
    return promoCode.discountType === 'percentage'
      ? `${promoCode.discountValue}% OFF`
      : `$${promoCode.discountValue} OFF`;
  };

  // Copy promo code to clipboard
  const copyPromoCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      message.success(`Copied "${code}" to clipboard!`);
      setTimeout(() => setCopiedCode(''), 2000);
    } catch (err) {
      message.error('Failed to copy promo code');
    }
  };

  // Format timestamp
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Toggle promo code status
  const toggleStatus = (promoCodeId) => {
    setPromoCodes(prev =>
      prev.map(p => p.id === promoCodeId ?
        { ...p, status: p.status === 'active' ? 'inactive' : 'active' } : p
      )
    );
    message.success('Promo code status updated');
  };

  // Delete promo code
  const deletePromoCode = (promoCodeId) => {
    setPromoCodes(prev => prev.filter(p => p.id !== promoCodeId));
    message.success('Promo code deleted');
  };

  // Clear all expired codes
  const clearExpiredCodes = () => {
    Modal.confirm({
      title: 'Clear Expired Codes',
      content: 'Are you sure you want to delete all expired promo codes? This action cannot be undone.',
      onOk: () => {
        setPromoCodes(prev => prev.filter(p => p.status !== 'expired'));
        message.success('All expired promo codes cleared');
      }
    });
  };

  // Filter promo codes
  const filteredPromoCodes = promoCodes.filter(promoCode => {
    const matchesSearch = promoCode.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promoCode.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promoCode.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || promoCode.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || promoCode.category === filterCategory;
    const matchesTab = activeTab === 'all' ||
      (activeTab === 'active' && promoCode.status === 'active') ||
      (activeTab === 'expired' && promoCode.status === 'expired') ||
      (activeTab === 'expiring' && isExpiringSoon(promoCode.endDate));

    return matchesSearch && matchesStatus && matchesCategory && matchesTab;
  });

  // Calculate usage percentage
  const getUsagePercentage = (current, max) => {
    return Math.round((current / max) * 100);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <div>
            <h3 style={{ margin: 0, color: '#667eea' }}>Promo Code</h3>
            <p style={{ margin: '4px 0 0 0', color: '#64748b' }}>
              View and manage your available promo codes.
            </p>
          </div>
          <Space>
            <Button icon={<PlusOutlined />} type="primary" size="large">
              Create New
            </Button>
            <Button icon={<ReloadOutlined />} onClick={() => message.success('Promo codes refreshed')}>
              Refresh
            </Button>
            <Button icon={<ClearOutlined />} danger onClick={clearExpiredCodes}>
              Clear Expired
            </Button>
          </Space>
        </div>

        {/* Statistics Cards */}
        <Row gutter={16} style={{ marginBottom: '24px' }}>
          <Col xs={6}>
            <Card style={{ background: 'rgba(24, 144, 255, 0.02)', backdropFilter: 'blur(10px)' }}>
              <Statistic
                title="Total Codes"
                value={promoStats.total}
                prefix={<GiftOutlined style={{ color: '#667eea' }} />}
                valueStyle={{ color: '#667eea' }}
              />
            </Card>
          </Col>
          <Col xs={6}>
            <Card style={{ background: 'rgba(24, 144, 255, 0.02)', backdropFilter: 'blur(10px)' }}>
              <Statistic
                title="Active"
                value={promoStats.active}
                valueStyle={{ color: '#52c41a' }}
                prefix={<CheckOutlined style={{ color: '#52c41a' }} />}
              />
            </Card>
          </Col>
          <Col xs={6}>
            <Card style={{ background: 'rgba(24, 144, 255, 0.02)', backdropFilter: 'blur(10px)' }}>
              <Statistic
                title="Expiring Soon"
                value={promoStats.nearExpiry}
                valueStyle={{ color: '#faad14' }}
                prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
              />
            </Card>
          </Col>
          <Col xs={6}>
            <Card style={{ background: 'rgba(24, 144, 255, 0.02)', backdropFilter: 'blur(10px)' }}>
              <Statistic
                title="Expired"
                value={promoStats.expired}
                valueStyle={{ color: '#ff4d4f' }}
                prefix={<ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />}
              />
            </Card>
          </Col>
        </Row>

        {/* Filters */}
        <Card style={{ marginBottom: '24px', background: 'rgba(24, 144, 255, 0.02)', backdropFilter: 'blur(10px)' }}>
          <Row gutter={16} align="middle">
            <Col xs={24} sm={8}>
              <Search
                placeholder="Search promo codes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%' }}
                size="large"
              />
            </Col>
            <Col xs={12} sm={4}>
              <Select
                placeholder="Status"
                value={filterStatus}
                onChange={setFilterStatus}
                style={{ width: '100%' }}
                size="large"
              >
                <Option value="all">All Status</Option>
                <Option value="active">Active</Option>
                <Option value="inactive">Inactive</Option>
                <Option value="expired">Expired</Option>
              </Select>
            </Col>
            <Col xs={12} sm={4}>
              <Select
                placeholder="Category"
                value={filterCategory}
                onChange={setFilterCategory}
                style={{ width: '100%' }}
                size="large"
              >
                <Option value="all">All Categories</Option>
                <Option value="general">General</Option>
                <Option value="welcome">Welcome</Option>
                <Option value="flash">Flash Sale</Option>
                <Option value="student">Student</Option>
                <Option value="vip">VIP</Option>
                <Option value="first-order">First Order</Option>
              </Select>
            </Col>
          </Row>
        </Card>
      </div>

      {/* Promo Code Tabs */}
      <Card style={{ marginBottom: '16px', background: 'rgba(24, 144, 255, 0.02)', backdropFilter: 'blur(10px)' }}>
        <Tabs activeKey={activeTab} onChange={setActiveTab} size="large">
          <TabPane tab={`All Codes (${promoCodes.length})`} key="all" />
          <TabPane tab={`Active (${promoStats.active})`} key="active" />
          <TabPane tab={`Expiring Soon (${promoStats.nearExpiry})`} key="expiring" />
          <TabPane tab="Expired" key="expired" />
        </Tabs>
      </Card>

      {/* Promo Codes List */}
      {filteredPromoCodes.length === 0 ? (
        <Card style={{ background: 'rgba(24, 144, 255, 0.02)', backdropFilter: 'blur(10px)' }}>
          <Empty description="No promo codes found" />
        </Card>
      ) : (
        <List
          itemLayout="vertical"
          dataSource={filteredPromoCodes}
          pagination={{
            pageSize: 8,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} promo codes`
          }}
          renderItem={(promoCode) => {
            const usagePercent = getUsagePercentage(promoCode.currentUses, promoCode.maxUses);
            const expiringSoon = isExpiringSoon(promoCode.endDate);

            return (
              <Card
                style={{
                  marginBottom: '16px',
                  background: 'rgba(24, 144, 255, 0.02)',
                  backdropFilter: 'blur(10px)',
                  border: expiringSoon ? '2px solid #faad14' : promoCode.status === 'active' ? '2px solid #52c41a' : '1px solid #d9d9d9',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}
              >
                <List.Item
                  actions={[
                    <Tooltip title="Copy Code">
                      <Button
                        type="primary"
                        icon={copiedCode === promoCode.code ? <CheckOutlined /> : <CopyOutlined />}
                        onClick={() => copyPromoCode(promoCode.code)}
                        style={{ background: '#667eea' }}
                      />
                    </Tooltip>,
                    <Tooltip title="Share">
                      <Button
                        type="text"
                        icon={<ShareAltOutlined />}
                        onClick={() => message.info('Share functionality would be implemented here')}
                      />
                    </Tooltip>,
                    <Tooltip title="View Details">
                      <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => setSelectedPromoCode(promoCode)}
                      />
                    </Tooltip>,
                    <Tooltip title="Edit">
                      <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => message.info('Edit functionality would be implemented here')}
                      />
                    </Tooltip>,
                    <Tooltip title="Delete">
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => deletePromoCode(promoCode.id)}
                      />
                    </Tooltip>
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '60px',
                          height: '60px',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '24px',
                          fontWeight: 'bold'
                        }}>
                          {formatDiscount(promoCode).charAt(0)}
                        </div>
                        {promoCode.creator.avatar ? (
                          <Avatar src={promoCode.creator.avatar} size={32} />
                        ) : (
                          <Avatar style={{ backgroundColor: getPriorityColor(promoCode.priority) }}>
                            {promoCode.creator.name.charAt(0)}
                          </Avatar>
                        )}
                      </div>
                    }
                    title={
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <Text strong style={{ fontSize: '18px', color: '#667eea' }}>
                          {promoCode.code}
                        </Text>
                        <Text style={{ fontSize: '16px', color: '#52c41a', fontWeight: 'bold' }}>
                          {formatDiscount(promoCode)}
                        </Text>
                        <Tag color={getStatusColor(promoCode.status)}>
                          {promoCode.status.toUpperCase()}
                        </Tag>
                        {expiringSoon && <Tag color="orange">EXPIRING SOON</Tag>}
                        <Tag color={getPriorityColor(promoCode.priority)}>
                          {promoCode.priority.toUpperCase()}
                        </Tag>
                      </div>
                    }
                    description={
                      <div>
                        <Title level={5} style={{ margin: '8px 0', color: '#2c3e50' }}>
                          {promoCode.title}
                        </Title>
                        <Paragraph style={{ margin: '8px 0', color: '#64748b' }}>
                          {promoCode.description}
                        </Paragraph>

                        <div style={{ margin: '12px 0' }}>
                          <Text strong>Usage: </Text>
                          <Progress
                            percent={usagePercent}
                            format={() => `${promoCode.currentUses}/${promoCode.maxUses}`}
                            strokeColor={{
                              '0%': '#667eea',
                              '100%': '#764ba2',
                            }}
                            style={{ width: '200px', display: 'inline-block', marginLeft: '8px' }}
                          />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                          <Space wrap>
                            <Text type="secondary">Min Order: ${promoCode.minOrder}</Text>
                            <Divider type="vertical" />
                            <Text type="secondary">By: {promoCode.creator.name}</Text>
                            <Divider type="vertical" />
                            <Tag>{promoCode.category}</Tag>
                          </Space>
                          <Space>
                            <Text type="secondary">{formatDate(promoCode.startDate)} - {formatDate(promoCode.endDate)}</Text>
                          </Space>
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              </Card>
            );
          }}
        />
      )}

      {/* Promo Code Detail Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <GiftOutlined style={{ color: '#667eea' }} />
            Promo Code Details
          </div>
        }
        open={selectedPromoCode !== null}
        onCancel={() => setSelectedPromoCode(null)}
        footer={[
          <Button key="copy" icon={<CopyOutlined />} onClick={() => copyPromoCode(selectedPromoCode?.code)}>
            Copy Code
          </Button>,
          <Button key="edit" type="primary" icon={<EditOutlined />}>
            Edit Code
          </Button>,
          <Button key="close" onClick={() => setSelectedPromoCode(null)}>
            Close
          </Button>
        ]}
        width={700}
      >
        {selectedPromoCode && (
          <div>
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '20px',
              color: 'white',
              textAlign: 'center'
            }}>
              <Title level={2} style={{ color: 'white', margin: '0 0 8px 0' }}>
                {selectedPromoCode.code}
              </Title>
              <Title level={3} style={{ color: 'white', margin: '0 0 8px 0' }}>
                {formatDiscount(selectedPromoCode)}
              </Title>
              <Text style={{ color: 'rgba(255,255,255,0.9)' }}>
                {selectedPromoCode.title}
              </Text>
            </div>

            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="Description" span={2}>
                {selectedPromoCode.description}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={getStatusColor(selectedPromoCode.status)}>
                  {selectedPromoCode.status.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Priority">
                <Tag color={getPriorityColor(selectedPromoCode.priority)}>
                  {selectedPromoCode.priority.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Category">
                <Tag>{selectedPromoCode.category}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Minimum Order">
                ${selectedPromoCode.minOrder}
              </Descriptions.Item>
              <Descriptions.Item label="Usage">
                <Progress
                  percent={getUsagePercentage(selectedPromoCode.currentUses, selectedPromoCode.maxUses)}
                  format={() => `${selectedPromoCode.currentUses}/${selectedPromoCode.maxUses}`}
                  strokeColor={{
                    '0%': '#667eea',
                    '100%': '#764ba2',
                  }}
                />
              </Descriptions.Item>
              <Descriptions.Item label="Valid Period" span={2}>
                {formatDate(selectedPromoCode.startDate)} - {formatDate(selectedPromoCode.endDate)}
              </Descriptions.Item>
              <Descriptions.Item label="Created By" span={2}>
                <Space>
                  {selectedPromoCode.creator.avatar ? (
                    <Avatar src={selectedPromoCode.creator.avatar} size={24} />
                  ) : (
                    <Avatar size={24}>
                      {selectedPromoCode.creator.name.charAt(0)}
                    </Avatar>
                  )}
                  <Text>{selectedPromoCode.creator.name}</Text>
                </Space>
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
}
