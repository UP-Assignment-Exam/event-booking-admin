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
  Badge,
  Avatar
} from 'antd';
import {
  BellOutlined,
  CheckOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  BellFilled,
  ClearOutlined,
  ReloadOutlined,
  CalendarOutlined,
  MailOutlined,
  EyeOutlined,
  DeleteOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

// Mock notification data
const mockNotifications = [
  {
    id: 1,
    type: 'info',
    title: 'New Event Created',
    message: 'Tech Conference 2024 has been successfully created and is pending approval.',
    timestamp: '2024-01-15T10:30:00Z',
    read: false,
    category: 'events',
    priority: 'medium',
    actionUrl: '/events/1',
    sender: {
      name: 'Event Manager',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=manager'
    }
  },
  {
    id: 2,
    type: 'warning',
    title: 'Payment Method Issue',
    message: 'Credit card ending in 4532 has expired and needs to be updated.',
    timestamp: '2024-01-15T09:15:00Z',
    read: false,
    category: 'payments',
    priority: 'high',
    actionUrl: '/payment-methods',
    sender: {
      name: 'Payment System',
      avatar: null
    }
  },
  {
    id: 3,
    type: 'success',
    title: 'User Registration',
    message: '15 new users have registered in the last hour.',
    timestamp: '2024-01-15T08:45:00Z',
    read: true,
    category: 'users',
    priority: 'low',
    actionUrl: '/users',
    sender: {
      name: 'User Management',
      avatar: null
    }
  },
  {
    id: 4,
    type: 'error',
    title: 'System Alert',
    message: 'Database backup failed. Please check the server status immediately.',
    timestamp: '2024-01-15T07:20:00Z',
    read: false,
    category: 'system',
    priority: 'critical',
    actionUrl: '/settings/system',
    sender: {
      name: 'System Monitor',
      avatar: null
    }
  },
  {
    id: 5,
    type: 'info',
    title: 'Ticket Sales Update',
    message: 'Music Festival tickets are 80% sold out. Only 200 tickets remaining.',
    timestamp: '2024-01-14T16:30:00Z',
    read: true,
    category: 'tickets',
    priority: 'medium',
    actionUrl: '/tickets/sales',
    sender: {
      name: 'Sales Team',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sales'
    }
  },
  {
    id: 6,
    type: 'success',
    title: 'Organization Approved',
    message: 'TechCorp Organization has been approved and is now active.',
    timestamp: '2024-01-14T14:15:00Z',
    read: true,
    category: 'organizations',
    priority: 'medium',
    actionUrl: '/organizations/techcorp',
    sender: {
      name: 'Admin Review',
      avatar: null
    }
  }
];

export default function Notification() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('all');

  // Get notification statistics
  const notificationStats = {
    total: notifications.length,
    unread: notifications.filter(n => !n.read).length,
    critical: notifications.filter(n => n.priority === 'critical').length,
    today: notifications.filter(n => {
      const today = new Date();
      const notifDate = new Date(n.timestamp);
      return notifDate.toDateString() === today.toDateString();
    }).length
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    const icons = {
      info: <InfoCircleOutlined style={{ color: '#1890ff' }} />,
      success: <CheckOutlined style={{ color: '#52c41a' }} />,
      warning: <WarningOutlined style={{ color: '#faad14' }} />,
      error: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
    };
    return icons[type] || icons.info;
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

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  // Mark notification as read
  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    message.success('All notifications marked as read');
  };

  // Delete notification
  const deleteNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    message.success('Notification deleted');
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    Modal.confirm({
      title: 'Clear All Notifications',
      content: 'Are you sure you want to clear all notifications? This action cannot be undone.',
      onOk: () => {
        setNotifications([]);
        message.success('All notifications cleared');
      }
    });
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || notification.type === filterType;
    const matchesCategory = filterCategory === 'all' || notification.category === filterCategory;
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'unread' && !notification.read) ||
                      (activeTab === 'read' && notification.read);

    return matchesSearch && matchesType && matchesCategory && matchesTab;
  });

  return (
    <div style={{ padding: '24px', maxHeight: 'calc(100vh - 140px)', overflow: 'auto', backgroundColor: 'rgba(24, 144, 255, 0.02)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <Title level={2} style={{ margin: 0 }}>Notifications</Title>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={() => message.success('Notifications refreshed')}>
              Refresh
            </Button>
            <Button icon={<CheckOutlined />} onClick={markAllAsRead}>
              Mark All Read
            </Button>
            <Button icon={<ClearOutlined />} danger onClick={clearAllNotifications}>
              Clear All
            </Button>
          </Space>
        </div>

        {/* Statistics Cards */}
        <Row gutter={16} style={{ marginBottom: '24px' }}>
          <Col xs={6}>
            <Card>
              <Statistic title="Total" value={notificationStats.total} prefix={<BellFilled />} />
            </Card>
          </Col>
          <Col xs={6}>
            <Card>
              <Statistic 
                title="Unread" 
                value={notificationStats.unread} 
                valueStyle={{ color: '#1890ff' }}
                prefix={<MailOutlined />} 
              />
            </Card>
          </Col>
          <Col xs={6}>
            <Card>
              <Statistic 
                title="Critical" 
                value={notificationStats.critical} 
                valueStyle={{ color: '#ff4d4f' }}
                prefix={<ExclamationCircleOutlined />} 
              />
            </Card>
          </Col>
          <Col xs={6}>
            <Card>
              <Statistic title="Today" value={notificationStats.today} prefix={<CalendarOutlined />} />
            </Card>
          </Col>
        </Row>

        {/* Filters */}
        <Card style={{ marginBottom: '24px' }}>
          <Row gutter={16} align="middle">
            <Col xs={24} sm={8}>
              <Search
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%' }}
              />
            </Col>
            <Col xs={12} sm={4}>
              <Select
                placeholder="Type"
                value={filterType}
                onChange={setFilterType}
                style={{ width: '100%' }}
              >
                <Option value="all">All Types</Option>
                <Option value="info">Info</Option>
                <Option value="success">Success</Option>
                <Option value="warning">Warning</Option>
                <Option value="error">Error</Option>
              </Select>
            </Col>
            <Col xs={12} sm={4}>
              <Select
                placeholder="Category"
                value={filterCategory}
                onChange={setFilterCategory}
                style={{ width: '100%' }}
              >
                <Option value="all">All Categories</Option>
                <Option value="events">Events</Option>
                <Option value="payments">Payments</Option>
                <Option value="users">Users</Option>
                <Option value="system">System</Option>
                <Option value="tickets">Tickets</Option>
                <Option value="organizations">Organizations</Option>
              </Select>
            </Col>
          </Row>
        </Card>
      </div>

      {/* Notification Tabs */}
      <Tabs activeKey={activeTab} onChange={setActiveTab} style={{ marginBottom: '16px' }}>
        <TabPane tab={`All (${notifications.length})`} key="all" />
        <TabPane tab={`Unread (${notificationStats.unread})`} key="unread" />
        <TabPane tab="Read" key="read" />
      </Tabs>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <Card>
          <Empty description="No notifications found" />
        </Card>
      ) : (
        <List
          itemLayout="vertical"
          dataSource={filteredNotifications}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} notifications`
          }}
          renderItem={(notification) => (
            <Card
              style={{
                marginBottom: '12px',
                border: notification.read ? '1px solid #d9d9d9' : '2px solid #1890ff',
                backgroundColor: notification.read ? 'transparent' : 'rgba(24, 144, 255, 0.02)'
              }}
            >
              <List.Item
                actions={[
                  <Tooltip title="View Details">
                    <Button
                      type="text"
                      icon={<EyeOutlined />}
                      onClick={() => setSelectedNotification(notification)}
                    />
                  </Tooltip>,
                  !notification.read && (
                    <Tooltip title="Mark as Read">
                      <Button
                        type="text"
                        icon={<CheckOutlined />}
                        onClick={() => markAsRead(notification.id)}
                      />
                    </Tooltip>
                  ),
                  <Tooltip title="Delete">
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => deleteNotification(notification.id)}
                    />
                  </Tooltip>
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {getNotificationIcon(notification.type)}
                      {notification.sender.avatar ? (
                        <Avatar src={notification.sender.avatar} size={32} />
                      ) : (
                        <Avatar style={{ backgroundColor: getPriorityColor(notification.priority) }}>
                          {notification.sender.name.charAt(0)}
                        </Avatar>
                      )}
                    </div>
                  }
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Text strong style={{ fontSize: '16px' }}>
                        {notification.title}
                      </Text>
                      {!notification.read && <Badge status="processing" />}
                      <Tag color={getPriorityColor(notification.priority)}>
                        {notification.priority.toUpperCase()}
                      </Tag>
                    </div>
                  }
                  description={
                    <div>
                      <Paragraph style={{ margin: '8px 0' }}>
                        {notification.message}
                      </Paragraph>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Space>
                          <Text type="secondary">From: {notification.sender.name}</Text>
                          <Divider type="vertical" />
                          <Tag>{notification.category}</Tag>
                        </Space>
                        <Text type="secondary">{formatTimestamp(notification.timestamp)}</Text>
                      </div>
                    </div>
                  }
                />
              </List.Item>
            </Card>
          )}
        />
      )}

      {/* Notification Detail Modal */}
      <Modal
        title="Notification Details"
        open={selectedNotification !== null}
        onCancel={() => setSelectedNotification(null)}
        footer={[
          <Button key="close" onClick={() => setSelectedNotification(null)}>
            Close
          </Button>,
          selectedNotification?.actionUrl && (
            <Button key="action" type="primary">
              Take Action
            </Button>
          )
        ]}
        width={600}
      >
        {selectedNotification && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <Space>
                {getNotificationIcon(selectedNotification.type)}
                <Title level={4} style={{ margin: 0 }}>
                  {selectedNotification.title}
                </Title>
                <Tag color={getPriorityColor(selectedNotification.priority)}>
                  {selectedNotification.priority.toUpperCase()}
                </Tag>
              </Space>
            </div>
            
            <Paragraph>{selectedNotification.message}</Paragraph>
            
            <Divider />
            
            <Row gutter={16}>
              <Col span={12}>
                <Text strong>From:</Text>
                <div style={{ marginTop: '4px' }}>
                  <Space>
                    {selectedNotification.sender.avatar ? (
                      <Avatar src={selectedNotification.sender.avatar} size={24} />
                    ) : (
                      <Avatar size={24}>
                        {selectedNotification.sender.name.charAt(0)}
                      </Avatar>
                    )}
                    <Text>{selectedNotification.sender.name}</Text>
                  </Space>
                </div>
              </Col>
              <Col span={12}>
                <Text strong>Category:</Text>
                <div style={{ marginTop: '4px' }}>
                  <Tag>{selectedNotification.category}</Tag>
                </div>
              </Col>
            </Row>
            
            <div style={{ marginTop: '16px' }}>
              <Text strong>Timestamp:</Text>
              <div style={{ marginTop: '4px' }}>
                <Text>{new Date(selectedNotification.timestamp).toLocaleString()}</Text>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}