import React, { useState, useEffect } from 'react';
import {
    Card,
    Table,
    Button,
    Modal,
    Form,
    Input,
    Select,
    Space,
    Popconfirm,
    message,
    Tag,
    Tooltip,
    Row,
    Col,
    Badge,
    Avatar,
    Typography,
    Divider,
    Image,
    Rate,
    Timeline,
    Descriptions
} from 'antd';
import {
    EyeOutlined,
    SearchOutlined,
    ReloadOutlined,
    CheckOutlined,
    CloseOutlined,
    BankOutlined,
    CalendarOutlined,
    UserOutlined,
    PhoneOutlined,
    MailOutlined,
    GlobalOutlined,
    EnvironmentOutlined,
    FileTextOutlined,
    ClockCircleOutlined,
    ExclamationCircleOutlined,
    CheckCircleOutlined,
    FileImageOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const OrganizationRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [rejectModalVisible, setRejectModalVisible] = useState(false);
    const [viewingRequest, setViewingRequest] = useState(null);
    const [rejectingRequest, setRejectingRequest] = useState(null);
    const [form] = Form.useForm();
    const [searchText, setSearchText] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterCategory, setFilterCategory] = useState('all');

    // Mock data
    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            const mockData = [
                {
                    id: 1,
                    organizationName: 'TechCorp Solutions',
                    contactName: 'John Smith',
                    email: 'john.smith@techcorp.com',
                    phone: '+1-555-0123',
                    website: 'https://techcorp.com',
                    category: 'Technology',
                    description: 'Leading software development company specializing in enterprise solutions and cloud infrastructure.',
                    address: '123 Tech Street, Silicon Valley, CA 94105',
                    employeeCount: '500-1000',
                    foundedYear: '2010',
                    requestDate: '2024-07-15',
                    status: 'pending',
                    priority: 'high',
                    documents: [
                        { name: 'Business License', url: 'doc1.pdf', verified: true },
                        { name: 'Tax Certificate', url: 'doc2.pdf', verified: true },
                        { name: 'Company Registration', url: 'doc3.pdf', verified: false }
                    ],
                    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=TechCorp',
                    socialMedia: {
                        linkedin: 'https://linkedin.com/company/techcorp',
                        twitter: 'https://twitter.com/techcorp'
                    },
                    revenue: '$50M - $100M',
                    requestReason: 'Expanding into event management and seeking partnership opportunities',
                    previousPartnerships: 'Microsoft, Amazon, Google Cloud'
                },
                {
                    id: 2,
                    organizationName: 'Green Earth Foundation',
                    contactName: 'Sarah Johnson',
                    email: 'sarah@greenearth.org',
                    phone: '+1-555-0456',
                    website: 'https://greenearth.org',
                    category: 'Non-Profit',
                    description: 'Environmental conservation organization focused on climate change awareness and sustainable practices.',
                    address: '456 Green Avenue, Portland, OR 97201',
                    employeeCount: '50-100',
                    foundedYear: '2015',
                    requestDate: '2024-07-18',
                    status: 'under_review',
                    priority: 'medium',
                    documents: [
                        { name: 'Non-Profit Certificate', url: 'doc4.pdf', verified: true },
                        { name: 'IRS Determination Letter', url: 'doc5.pdf', verified: true }
                    ],
                    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=GreenEarth',
                    socialMedia: {
                        linkedin: 'https://linkedin.com/company/greenearth',
                        facebook: 'https://facebook.com/greenearth'
                    },
                    revenue: '$1M - $5M',
                    requestReason: 'Organizing environmental awareness events and conferences',
                    previousPartnerships: 'WWF, Greenpeace, Sierra Club'
                },
                {
                    id: 3,
                    organizationName: 'Creative Arts Studio',
                    contactName: 'Michael Brown',
                    email: 'mike@creativestudio.com',
                    phone: '+1-555-0789',
                    website: 'https://creativestudio.com',
                    category: 'Arts & Entertainment',
                    description: 'Full-service creative agency providing design, photography, and event production services.',
                    address: '789 Creative Blvd, New York, NY 10001',
                    employeeCount: '10-50',
                    foundedYear: '2018',
                    requestDate: '2024-07-20',
                    status: 'pending',
                    priority: 'low',
                    documents: [
                        { name: 'Business License', url: 'doc6.pdf', verified: false },
                        { name: 'Portfolio', url: 'portfolio.pdf', verified: true }
                    ],
                    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=Creative',
                    socialMedia: {
                        instagram: 'https://instagram.com/creativestudio',
                        behance: 'https://behance.net/creativestudio'
                    },
                    revenue: '$500K - $1M',
                    requestReason: 'Looking to host art exhibitions and creative workshops',
                    previousPartnerships: 'Adobe, Canva, Dribbble'
                },
                {
                    id: 4,
                    organizationName: 'Global Trade Corp',
                    contactName: 'Emily Davis',
                    email: 'emily@globaltrade.com',
                    phone: '+1-555-0321',
                    website: 'https://globaltrade.com',
                    category: 'Business Services',
                    description: 'International trade and logistics company facilitating global commerce and supply chain solutions.',
                    address: '321 Trade Center, Miami, FL 33101',
                    employeeCount: '1000+',
                    foundedYear: '2005',
                    requestDate: '2024-07-12',
                    status: 'approved',
                    priority: 'high',
                    documents: [
                        { name: 'Import License', url: 'doc7.pdf', verified: true },
                        { name: 'Trade Certificate', url: 'doc8.pdf', verified: true },
                        { name: 'Financial Statement', url: 'doc9.pdf', verified: true }
                    ],
                    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=GlobalTrade',
                    socialMedia: {
                        linkedin: 'https://linkedin.com/company/globaltrade'
                    },
                    revenue: '$100M+',
                    requestReason: 'Hosting international trade conferences and networking events',
                    previousPartnerships: 'FedEx, DHL, Maersk, Chamber of Commerce'
                },
                {
                    id: 5,
                    organizationName: 'HealthFirst Clinic',
                    contactName: 'Dr. Robert Wilson',
                    email: 'dr.wilson@healthfirst.com',
                    phone: '+1-555-0654',
                    website: 'https://healthfirst.com',
                    category: 'Healthcare',
                    description: 'Modern healthcare facility providing comprehensive medical services and wellness programs.',
                    address: '654 Health Plaza, Chicago, IL 60601',
                    employeeCount: '200-500',
                    foundedYear: '2012',
                    requestDate: '2024-07-10',
                    status: 'rejected',
                    priority: 'medium',
                    documents: [
                        { name: 'Medical License', url: 'doc10.pdf', verified: true },
                        { name: 'Accreditation', url: 'doc11.pdf', verified: false }
                    ],
                    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=HealthFirst',
                    socialMedia: {
                        linkedin: 'https://linkedin.com/company/healthfirst'
                    },
                    revenue: '$10M - $50M',
                    requestReason: 'Organizing medical conferences and health awareness events',
                    previousPartnerships: 'Mayo Clinic, Johns Hopkins, AMA',
                    rejectionReason: 'Incomplete documentation and missing required certifications'
                }
            ];
            setRequests(mockData);
            setLoading(false);
        }, 1000);
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: '#faad14',
            under_review: '#1890ff',
            approved: '#52c41a',
            rejected: '#ff4d4f'
        };
        return colors[status] || '#faad14';
    };

    const getStatusText = (status) => {
        const texts = {
            pending: 'Pending',
            under_review: 'Under Review',
            approved: 'Approved',
            rejected: 'Rejected'
        };
        return texts[status] || 'Pending';
    };

    const getPriorityColor = (priority) => {
        const colors = {
            low: '#52c41a',
            medium: '#faad14',
            high: '#ff4d4f'
        };
        return colors[priority] || '#faad14';
    };

    const handleView = (record) => {
        setViewingRequest(record);
        setViewModalVisible(true);
    };

    const handleApprove = (record) => {
        Modal.confirm({
            title: 'Approve Organization Request',
            content: `Are you sure you want to approve "${record.organizationName}"?`,
            okText: 'Approve',
            okType: 'primary',
            cancelText: 'Cancel',
            onOk() {
                setRequests(prev =>
                    prev.map(item =>
                        item.id === record.id ? { ...item, status: 'approved' } : item
                    )
                );
                message.success(`${record.organizationName} has been approved successfully`);
            },
        });
    };

    const handleReject = (record) => {
        setRejectingRequest(record);
        setRejectModalVisible(true);
        form.resetFields();
    };

    const handleRejectSubmit = (values) => {
        setRequests(prev =>
            prev.map(item =>
                item.id === rejectingRequest.id
                    ? { ...item, status: 'rejected', rejectionReason: values.reason }
                    : item
            )
        );
        message.success(`${rejectingRequest.organizationName} has been rejected`);
        setRejectModalVisible(false);
        setRejectingRequest(null);
    };

    const filteredData = requests.filter(item => {
        const matchesSearch = item.organizationName.toLowerCase().includes(searchText.toLowerCase()) ||
            item.contactName.toLowerCase().includes(searchText.toLowerCase()) ||
            item.email.toLowerCase().includes(searchText.toLowerCase());
        const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
        const matchesCategory = filterCategory === 'all' || item.category === filterCategory;

        return matchesSearch && matchesStatus && matchesCategory;
    });

    const columns = [
        {
            title: 'Organization',
            dataIndex: 'organizationName',
            key: 'organization',
            render: (text, record) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Avatar
                        src={record.logo}
                        size={40}
                        style={{
                            backgroundColor: '#667eea',
                            color: 'white'
                        }}
                    >
                        {text.charAt(0)}
                    </Avatar>
                    <div>
                        <div style={{ fontWeight: 600, marginBottom: '2px' }}>{text}</div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>{record.category}</Text>
                    </div>
                </div>
            ),
        },
        {
            title: 'Contact Person',
            dataIndex: 'contactName',
            key: 'contact',
            render: (text, record) => (
                <div>
                    <div style={{ fontWeight: 500 }}>{text}</div>
                    <Text type="secondary" style={{ fontSize: '12px' }}>{record.email}</Text>
                </div>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status, record) => (
                <div>
                    <Badge
                        status={status === 'approved' ? 'success' : status === 'rejected' ? 'error' : status === 'under_review' ? 'processing' : 'warning'}
                        text={getStatusText(status)}
                    />
                    <div style={{ marginTop: '4px' }}>
                        <Tag color={getPriorityColor(record.priority)} size="small">
                            {record.priority} priority
                        </Tag>
                    </div>
                </div>
            ),
        },
        {
            title: 'Request Date',
            dataIndex: 'requestDate',
            key: 'requestDate',
            render: (date) => (
                <div>
                    <CalendarOutlined style={{ marginRight: '4px' }} />
                    {date}
                </div>
            ),
        },
        // {
        //   title: 'Documents',
        //   dataIndex: 'documents',
        //   key: 'documents',
        //   render: (documents) => {
        //     const verified = documents.filter(doc => doc.verified).length;
        //     const total = documents.length;
        //     return (
        //       <div>
        //         <Text>{verified}/{total} verified</Text>
        //         <div style={{ marginTop: '2px' }}>
        //           <Rate
        //             disabled
        //             count={total}
        //             value={verified}
        //             style={{ fontSize: '12px' }}
        //           />
        //         </div>
        //       </div>
        //     );
        //   },
        // },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Tooltip title="View Details">
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            onClick={() => handleView(record)}
                            style={{ color: '#667eea' }}
                        />
                    </Tooltip>
                    {record.status === 'pending' || record.status === 'under_review' ? (
                        <>
                            <Tooltip title="Approve">
                                <Button
                                    type="text"
                                    icon={<CheckOutlined />}
                                    onClick={() => handleApprove(record)}
                                    style={{ color: '#52c41a' }}
                                />
                            </Tooltip>
                            <Tooltip title="Reject">
                                <Button
                                    type="text"
                                    icon={<CloseOutlined />}
                                    onClick={() => handleReject(record)}
                                    style={{ color: '#ff4d4f' }}
                                />
                            </Tooltip>
                        </>
                    ) : (
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            {record.status === 'approved' ? 'Approved' : 'Rejected'}
                        </Text>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px', background: 'transparent' }}>
            {/* Header Section */}
            <div style={{ marginBottom: '24px' }}>
                <Title level={2} style={{ margin: 0, marginBottom: '8px' }}>
                    Organization Requests
                </Title>
                <Text type="secondary">
                    Review and manage organization registration requests
                </Text>
            </div>

            {/* Stats Cards */}
            <Row gutter={16} style={{ marginBottom: '24px' }}>
                <Col span={6}>
                    <Card size="small">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <Text type="secondary">Total Requests</Text>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea' }}>
                                    {requests.length}
                                </div>
                            </div>
                            <Avatar icon={<BankOutlined />} style={{ backgroundColor: '#667eea' }} />
                        </div>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <Text type="secondary">Pending</Text>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#faad14' }}>
                                    {requests.filter(r => r.status === 'pending' || r.status === 'under_review').length}
                                </div>
                            </div>
                            <Avatar icon={<ClockCircleOutlined />} style={{ backgroundColor: '#faad14' }} />
                        </div>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <Text type="secondary">Approved</Text>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                                    {requests.filter(r => r.status === 'approved').length}
                                </div>
                            </div>
                            <Avatar icon={<CheckCircleOutlined />} style={{ backgroundColor: '#52c41a' }} />
                        </div>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <Text type="secondary">Rejected</Text>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff4d4f' }}>
                                    {requests.filter(r => r.status === 'rejected').length}
                                </div>
                            </div>
                            <Avatar icon={<CloseOutlined />} style={{ backgroundColor: '#ff4d4f' }} />
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Main Content Card */}
            <Card>
                {/* Toolbar */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px'
                }}>
                    <Space>
                        <Input
                            placeholder="Search organizations..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{ width: 250 }}
                        />
                        <Select
                            placeholder="Status"
                            value={filterStatus}
                            onChange={setFilterStatus}
                            style={{ width: 140 }}
                        >
                            <Option value="all">All Status</Option>
                            <Option value="pending">Pending</Option>
                            <Option value="under_review">Under Review</Option>
                            <Option value="approved">Approved</Option>
                            <Option value="rejected">Rejected</Option>
                        </Select>
                        <Select
                            placeholder="Category"
                            value={filterCategory}
                            onChange={setFilterCategory}
                            style={{ width: 160 }}
                        >
                            <Option value="all">All Categories</Option>
                            <Option value="Technology">Technology</Option>
                            <Option value="Non-Profit">Non-Profit</Option>
                            <Option value="Healthcare">Healthcare</Option>
                            <Option value="Arts & Entertainment">Arts & Entertainment</Option>
                            <Option value="Business Services">Business Services</Option>
                        </Select>
                    </Space>

                    <Button
                        icon={<ReloadOutlined />}
                        onClick={loadRequests}
                        loading={loading}
                    >
                        Refresh
                    </Button>
                </div>

                {/* Table */}
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    loading={loading}
                    rowKey="id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} requests`,
                    }}
                />
            </Card>

            {/* View Details Modal */}
            <Modal
                title="Organization Request Details"
                open={viewModalVisible}
                onCancel={() => setViewModalVisible(false)}
                width={900}
                footer={viewingRequest && (viewingRequest.status === 'pending' || viewingRequest.status === 'under_review') ? [
                    <Button key="reject" onClick={() => {
                        setViewModalVisible(false);
                        handleReject(viewingRequest);
                    }} style={{ color: '#ff4d4f', borderColor: '#ff4d4f' }}>
                        <CloseOutlined /> Reject
                    </Button>,
                    <Button
                        key="approve"
                        type="primary"
                        onClick={() => {
                            setViewModalVisible(false);
                            handleApprove(viewingRequest);
                        }}
                        style={{
                            background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
                            border: 'none'
                        }}
                    >
                        <CheckOutlined /> Approve
                    </Button>
                ] : [
                    <Button key="close" onClick={() => setViewModalVisible(false)}>
                        Close
                    </Button>
                ]}
            >
                {viewingRequest && (
                    <div style={{ marginTop: '20px' }}>
                        {/* Organization Header */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '20px',
                            marginBottom: '24px',
                            padding: '20px',
                            background: 'rgba(102, 126, 234, 0.05)',
                            borderRadius: '12px'
                        }}>
                            <Avatar
                                src={viewingRequest.logo}
                                size={64}
                                style={{
                                    backgroundColor: '#667eea',
                                    color: 'white',
                                    fontSize: '24px'
                                }}
                            >
                                {viewingRequest.organizationName.charAt(0)}
                            </Avatar>
                            <div style={{ flex: 1 }}>
                                <Title level={3} style={{ margin: 0, marginBottom: '4px' }}>
                                    {viewingRequest.organizationName}
                                </Title>
                                <Text type="secondary" style={{ fontSize: '14px' }}>
                                    {viewingRequest.category} • Founded {viewingRequest.foundedYear}
                                </Text>
                                <div style={{ marginTop: '8px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <Badge
                                        status={viewingRequest.status === 'approved' ? 'success' : viewingRequest.status === 'rejected' ? 'error' : 'processing'}
                                        text={getStatusText(viewingRequest.status)}
                                    />
                                    <Tag color={getPriorityColor(viewingRequest.priority)}>
                                        {viewingRequest.priority} priority
                                    </Tag>
                                </div>
                            </div>
                        </div>

                        {/* Detailed Information */}
                        <Descriptions title="Organization Details" bordered column={2} size="small">
                            <Descriptions.Item label="Contact Person" span={1}>
                                <UserOutlined style={{ marginRight: '4px' }} />
                                {viewingRequest.contactName}
                            </Descriptions.Item>
                            <Descriptions.Item label="Email" span={1}>
                                <MailOutlined style={{ marginRight: '4px' }} />
                                {viewingRequest.email}
                            </Descriptions.Item>
                            <Descriptions.Item label="Phone" span={1}>
                                <PhoneOutlined style={{ marginRight: '4px' }} />
                                {viewingRequest.phone}
                            </Descriptions.Item>
                            <Descriptions.Item label="Website" span={1}>
                                <GlobalOutlined style={{ marginRight: '4px' }} />
                                <a href={viewingRequest.website} target="_blank" rel="noopener noreferrer">
                                    {viewingRequest.website}
                                </a>
                            </Descriptions.Item>
                            <Descriptions.Item label="Address" span={2}>
                                <EnvironmentOutlined style={{ marginRight: '4px' }} />
                                {viewingRequest.address}
                            </Descriptions.Item>
                            {/* <Descriptions.Item label="Employee Count" span={1}>
                {viewingRequest.employeeCount}
              </Descriptions.Item> */}
                            <Descriptions.Item label="Request Date" span={1}>
                                <CalendarOutlined style={{ marginRight: '4px' }} />
                                {viewingRequest.requestDate}
                            </Descriptions.Item>
                            <Descriptions.Item label="Revenue Range" span={1}>
                                {viewingRequest.revenue}
                            </Descriptions.Item>
                            {/* <Descriptions.Item label="Previous Partnerships" span={1}>
                {viewingRequest.previousPartnerships}
              </Descriptions.Item> */}
                        </Descriptions>

                        <Divider />

                        {/* Description */}
                        <div style={{ marginBottom: '20px' }}>
                            <Title level={5}>Organization Description</Title>
                            <Paragraph>{viewingRequest.description}</Paragraph>
                        </div>

                        {/* Request Reason */}
                        <div style={{ marginBottom: '20px' }}>
                            <Title level={5}>Request Reason</Title>
                            <Paragraph>{viewingRequest.requestReason}</Paragraph>
                        </div>

                        {/* Documents Section */}
                        {/* <div style={{ marginBottom: '20px' }}>
              <Title level={5}>Submitted Documents</Title>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {viewingRequest.documents.map((doc, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '8px 12px',
                      background: 'rgba(0,0,0,0.02)',
                      borderRadius: '6px',
                      border: `1px solid ${doc.verified ? '#52c41a' : '#faad14'}`
                    }}
                  >
                    <FileImageOutlined style={{ color: '#667eea' }} />
                    <span style={{ flex: 1 }}>{doc.name}</span>
                    <Tag color={doc.verified ? 'success' : 'warning'}>
                      {doc.verified ? 'Verified' : 'Pending'}
                    </Tag>
                    <Button type="link" size="small">View</Button>
                  </div>
                ))}
              </div>
            </div> */}

                        {/* Social Media */}
                        {viewingRequest.socialMedia && Object.keys(viewingRequest.socialMedia).length > 0 && (
                            <div style={{ marginBottom: '20px' }}>
                                <Title level={5}>Social Media</Title>
                                <Space wrap>
                                    {Object.entries(viewingRequest.socialMedia).map(([platform, url]) => (
                                        <Tag key={platform} color="#667eea">
                                            <a href={url} target="_blank" rel="noopener noreferrer">
                                                {platform.charAt(0).toUpperCase() + platform.slice(1)}
                                            </a>
                                        </Tag>
                                    ))}
                                </Space>
                            </div>
                        )}

                        {/* Rejection Reason (if rejected) */}
                        {viewingRequest.status === 'rejected' && viewingRequest.rejectionReason && (
                            <div style={{ marginTop: '20px' }}>
                                <Title level={5} style={{ color: '#ff4d4f' }}>
                                    <ExclamationCircleOutlined style={{ marginRight: '8px' }} />
                                    Rejection Reason
                                </Title>
                                <div style={{
                                    padding: '12px',
                                    background: 'rgba(255, 77, 79, 0.1)',
                                    border: '1px solid rgba(255, 77, 79, 0.3)',
                                    borderRadius: '6px'
                                }}>
                                    {viewingRequest.rejectionReason}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Modal>

            {/* Reject Modal
      <Modal
        title="Reject Organization Request"
        open={rejectModalVisible}
        onCancel={() => setRejectModalVisible(false)}
        width={500}
        footer={null}
      >
        {rejectingRequest && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <Text>You are about to reject the registration request for:</Text>
              <div style={{ 
                fontWeight: 'bold', 
                fontSize: '16px', 
                color: '#667eea',
                margin: '8px 0' 
              }}>
                {rejectingRequest.organizationName}
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
                <Button onClick={() => setRejectModalVisible(false)}>
                  Cancel
                </Button>
                <Button 
                  type="primary" 
                  danger 
                  htmlType="submit"
                  icon={<CloseOutlined />}
                >
                  Reject Request
                </Button>
              </div>
            </Form>
          </div>
        )}
      </Modal> */}
        </div>
    );
};

export default OrganizationRequests;