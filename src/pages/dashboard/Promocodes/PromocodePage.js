
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  Descriptions,
  Popconfirm,
  Spin
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
import TogglePromoCodeModal from './components/modals/TogglePromoCodeModal';
import { debounce } from 'lodash';
import httpClient from '../../../utils/HttpClient';
import { objectToQuery } from '../../../utils/Utils';
import { DELETE_EXPIRED_PROMO_URL, DELETE_PROMO_URL, PROMO_STATIC_URL, PROMO_URL } from '../../../constants/Url';
import ViewPromoCodeModal from './components/modals/ViewPromoCodeModal';

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
  const defaultStatic = useMemo(() => {
    return { total: 0, active: 0, expired: 0, expiringSoon: 0 }
  }, [])
  const defaultFilter = useMemo(() => {
    return {
      pageNo: 1,
      pageSize: 10,
      status: "all",
      discountType: "all",
      tab: "all",
      keyword: "",
    }
  }, [])
  const [promoCodes, setPromoCodes] = useState(mockPromoCodes);
  const [statistic, setStatistic] = useState(defaultStatic);
  const [copiedCode, setCopiedCode] = useState('');
  const [loading, setLoading] = useState({
    list: true,
    static: true,
  });
  const [filter, setFilter] = useState(defaultFilter)
  const [total, setTotal] = useState(0);

  const togglePromoCodeModalRef = useRef();
  const viewPromoCodeModalRef = useRef();

  const fetchData = useCallback(async (parseQuery) => {
    try {
      setLoading((pre) => ({ ...pre, list: true }));

      const res = await httpClient.get(objectToQuery(PROMO_URL, parseQuery ?? filter)).then(res => res.data); // Simulate fetching data from API

      if (res.status === 200) {
        setPromoCodes(res.data);
        setTotal(res.total)
      } else {
        setPromoCodes([]);
        setTotal(0)
      }
    } catch (error) {
      setPromoCodes([]);
      setTotal(0)
    } finally {
      setLoading((pre) => ({ ...pre, list: false }));
    }
  }, [filter]);

  const debounceFetchData = useCallback(debounce(fetchData, 300), [fetchData])

  useEffect(() => {
    debounceFetchData()

    return debounceFetchData.cancel
  }, [debounceFetchData])


  const fetchStatic = useCallback(async (parseQuery) => {
    try {
      setLoading(pre => ({ ...pre, static: true }));

      const res = await httpClient.get(PROMO_STATIC_URL).then((res) => res.data);

      if (res.status === 200) {
        setStatistic({ ...res.data });
      } else {
        setStatistic({ ...defaultStatic });
      }
    } catch (error) {
      setStatistic({ ...defaultStatic });
    } finally {
      setLoading(pre => ({ ...pre, static: false }));
    }
  }, []);

  const debounceFetchStatic = useCallback(debounce(fetchStatic, 300), [fetchStatic]);

  useEffect(() => {
    debounceFetchStatic()

    return debounceFetchStatic.cancel;
  }, [debounceFetchStatic]);

  const handleDelete = async (id) => {
    try {
      setLoading(pre => ({ ...pre, static: true, list: true }));
      const res = await httpClient.delete(DELETE_PROMO_URL.replace(":id", id)).then(res => res.data)

      if (res.status === 200) {
        await Promise.all([
          debounceFetchData(),
          debounceFetchStatic(),
        ])
        message.success('Promo code deleted successfully');
      } else {
        message.success("Failed to delete promo code");
        setLoading(pre => ({ ...pre, static: false, list: false }));
      }
    } catch (error) {
      setLoading(pre => ({ ...pre, static: false, list: false }));
      message.error("Failed to delete promo code")
    }
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

  // Clear all expired codes
  const clearExpiredCodes = () => {
    Modal.confirm({
      title: 'Clear Expired Codes',
      content: 'Are you sure you want to delete all expired promo codes? This action cannot be undone.',
      onOk: async () => {
        try {
          setLoading(pre => ({ ...pre, static: true, list: true }));
          const res = await httpClient.delete(DELETE_EXPIRED_PROMO_URL).then(res => res.data)

          if (res.status === 200) {
            await Promise.all([
              debounceFetchData(),
              debounceFetchStatic(),
            ])
            message.success('All expired promo codes cleared');
          } else {
            message.success("Failed to clear all promo code");
            setLoading(pre => ({ ...pre, static: false, list: false }));
          }
        } catch (error) {
          setLoading(pre => ({ ...pre, static: false, list: false }));
          message.error("Failed to clear all promo code")
        }
      }
    });
  };

  // Calculate usage percentage
  const getUsagePercentage = (current, max) => {
    return Math.round((current / max) * 100);
  };

  const openEditModal = (record, mode) => {
    togglePromoCodeModalRef.current?.openModal(record, mode);
  }

  const openCreateModal = () => {
    togglePromoCodeModalRef.current?.openModal();
  }

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
            <Button icon={<PlusOutlined />} type="primary" size="large" onClick={openCreateModal}>
              Create New
            </Button>
            <Button icon={<ReloadOutlined />} onClick={async () => {
              setFilter(defaultFilter)
              await Promise.all([
                debounceFetchData(defaultFilter),
                debounceFetchStatic()
              ])
            }}>
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
            <Spin spinning={loading.static}>
              <Card style={{ background: 'rgba(24, 144, 255, 0.02)', backdropFilter: 'blur(10px)' }}>
                <Statistic
                  title="Total Codes"
                  value={statistic.total}
                  prefix={<GiftOutlined style={{ color: '#667eea' }} />}
                  valueStyle={{ color: '#667eea' }}
                />
              </Card>
            </Spin>
          </Col>
          <Col xs={6}>
            <Spin spinning={loading.static}>
              <Card style={{ background: 'rgba(24, 144, 255, 0.02)', backdropFilter: 'blur(10px)' }}>
                <Statistic
                  title="Active"
                  value={statistic.active}
                  valueStyle={{ color: '#52c41a' }}
                  prefix={<CheckOutlined style={{ color: '#52c41a' }} />}
                />
              </Card>
            </Spin>
          </Col>
          <Col xs={6}>
            <Spin spinning={loading.static}>
              <Card style={{ background: 'rgba(24, 144, 255, 0.02)', backdropFilter: 'blur(10px)' }}>
                <Statistic
                  title="Expiring Soon"
                  value={statistic.expiringSoon}
                  valueStyle={{ color: '#faad14' }}
                  prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
                />
              </Card>
            </Spin>
          </Col>
          <Col xs={6}>
            <Spin spinning={loading.static}>
              <Card style={{ background: 'rgba(24, 144, 255, 0.02)', backdropFilter: 'blur(10px)' }}>
                <Statistic
                  title="Expired"
                  value={statistic.expired}
                  valueStyle={{ color: '#ff4d4f' }}
                  prefix={<ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />}
                />
              </Card>
            </Spin>
          </Col>
        </Row>

        {/* Filters */}
        <Card style={{ marginBottom: '24px', background: 'rgba(24, 144, 255, 0.02)', backdropFilter: 'blur(10px)' }}>
          <Row gutter={16} align="middle">
            <Col xs={24} sm={8}>
              <Search
                placeholder="Search promo codes..."
                value={filter.keyword}
                onChange={(e) => setFilter(pre => ({ ...pre, keyword: e.target.value }))}
                style={{ width: '100%' }}
                size="large"
              />
            </Col>
            <Col xs={12} sm={4}>
              <Select
                placeholder="Status"
                value={filter.status}
                onChange={(value) => setFilter(pre => ({ ...pre, status: value }))}
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
                placeholder="Discount Type"
                value={filter.discountType}
                onChange={(value) => setFilter(pre => ({ ...pre, discountType: value }))}
                style={{ width: '100%' }}
                size="large"
              >
                <Option value="all">All Discount Type</Option>
                <Option value="percentage">Percentage</Option>
                <Option value="fixed">Fixed Amount</Option>
              </Select>
            </Col>
          </Row>
        </Card>
      </div>

      {/* Promo Codes List */}
      {promoCodes.length === 0 ? (
        <Card style={{ background: 'rgba(24, 144, 255, 0.02)', backdropFilter: 'blur(10px)' }}>
          <Empty description="No promo codes found" />
        </Card>
      ) : (
        <List
          itemLayout="vertical"
          dataSource={promoCodes}
          loading={loading.list}
          pagination={{
            pageSize: filter.pageSize,
            current: filter.pageNo,
            showSizeChanger: true,
            showQuickJumper: true,
            total: total,
            onChange: (page, pageSize) => {
              // Fetch data for the selected page
              setFilter(pre => {
                debounceFetchData({ ...pre, pageNo: page, pageSize });
                return ({ ...pre, pageNo: page, pageSize })
              });
            },
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} promo codes`
          }}
          renderItem={(record) => {
            const usagePercent = getUsagePercentage(record.currentUses, record.maxUses);
            const expiringSoon = isExpiringSoon(record.endDate);

            return (
              <Card
                style={{
                  marginBottom: '16px',
                  background: 'rgba(24, 144, 255, 0.02)',
                  backdropFilter: 'blur(10px)',
                  border: expiringSoon ? '2px solid #faad14' : record.status === 'active' ? '2px solid #52c41a' : '1px solid #d9d9d9',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}
              >
                <List.Item
                  actions={[
                    <Tooltip title="Copy Code">
                      <Button
                        type="primary"
                        icon={copiedCode === record.promoCode ? <CheckOutlined /> : <CopyOutlined />}
                        onClick={() => copyPromoCode(record.promoCode)}
                        style={{ background: '#667eea' }}
                      />
                    </Tooltip>,
                    <Tooltip title="View Details">
                      <Button
                        type="text"
                        icon={<EyeOutlined />}
                        style={{ color: '#667eea' }}
                        onClick={() => viewPromoCodeModalRef?.current?.openModal(record)}
                      />
                    </Tooltip>,
                    <Tooltip title="Edit">
                      <Button
                        type="text"
                        icon={<EditOutlined />}
                        style={{ color: '#52c41a' }}
                        onClick={() => openEditModal(record, "edit")}
                      />
                    </Tooltip>,
                    <Popconfirm
                      title="Delete the promo code"
                      description="Are you sure to delete this promo code?"
                      onConfirm={() => handleDelete(record._id)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Tooltip title="Delete">
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                        />
                      </Tooltip>
                    </Popconfirm>
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
                          {formatDiscount(record).charAt(0)}
                        </div>
                        {record.createdBy?.avatar ? (
                          <Avatar src={record.createdBy?.avatar} size={32} />
                        ) : (
                          <Avatar style={{ backgroundColor: getPriorityColor(record.priority) }}>
                            {record.createdBy?.username?.charAt(0)}
                          </Avatar>
                        )}
                      </div>
                    }
                    title={
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <Text strong style={{ fontSize: '18px', color: '#667eea' }}>
                          {record.promoCode}
                        </Text>
                        <Text style={{ fontSize: '16px', color: '#52c41a', fontWeight: 'bold' }}>
                          {formatDiscount(record)}
                        </Text>
                        <Tag color={getStatusColor(record.status)}>
                          {record.status.toUpperCase()}
                        </Tag>
                        {expiringSoon && <Tag color="orange">EXPIRING SOON</Tag>}
                        <Tag color={getPriorityColor(record.priority)}>
                          {record.priority.toUpperCase()}
                        </Tag>
                      </div>
                    }
                    description={
                      <div>
                        <Title level={5} style={{ margin: '8px 0', color: '#2c3e50' }}>
                          {record.title}
                        </Title>
                        <Paragraph style={{ margin: '8px 0', color: '#64748b' }}>
                          {record.description}
                        </Paragraph>

                        <div style={{ margin: '12px 0' }}>
                          <Text strong>Usage: </Text>
                          <Progress
                            percent={usagePercent}
                            format={() => `${record.currentUses}/${record.maxUses}`}
                            strokeColor={{
                              '0%': '#667eea',
                              '100%': '#764ba2',
                            }}
                            style={{ width: '200px', display: 'inline-block', marginLeft: '8px' }}
                          />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                          <Space wrap>
                            <Text type="secondary">Min Order: ${record.minOrder}</Text>
                            <Divider type="vertical" />
                            <Text type="secondary">By: {record.createdBy?.username}</Text>
                          </Space>
                          <Space>
                            <Text type="secondary">{formatDate(record.startDate)} - {formatDate(record.endDate)}</Text>
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
      <ViewPromoCodeModal
        ref={viewPromoCodeModalRef}
        copyPromoCode={copyPromoCode}
        openEditModal={(record) => openEditModal(record, "edit")}
      />

      <TogglePromoCodeModal
        ref={togglePromoCodeModalRef}
        fetchData={async () => {
          await Promise.all([
            debounceFetchData(),
            debounceFetchStatic()
          ])
        }}
      />
    </div>
  );
}
