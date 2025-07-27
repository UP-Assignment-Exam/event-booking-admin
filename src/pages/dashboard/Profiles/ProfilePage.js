import React, { useRef, useState } from 'react';
import {
    Card,
    Row,
    Col,
    Avatar,
    Button,
    Tabs,
    Form,
    Input,
    Select,
    DatePicker,
    Upload,
    Switch,
    Divider,
    Tag,
    Progress,
    Timeline,
    Statistic,
    Badge,
    Space,
    Tooltip,
    Alert,
    Modal
} from 'antd';
import {
    UserOutlined,
    EditOutlined,
    MailOutlined,
    PhoneOutlined,
    EnvironmentOutlined,
    CalendarOutlined,
    BankOutlined,
    SafetyOutlined,
    SettingOutlined,
    CameraOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    TrophyOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import './ProfilePage.css';
import { useNavigate } from 'react-router-dom';
import EditProfileModal from './components/modals/EditProfileModal';
import UploadProfileModal from './components/modals/UploadProfileModal';

const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

const ProfilePage = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const isDarkMode = useSelector((state) => state.theme.isDarkMode);
    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [avatarModalVisible, setAvatarModalVisible] = useState(false);

    const editProfileModalRef = useRef(null);
    const uploadProfileModalRef = useRef(null);

    // Mock user data
    const [userProfile, setUserProfile] = useState({
        id: 'USR001',
        name: 'John Doe',
        email: 'john.doe@company.com',
        phone: '+1 (555) 123-4567',
        role: 'Super Admin',
        department: 'IT Administration',
        location: 'New York, USA',
        joinDate: '2022-01-15',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
        bio: 'Experienced system administrator with over 8 years in IT management. Passionate about automation and security.',
        status: 'active',
        lastLogin: '2024-01-20 14:30:00',
        profileCompletion: 85,
        totalLogins: 2847,
        organizationsManaged: 12,
        eventsCreated: 156
    });
    
    const profileStats = [
        {
            title: 'Total Logins',
            value: userProfile.totalLogins,
            prefix: <UserOutlined style={{ color: '#667eea' }} />,
            suffix: 'times'
        },
        {
            title: 'Organizations',
            value: userProfile.organizationsManaged,
            prefix: <BankOutlined style={{ color: '#52c41a' }} />,
            suffix: 'managed'
        },
        {
            title: 'Events Created',
            value: userProfile.eventsCreated,
            prefix: <CalendarOutlined style={{ color: '#faad14' }} />,
            suffix: 'events'
        },
        {
            title: 'Profile Score',
            value: userProfile.profileCompletion,
            prefix: <TrophyOutlined style={{ color: '#ff4d4f' }} />,
            suffix: '%'
        }
    ];

    const activityTimeline = [
        {
            color: '#667eea',
            dot: <CheckCircleOutlined style={{ fontSize: '16px', color: '#667eea' }} />,
            children: (
                <div>
                    <p><strong>Profile Updated</strong></p>
                    <p className="timeline-desc">Updated contact information and preferences</p>
                    <p className="timeline-time">2 hours ago</p>
                </div>
            )
        },
        {
            color: '#52c41a',
            dot: <UserOutlined style={{ fontSize: '16px', color: '#52c41a' }} />,
            children: (
                <div>
                    <p><strong>Successful Login</strong></p>
                    <p className="timeline-desc">Logged in from Chrome on Windows</p>
                    <p className="timeline-time">1 day ago</p>
                </div>
            )
        },
        {
            color: '#faad14',
            dot: <CalendarOutlined style={{ fontSize: '16px', color: '#faad14' }} />,
            children: (
                <div>
                    <p><strong>Event Created</strong></p>
                    <p className="timeline-desc">Created "Annual Tech Conference 2024"</p>
                    <p className="timeline-time">3 days ago</p>
                </div>
            )
        },
        {
            color: '#ff4d4f',
            dot: <SafetyOutlined style={{ fontSize: '16px', color: '#ff4d4f' }} />,
            children: (
                <div>
                    <p><strong>Password Changed</strong></p>
                    <p className="timeline-desc">Security password updated successfully</p>
                    <p className="timeline-time">1 week ago</p>
                </div>
            )
        }
    ];

    const activeStatus = {
        true: "Active",
        false: "Inactive"
    }

    return (
        <div className={`profile-detail ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
            {/* Header Section */}
            <Card className="profile-header-card" bordered={false}>
                <Row gutter={24} align="middle">
                    <Col xs={24} sm={6} md={4}>
                        <div className="avatar-section">
                            <Badge
                                count={
                                    <Button
                                        type="primary"
                                        shape="circle"
                                        size="small"
                                        icon={<CameraOutlined />}
                                        onClick={() => uploadProfileModalRef?.current?.openModal()}
                                    />
                                }
                                offset={[-5, 35]}
                            >
                                <Avatar
                                    size={120}
                                    src={user?.avatar}
                                    className="profile-avatar"
                                />
                            </Badge>
                        </div>
                    </Col>
                    <Col xs={24} sm={12} md={14}>
                        <div className="profile-info">
                            <div className="profile-name-section">
                                <h2 className="profile-name">{user?.username}</h2>
                                <Tag color="success" className="status-tag">
                                    <Badge status="success" /> {activeStatus[user?.status]?.toUpperCase()}
                                </Tag>
                            </div>
                            <p className="profile-role">{user.role?.name}</p>
                            <Space size="large" className="profile-meta">
                                <span><EnvironmentOutlined /> {user?.location || "N/A"}</span>
                                <span><CalendarOutlined /> Joined {dayjs(user?.createdAt).format('MMM DD, YYYY')}</span>
                            </Space>
                            <div className="profile-completion">
                                <span>Profile Completion</span>
                                <Progress
                                    percent={userProfile.profileCompletion}
                                    size="small"
                                    strokeColor={{
                                        '0%': '#667eea',
                                        '100%': '#764ba2',
                                    }}
                                />
                            </div>
                        </div>
                    </Col>
                    <Col xs={24} sm={6} md={6}>
                        <div className="profile-actions">
                            <Button
                                type="primary"
                                icon={<EditOutlined />}
                                onClick={() => editProfileModalRef?.current?.openModal()}
                                className="edit-profile-btn"
                            >
                                Edit Profile
                            </Button>
                            <Button
                                icon={<SettingOutlined />}
                                className="settings-btn"
                                onClick={() => navigate("/preferences")}
                            >
                                Settings
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Card>

            {/* Statistics Cards */}
            <Row gutter={[16, 16]} className="stats-section">
                {profileStats.map((stat, index) => (
                    <Col xs={24} sm={12} md={6} key={index}>
                        <Card className="stat-card" bordered={false}>
                            <Statistic
                                title={stat.title}
                                value={stat.value}
                                prefix={stat.prefix}
                                suffix={stat.suffix}
                            />
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Main Content Tabs */}
            <Card className="profile-content-card" bordered={false}>
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    className="profile-tabs"
                >
                    <TabPane tab="Overview" key="overview">
                        <Row gutter={[24, 24]}>
                            <Col xs={24} lg={16}>
                                <Card title="Personal Information" className="info-card" bordered={false}>
                                    <Row gutter={[16, 16]}>
                                        <Col xs={24} sm={12}>
                                            <div className="info-item">
                                                <label><MailOutlined /> Email</label>
                                                <p>{user?.email}</p>
                                            </div>
                                        </Col>
                                        <Col xs={24} sm={12}>
                                            <div className="info-item">
                                                <label><PhoneOutlined /> Phone</label>
                                                <p>{user?.phone}</p>
                                            </div>
                                        </Col>
                                        <Col xs={24} sm={12}>
                                            <div className="info-item">
                                                <label><UserOutlined /> Employee ID</label>
                                                <p>{user?._id}</p>
                                            </div>
                                        </Col>
                                        <Col xs={24} sm={12}>
                                            <div className="info-item">
                                                <label><ClockCircleOutlined /> Last Login</label>
                                                <p>{dayjs(user?.lastLogin).format('MMM DD, YYYY HH:mm')}</p>
                                            </div>
                                        </Col>
                                        <Col xs={24}>
                                            <div className="info-item">
                                                <label><UserOutlined /> Bio</label>
                                                <p>{user?.bio}</p>
                                            </div>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                            <Col xs={24} lg={8}>
                                <Card title="Recent Activity" className="activity-card" bordered={false}>
                                    <Timeline items={activityTimeline} />
                                </Card>
                            </Col>
                        </Row>
                    </TabPane>

                    <TabPane tab="Security" key="security">
                        <Row gutter={[24, 24]}>
                            <Col xs={24} lg={12}>
                                <Card title="Password & Security" className="security-card" bordered={false}>
                                    <Form layout="vertical">
                                        <Form.Item label="Current Password">
                                            <Input.Password
                                                placeholder="Enter current password"
                                                iconRender={visible => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
                                            />
                                        </Form.Item>
                                        <Form.Item label="New Password">
                                            <Input.Password
                                                placeholder="Enter new password"
                                                iconRender={visible => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
                                            />
                                        </Form.Item>
                                        <Form.Item label="Confirm New Password">
                                            <Input.Password
                                                placeholder="Confirm new password"
                                                iconRender={visible => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
                                            />
                                        </Form.Item>
                                        <Button type="primary" className="update-password-btn">
                                            Update Password
                                        </Button>
                                    </Form>
                                </Card>
                            </Col>
                            <Col xs={24} lg={12}>
                                <Card title="Security Settings" className="security-settings-card" bordered={false}>
                                    <div className="security-option">
                                        <div>
                                            <h4>Two-Factor Authentication</h4>
                                            <p>Add an extra layer of security to your account</p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                    <Divider />
                                    <div className="security-option">
                                        <div>
                                            <h4>Login Notifications</h4>
                                            <p>Get notified when someone logs into your account</p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                    <Divider />
                                    <div className="security-option">
                                        <div>
                                            <h4>Session Timeout</h4>
                                            <p>Automatically log out after 30 minutes of inactivity</p>
                                        </div>
                                        <Switch />
                                    </div>
                                    <Divider />
                                    <Alert
                                        message="Security Score: Strong"
                                        description="Your account security settings are well configured."
                                        type="success"
                                        showIcon
                                        icon={<SafetyOutlined />}
                                    />
                                </Card>
                            </Col>
                        </Row>
                    </TabPane>

                    <TabPane tab="Preferences" key="preferences">
                        <Row gutter={[24, 24]}>
                            <Col xs={24} lg={12}>
                                <Card title="General Preferences" className="preferences-card" bordered={false}>
                                    <Form layout="vertical">
                                        <Form.Item label="Language">
                                            <Select defaultValue="en" className="pref-select">
                                                <Option value="en">English</Option>
                                                <Option value="es">Spanish</Option>
                                                <Option value="fr">French</Option>
                                                <Option value="de">German</Option>
                                            </Select>
                                        </Form.Item>
                                        <Form.Item label="Timezone">
                                            <Select defaultValue="utc-5" className="pref-select">
                                                <Option value="utc-8">Pacific Time (UTC-8)</Option>
                                                <Option value="utc-7">Mountain Time (UTC-7)</Option>
                                                <Option value="utc-6">Central Time (UTC-6)</Option>
                                                <Option value="utc-5">Eastern Time (UTC-5)</Option>
                                            </Select>
                                        </Form.Item>
                                        <Form.Item label="Date Format">
                                            <Select defaultValue="mm/dd/yyyy" className="pref-select">
                                                <Option value="mm/dd/yyyy">MM/DD/YYYY</Option>
                                                <Option value="dd/mm/yyyy">DD/MM/YYYY</Option>
                                                <Option value="yyyy-mm-dd">YYYY-MM-DD</Option>
                                            </Select>
                                        </Form.Item>
                                    </Form>
                                </Card>
                            </Col>
                            <Col xs={24} lg={12}>
                                <Card title="Notification Preferences" className="notification-card" bordered={false}>
                                    <div className="notification-option">
                                        <div>
                                            <h4>Email Notifications</h4>
                                            <p>Receive updates via email</p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                    <Divider />
                                    <div className="notification-option">
                                        <div>
                                            <h4>Push Notifications</h4>
                                            <p>Get instant notifications</p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                    <Divider />
                                    <div className="notification-option">
                                        <div>
                                            <h4>Weekly Reports</h4>
                                            <p>Receive weekly activity summaries</p>
                                        </div>
                                        <Switch />
                                    </div>
                                    <Divider />
                                    <div className="notification-option">
                                        <div>
                                            <h4>Marketing Emails</h4>
                                            <p>Receive product updates and news</p>
                                        </div>
                                        <Switch />
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                    </TabPane>
                </Tabs>
            </Card>


            {/* Avatar Upload Modal */}
            <UploadProfileModal
                ref={uploadProfileModalRef}
            />

            {/* Edit Profile Modal */}
            <EditProfileModal
                ref={editProfileModalRef}
            />
        </div>
    );
};

export default ProfilePage;