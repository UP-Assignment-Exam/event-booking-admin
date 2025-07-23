import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
    Card,
    Table,
    Button,
    Modal,
    Form,
    Input,
    Select,
    Space,
    message,
    Tag,
    Tooltip,
    Row,
    Col,
    Badge,
    Avatar,
    Typography,
    Spin
} from 'antd';
import {
    EyeOutlined,
    SearchOutlined,
    ReloadOutlined,
    CheckOutlined,
    CloseOutlined,
    BankOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
} from '@ant-design/icons';
import { debounce } from 'lodash';
import httpClient from '../../../utils/HttpClient';
import { ORGANIZATION_REQUESTS_STATIC_URL, ORGANIZATION_REQUESTS_URL, UPDATE_ORGANIZATION_REQUESTS_URL } from '../../../constants/Url';
import dayjs from 'dayjs';
import { objectToQuery } from '../../../utils/Utils';
import RejectOrganizationModal from './components/modals/RejectOrganizationModal';
import ViewOrganizationDetailModal from './components/modals/ViewOrganizationDetailModal';

const { Text } = Typography;
const { Option } = Select;

const OrganizationRequestPage = () => {
    const defaultStatic = useMemo(() => {
        return { pending: 0, approved: 0, rejected: 0 }
    }, [])
    const defaultFilter = useMemo(() => {
        return {
            pageNo: 1,
            pageSize: 10,
            keyword: '',
            status: 'all',
            organizationCategory: 'all'
        }
    }, [])
    const [filter, setFilter] = useState(defaultFilter)
    const [dataSource, setDataSource] = useState({ data: [], total: 0 });
    const [statistic, setStatistic] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
    const [loading, setLoading] = useState({
        list: true,
        static: true,
    });
    const rejectModalRef = useRef(null);
    const viewModalRef = useRef(null);

    // // Mock data
    // useEffect(() => {
    //     fetchData();
    // }, []);

    // const fetchData = () => {
    //     setLoading(true);
    //     // Simulate API call
    //     setTimeout(() => {
    //         const mockData = [
    //             {
    //                 id: 1,
    //                 organizationName: 'TechCorp Solutions',
    //                 contactName: 'John Smith',
    //                 email: 'john.smith@techcorp.com',
    //                 phone: '+1-555-0123',
    //                 website: 'https://techcorp.com',
    //                 category: 'Technology',
    //                 description: 'Leading software development company specializing in enterprise solutions and cloud infrastructure.',
    //                 address: '123 Tech Street, Silicon Valley, CA 94105',
    //                 employeeCount: '500-1000',
    //                 foundedYear: '2010',
    //                 requestDate: '2024-07-15',
    //                 status: 'pending',
    //                 priority: 'high',
    //                 documents: [
    //                     { name: 'Business License', url: 'doc1.pdf', verified: true },
    //                     { name: 'Tax Certificate', url: 'doc2.pdf', verified: true },
    //                     { name: 'Company Registration', url: 'doc3.pdf', verified: false }
    //                 ],
    //                 logo: 'https://api.dicebear.com/7.x/initials/svg?seed=TechCorp',
    //                 socialMedia: {
    //                     linkedin: 'https://linkedin.com/company/techcorp',
    //                     twitter: 'https://twitter.com/techcorp'
    //                 },
    //                 revenue: '$50M - $100M',
    //                 requestReason: 'Expanding into event management and seeking partnership opportunities',
    //                 previousPartnerships: 'Microsoft, Amazon, Google Cloud'
    //             },
    //             {
    //                 id: 2,
    //                 organizationName: 'Green Earth Foundation',
    //                 contactName: 'Sarah Johnson',
    //                 email: 'sarah@greenearth.org',
    //                 phone: '+1-555-0456',
    //                 website: 'https://greenearth.org',
    //                 category: 'Non-Profit',
    //                 description: 'Environmental conservation organization focused on climate change awareness and sustainable practices.',
    //                 address: '456 Green Avenue, Portland, OR 97201',
    //                 employeeCount: '50-100',
    //                 foundedYear: '2015',
    //                 requestDate: '2024-07-18',
    //                 status: 'under_review',
    //                 priority: 'medium',
    //                 documents: [
    //                     { name: 'Non-Profit Certificate', url: 'doc4.pdf', verified: true },
    //                     { name: 'IRS Determination Letter', url: 'doc5.pdf', verified: true }
    //                 ],
    //                 logo: 'https://api.dicebear.com/7.x/initials/svg?seed=GreenEarth',
    //                 socialMedia: {
    //                     linkedin: 'https://linkedin.com/company/greenearth',
    //                     facebook: 'https://facebook.com/greenearth'
    //                 },
    //                 revenue: '$1M - $5M',
    //                 requestReason: 'Organizing environmental awareness events and conferences',
    //                 previousPartnerships: 'WWF, Greenpeace, Sierra Club'
    //             },
    //             {
    //                 id: 3,
    //                 organizationName: 'Creative Arts Studio',
    //                 contactName: 'Michael Brown',
    //                 email: 'mike@creativestudio.com',
    //                 phone: '+1-555-0789',
    //                 website: 'https://creativestudio.com',
    //                 category: 'Arts & Entertainment',
    //                 description: 'Full-service creative agency providing design, photography, and event production services.',
    //                 address: '789 Creative Blvd, New York, NY 10001',
    //                 employeeCount: '10-50',
    //                 foundedYear: '2018',
    //                 requestDate: '2024-07-20',
    //                 status: 'pending',
    //                 priority: 'low',
    //                 documents: [
    //                     { name: 'Business License', url: 'doc6.pdf', verified: false },
    //                     { name: 'Portfolio', url: 'portfolio.pdf', verified: true }
    //                 ],
    //                 logo: 'https://api.dicebear.com/7.x/initials/svg?seed=Creative',
    //                 socialMedia: {
    //                     instagram: 'https://instagram.com/creativestudio',
    //                     behance: 'https://behance.net/creativestudio'
    //                 },
    //                 revenue: '$500K - $1M',
    //                 requestReason: 'Looking to host art exhibitions and creative workshops',
    //                 previousPartnerships: 'Adobe, Canva, Dribbble'
    //             },
    //             {
    //                 id: 4,
    //                 organizationName: 'Global Trade Corp',
    //                 contactName: 'Emily Davis',
    //                 email: 'emily@globaltrade.com',
    //                 phone: '+1-555-0321',
    //                 website: 'https://globaltrade.com',
    //                 category: 'Business Services',
    //                 description: 'International trade and logistics company facilitating global commerce and supply chain solutions.',
    //                 address: '321 Trade Center, Miami, FL 33101',
    //                 employeeCount: '1000+',
    //                 foundedYear: '2005',
    //                 requestDate: '2024-07-12',
    //                 status: 'approved',
    //                 priority: 'high',
    //                 documents: [
    //                     { name: 'Import License', url: 'doc7.pdf', verified: true },
    //                     { name: 'Trade Certificate', url: 'doc8.pdf', verified: true },
    //                     { name: 'Financial Statement', url: 'doc9.pdf', verified: true }
    //                 ],
    //                 logo: 'https://api.dicebear.com/7.x/initials/svg?seed=GlobalTrade',
    //                 socialMedia: {
    //                     linkedin: 'https://linkedin.com/company/globaltrade'
    //                 },
    //                 revenue: '$100M+',
    //                 requestReason: 'Hosting international trade conferences and networking events',
    //                 previousPartnerships: 'FedEx, DHL, Maersk, Chamber of Commerce'
    //             },
    //             {
    //                 id: 5,
    //                 organizationName: 'HealthFirst Clinic',
    //                 contactName: 'Dr. Robert Wilson',
    //                 email: 'dr.wilson@healthfirst.com',
    //                 phone: '+1-555-0654',
    //                 website: 'https://healthfirst.com',
    //                 category: 'Healthcare',
    //                 description: 'Modern healthcare facility providing comprehensive medical services and wellness programs.',
    //                 address: '654 Health Plaza, Chicago, IL 60601',
    //                 employeeCount: '200-500',
    //                 foundedYear: '2012',
    //                 requestDate: '2024-07-10',
    //                 status: 'rejected',
    //                 priority: 'medium',
    //                 documents: [
    //                     { name: 'Medical License', url: 'doc10.pdf', verified: true },
    //                     { name: 'Accreditation', url: 'doc11.pdf', verified: false }
    //                 ],
    //                 logo: 'https://api.dicebear.com/7.x/initials/svg?seed=HealthFirst',
    //                 socialMedia: {
    //                     linkedin: 'https://linkedin.com/company/healthfirst'
    //                 },
    //                 revenue: '$10M - $50M',
    //                 requestReason: 'Organizing medical conferences and health awareness events',
    //                 previousPartnerships: 'Mayo Clinic, Johns Hopkins, AMA',
    //                 rejectionReason: 'Incomplete documentation and missing required certifications'
    //             }
    //         ];
    //         setRequests(mockData);
    //         setLoading(false);
    //     }, 1000);
    // };

    const fetchStatic = useCallback(async (parseQuery) => {
        try {
            setLoading(pre => ({ ...pre, static: true }));

            const res = await httpClient.get(ORGANIZATION_REQUESTS_STATIC_URL).then((res) => res.data);

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

    const fetchData = useCallback(async (parseQuery) => {
        try {
            setLoading(pre => ({ ...pre, list: true }));

            const query = {
                keyword: parseQuery?.keyword || filter.keyword,
                status: parseQuery?.status || filter.status,
                organizationCategory: parseQuery?.organizationCategory || filter.organizationCategory,
                pageNo: parseQuery?.pageNo || filter.pageNo,
                pageSize: parseQuery?.pageSize || filter.pageSize,
            }

            // Simulate API call
            const res = await httpClient.get(objectToQuery(ORGANIZATION_REQUESTS_URL, query)).then((res) => res.data);

            console.log('Fetched data:', res.data);

            if (res.status === 200) {
                setDataSource({ data: res.data, total: res.total });
            } else {
                setDataSource({ data: [], total: 0 });
            }
        } catch (error) {
            setDataSource({ data: [], total: 0 });
        } finally {
            setLoading(pre => ({ ...pre, list: false }));
        }
    }, [filter]);

    const debounceFetchData = useCallback(debounce(fetchData, 300), [fetchData]);

    // Mock data
    useEffect(() => {
        debounceFetchData();

        return debounceFetchData.cancel
    }, [debounceFetchData]);

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
        viewModalRef?.current?.openModal(record);
    };

    const handleApprove = (record) => {
        Modal.confirm({
            title: 'Approve Organization Request',
            content: `Are you sure you want to approve "${record.organizationName}"?`,
            okText: 'Approve',
            okType: 'primary',
            cancelText: 'Cancel',
            async onOk() {
                handleAction(record, 'approved');
            },
        });
    };

    const handleAction = async (record, action) => {
        try {
            setLoading(pre => ({ ...pre, list: true }));

            const payload = {
                status: action === 'approved' ? 'approved' : 'rejected',
            }

            const res = await httpClient.put(UPDATE_ORGANIZATION_REQUESTS_URL.replace(":id", record?._id), payload).then((res) => res.data);

            if (res.status === 200) {
                debounceFetchData();
                message.success(`${record.organizationName} has been ${action} successfully`);
            } else {
                message.error(`Failed to ${action} ${record.organizationName}`);
            }
        } catch (error) {
            console.error("Error during action:", error);
            message.error(`Failed to ${action} ${record.organizationName}`);
        }
    }

    const handleReject = (record) => {
        rejectModalRef.current?.openModal(record);

    };

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
                        <Text type="secondary" style={{ fontSize: '12px' }}>{record.organizationCategory}</Text>
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
            dataIndex: 'createdAt',
            key: 'requestDate',
            render: (date) => (
                <div>
                    <CalendarOutlined style={{ marginRight: '4px' }} />
                    {dayjs(date).format('YYYY-MM-DD')}
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
        <div style={{ background: 'transparent' }}>
            {/* Header Section */}
            <div
                style={{
                    marginBottom: '16px'
                }}
            >
                <h3 style={{ margin: 0, color: '#667eea' }}>
                    Organization Requests
                </h3>
                <p style={{ margin: '4px 0 0 0', color: '#64748b' }}>
                    Review and manage organization registration requests
                </p>
            </div>

            {/* Stats Cards */}
            <Row gutter={16} style={{ marginBottom: '24px' }}>
                <Col span={6}>
                    <Spin spinning={loading.static}>
                        <Card size="small">
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <Text type="secondary">Total Requests</Text>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea' }}>
                                        {statistic.total || 0}
                                    </div>
                                </div>
                                <Avatar icon={<BankOutlined />} style={{ backgroundColor: '#667eea' }} />
                            </div>
                        </Card>
                    </Spin>
                </Col>
                <Col span={6}>
                    <Spin spinning={loading.static}>
                        <Card size="small">
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <Text type="secondary">Pending</Text>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#faad14' }}>
                                        {statistic?.pending || 0}
                                    </div>
                                </div>
                                <Avatar icon={<ClockCircleOutlined />} style={{ backgroundColor: '#faad14' }} />
                            </div>
                        </Card>
                    </Spin>
                </Col>
                <Col span={6}>
                    <Spin spinning={loading.static}>
                        <Card size="small">
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <Text type="secondary">Approved</Text>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                                        {statistic?.approved || 0}
                                    </div>
                                </div>
                                <Avatar icon={<CheckCircleOutlined />} style={{ backgroundColor: '#52c41a' }} />
                            </div>
                        </Card>
                    </Spin>
                </Col>
                <Col span={6}>
                    <Spin spinning={loading.static}>
                        <Card size="small">
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <Text type="secondary">Rejected</Text>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff4d4f' }}>
                                        {statistic?.rejected || 0}
                                    </div>
                                </div>
                                <Avatar icon={<CloseOutlined />} style={{ backgroundColor: '#ff4d4f' }} />
                            </div>
                        </Card>
                    </Spin>
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
                            value={filter.keyword}
                            onChange={(e) => {
                                setFilter(pre => ({ ...pre, keyword: e.target.value, pageNo: 1 }));
                                // setSearchText(e.target.value)
                            }}
                            style={{ width: 250 }}
                        />
                        <Select
                            placeholder="Status"
                            value={filter.status}
                            onChange={(value) => {
                                setFilter(pre => ({ ...pre, status: value, pageNo: 1 }));
                                // setFilterStatus(value)
                            }}
                            style={{ width: 140 }}
                        >
                            <Option value="all">All Status</Option>
                            <Option value="pending">Pending</Option>
                            {/* <Option value="under_review">Under Review</Option> */}
                            <Option value="approved">Approved</Option>
                            <Option value="rejected">Rejected</Option>
                        </Select>
                        <Select
                            placeholder="Category"
                            value={filter.organizationCategory}
                            onChange={(value) => {
                                setFilter(pre => ({ ...pre, organizationCategory: value, pageNo: 1 }));
                                // setFilterCategory(value)
                            }}
                            style={{ width: 160 }}
                        >
                            <Option value="all">All Categories</Option>
                            <Option value="Company">Company</Option>
                            <Option value="Non-Profit">Non-Profit</Option>
                            <Option value="Government">Government</Option>
                            <Option value="School">School</Option>
                            <Option value="Other">Other</Option>
                        </Select>
                    </Space>

                    <Button
                        icon={<ReloadOutlined />}
                        onClick={() => {
                            setFilter(defaultFilter);
                            Promise.all([
                                debounceFetchStatic(defaultFilter),
                                debounceFetchData()
                            ])
                        }}
                        loading={loading.list}
                    >
                        Refresh
                    </Button>
                </div>

                {/* Table */}
                <Table
                    columns={columns}
                    dataSource={dataSource?.data}
                    loading={loading.list}
                    rowKey="id"
                    pagination={{
                        pageSize: filter.pageSize,
                        current: filter.pageNo,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        total: dataSource.total,
                        onChange: (page, pageSize) => {
                            // Fetch data for the selected page
                            setFilter(pre => {
                                debounceFetchData({ ...pre, pageNo: page, pageSize });
                                return ({ ...pre, pageNo: page, pageSize })
                            });
                        },
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} requests`,
                    }}
                />
            </Card>

            {/* View Details Modal */}
            <ViewOrganizationDetailModal
                ref={viewModalRef}
                debounceFetchData={() => {
                    Promise.all([
                        debounceFetchStatic(),
                        debounceFetchData()
                    ])
                }}
                handleReject={handleReject}
                handleApprove={handleApprove}
            />

            <RejectOrganizationModal
                ref={rejectModalRef}
                debounceFetchData={() => {
                    Promise.all([
                        debounceFetchStatic(),
                        debounceFetchData()
                    ])
                }}
            />
        </div>
    );
};

export default OrganizationRequestPage;