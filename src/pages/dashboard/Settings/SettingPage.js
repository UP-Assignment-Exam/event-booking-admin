import { RiFacebookCircleFill } from "react-icons/ri";

import React, { useState } from 'react';
import {
    Card,
    Row,
    Col,
    Tabs,
    Form,
    Input,
    Select,
    Switch,
    Button,
    Divider,
    Alert,
    Space,
    Typography,
    Radio,
    Slider,
    TimePicker,
    InputNumber,
    Upload,
    Modal,
    List,
    Avatar,
    Badge,
    Tooltip,
    Popconfirm,
    message
} from 'antd';
import {
    SettingOutlined,
    UserOutlined,
    BellOutlined,
    SafetyOutlined,
    GlobalOutlined,
    EyeOutlined,
    ThunderboltOutlined,
    DatabaseOutlined,
    TeamOutlined,
    ApiOutlined,
    // ShieldOutlined,
    KeyOutlined,
    MailOutlined,
    MobileOutlined,
    DesktopOutlined,
    CloudOutlined,
    DownloadOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined,
    CheckCircleOutlined,
    InfoCircleOutlined,
    UploadOutlined,
    SoundOutlined,
    ColorPaletteOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;

const SettingPage = () => {
    const isDarkMode = false; // Simplified for demo
    const [form] = Form.useForm();
    const [activeTab, setActiveTab] = useState('general');
    const [loading, setLoading] = useState(false);
    const [exportModalVisible, setExportModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);

    // Settings state
    const [settings, setSettings] = useState({
        // General Settings
        language: 'en',
        timezone: 'utc-5',
        dateFormat: 'mm/dd/yyyy',
        timeFormat: '12h',
        theme: isDarkMode ? 'dark' : 'light',
        fontSize: 14,
        
        // Notification Settings
        emailNotifications: true,
        pushNotifications: true,
        desktopNotifications: false,
        soundNotifications: true,
        weeklyReports: false,
        marketingEmails: false,
        systemAlerts: true,
        securityAlerts: true,
        
        // Security Settings
        twoFactorAuth: true,
        sessionTimeout: 30,
        loginNotifications: true,
        ipWhitelist: false,
        apiAccess: false,
        
        // Privacy Settings
        profileVisibility: 'public',
        activityVisibility: 'friends',
        dataCollection: true,
        thirdPartySharing: false,
        
        // Performance Settings
        autoSave: true,
        cacheEnabled: true,
        compressionEnabled: true,
        lazyLoading: true,
        animationsEnabled: true,
        
        // Backup Settings
        autoBackup: true,
        backupFrequency: 'daily',
        retentionPeriod: 30,
        cloudSync: true
    });

    const handleSettingChange = (key, value) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
        message.success(`${key} updated successfully`);
    };

    const handleSaveSettings = async () => {
        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            message.success('Settings saved successfully!');
        } catch (error) {
            message.error('Failed to save settings');
        } finally {
            setLoading(false);
        }
    };

    const handleExportData = () => {
        // Simulate data export
        message.success('Data export initiated. You will receive an email when ready.');
        setExportModalVisible(false);
    };

    const handleDeleteAccount = () => {
        // Simulate account deletion
        message.error('Account deletion initiated. This action cannot be undone.');
        setDeleteModalVisible(false);
    };

    const connectedDevices = [
        {
            id: 1,
            name: 'MacBook Pro',
            type: 'desktop',
            lastActive: '2 minutes ago',
            location: 'New York, USA',
            current: true
        },
        {
            id: 2,
            name: 'iPhone 12',
            type: 'mobile',
            lastActive: '1 hour ago',
            location: 'New York, USA',
            current: false
        },
        {
            id: 3,
            name: 'Chrome Windows',
            type: 'desktop',
            lastActive: '2 days ago',
            location: 'California, USA',
            current: false
        }
    ];

    const apiKeys = [
        {
            id: 1,
            name: 'Production API',
            key: 'pk_live_••••••••••••••••••••••••••••',
            created: '2024-01-15',
            lastUsed: '2 hours ago',
            permissions: ['read', 'write']
        },
        {
            id: 2,
            name: 'Development API',
            key: 'pk_test_••••••••••••••••••••••••••••',
            created: '2024-01-20',
            lastUsed: '1 day ago',
            permissions: ['read']
        }
    ];

    const renderGeneralSettings = () => (
        <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
                <Card title="Regional Settings" bordered={false} style={{ marginBottom: 16 }}>
                    <Form layout="vertical">
                        <Form.Item label="Language">
                            <Select 
                                value={settings.language} 
                                onChange={(value) => handleSettingChange('language', value)}
                                style={{ width: '100%' }}
                            >
                                <Option value="en">English</Option>
                                <Option value="es">Spanish</Option>
                                <Option value="fr">French</Option>
                                <Option value="de">German</Option>
                                <Option value="zh">Chinese</Option>
                                <Option value="ja">Japanese</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="Timezone">
                            <Select 
                                value={settings.timezone} 
                                onChange={(value) => handleSettingChange('timezone', value)}
                                style={{ width: '100%' }}
                            >
                                <Option value="utc-12">UTC-12:00 Baker Island</Option>
                                <Option value="utc-8">UTC-08:00 Pacific Time</Option>
                                <Option value="utc-7">UTC-07:00 Mountain Time</Option>
                                <Option value="utc-6">UTC-06:00 Central Time</Option>
                                <Option value="utc-5">UTC-05:00 Eastern Time</Option>
                                <Option value="utc+0">UTC+00:00 Greenwich Mean Time</Option>
                                <Option value="utc+8">UTC+08:00 China Standard Time</Option>
                                <Option value="utc+9">UTC+09:00 Japan Standard Time</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="Date Format">
                            <Radio.Group 
                                value={settings.dateFormat} 
                                onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                            >
                                <Radio value="mm/dd/yyyy">MM/DD/YYYY</Radio>
                                <Radio value="dd/mm/yyyy">DD/MM/YYYY</Radio>
                                <Radio value="yyyy-mm-dd">YYYY-MM-DD</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="Time Format">
                            <Radio.Group 
                                value={settings.timeFormat} 
                                onChange={(e) => handleSettingChange('timeFormat', e.target.value)}
                            >
                                <Radio value="12h">12 Hour</Radio>
                                <Radio value="24h">24 Hour</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Form>
                </Card>
            </Col>
            <Col xs={24} lg={12}>
                <Card title="Display Settings" bordered={false} style={{ marginBottom: 16 }}>
                    <Form layout="vertical">
                        <Form.Item label="Theme">
                            <Radio.Group 
                                value={settings.theme} 
                                onChange={(e) => handleSettingChange('theme', e.target.value)}
                            >
                                <Radio value="light">Light</Radio>
                                <Radio value="dark">Dark</Radio>
                                <Radio value="auto">Auto</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="Font Size">
                            <Slider
                                min={12}
                                max={18}
                                value={settings.fontSize}
                                onChange={(value) => handleSettingChange('fontSize', value)}
                                marks={{
                                    12: '12px',
                                    14: '14px',
                                    16: '16px',
                                    18: '18px'
                                }}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <Text strong>Animations</Text>
                                        <br />
                                        <Text type="secondary">Enable smooth animations and transitions</Text>
                                    </div>
                                    <Switch 
                                        checked={settings.animationsEnabled}
                                        onChange={(checked) => handleSettingChange('animationsEnabled', checked)}
                                    />
                                </div>
                            </Space>
                        </Form.Item>
                    </Form>
                </Card>
            </Col>
        </Row>
    );

    const renderNotificationSettings = () => (
        <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
                <Card title="Notification Preferences" bordered={false} style={{ marginBottom: 16 }}>
                    <Space direction="vertical" style={{ width: '100%' }} size="large">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <Text strong><MailOutlined /> Email Notifications</Text>
                                <br />
                                <Text type="secondary">Receive updates via email</Text>
                            </div>
                            <Switch 
                                checked={settings.emailNotifications}
                                onChange={(checked) => handleSettingChange('emailNotifications', checked)}
                            />
                        </div>
                        <Divider />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <Text strong><MobileOutlined /> Push Notifications</Text>
                                <br />
                                <Text type="secondary">Get instant mobile notifications</Text>
                            </div>
                            <Switch 
                                checked={settings.pushNotifications}
                                onChange={(checked) => handleSettingChange('pushNotifications', checked)}
                            />
                        </div>
                        <Divider />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <Text strong><DesktopOutlined /> Desktop Notifications</Text>
                                <br />
                                <Text type="secondary">Show browser notifications</Text>
                            </div>
                            <Switch 
                                checked={settings.desktopNotifications}
                                onChange={(checked) => handleSettingChange('desktopNotifications', checked)}
                            />
                        </div>
                        <Divider />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <Text strong><SoundOutlined /> Sound Notifications</Text>
                                <br />
                                <Text type="secondary">Play notification sounds</Text>
                            </div>
                            <Switch 
                                checked={settings.soundNotifications}
                                onChange={(checked) => handleSettingChange('soundNotifications', checked)}
                            />
                        </div>
                    </Space>
                </Card>
            </Col>
            <Col xs={24} lg={12}>
                <Card title="Report Settings" bordered={false} style={{ marginBottom: 16 }}>
                    <Space direction="vertical" style={{ width: '100%' }} size="large">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <Text strong>Weekly Reports</Text>
                                <br />
                                <Text type="secondary">Receive weekly activity summaries</Text>
                            </div>
                            <Switch 
                                checked={settings.weeklyReports}
                                onChange={(checked) => handleSettingChange('weeklyReports', checked)}
                            />
                        </div>
                        <Divider />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <Text strong>Marketing Emails</Text>
                                <br />
                                <Text type="secondary">Product updates and promotional content</Text>
                            </div>
                            <Switch 
                                checked={settings.marketingEmails}
                                onChange={(checked) => handleSettingChange('marketingEmails', checked)}
                            />
                        </div>
                        <Divider />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <Text strong>System Alerts</Text>
                                <br />
                                <Text type="secondary">Important system notifications</Text>
                            </div>
                            <Switch 
                                checked={settings.systemAlerts}
                                onChange={(checked) => handleSettingChange('systemAlerts', checked)}
                            />
                        </div>
                        <Divider />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <Text strong>Security Alerts</Text>
                                <br />
                                <Text type="secondary">Login attempts and security warnings</Text>
                            </div>
                            <Switch 
                                checked={settings.securityAlerts}
                                onChange={(checked) => handleSettingChange('securityAlerts', checked)}
                            />
                        </div>
                    </Space>
                </Card>
            </Col>
        </Row>
    );

    const renderSecuritySettings = () => (
        <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
                <Card title="Authentication" bordered={false} style={{ marginBottom: 16 }}>
                    <Space direction="vertical" style={{ width: '100%' }} size="large">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                {/* <Text strong><ShieldOutlined /> Two-Factor Authentication</Text> */}
                                <br />
                                <Text type="secondary">Add extra security layer to your account</Text>
                            </div>
                            <Switch 
                                checked={settings.twoFactorAuth}
                                onChange={(checked) => handleSettingChange('twoFactorAuth', checked)}
                            />
                        </div>
                        <Divider />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <Text strong>Login Notifications</Text>
                                <br />
                                <Text type="secondary">Get notified of login attempts</Text>
                            </div>
                            <Switch 
                                checked={settings.loginNotifications}
                                onChange={(checked) => handleSettingChange('loginNotifications', checked)}
                            />
                        </div>
                        <Divider />
                        <Form.Item label="Session Timeout (minutes)">
                            <InputNumber 
                                min={5} 
                                max={480} 
                                value={settings.sessionTimeout}
                                onChange={(value) => handleSettingChange('sessionTimeout', value)}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                    </Space>
                    
                    <Alert 
                        message="Security Status: Strong"
                        description="Your account security is well configured with 2FA enabled."
                        type="success"
                        showIcon
                        icon={<CheckCircleOutlined />}
                        style={{ marginTop: 16 }}
                    />
                </Card>
            </Col>
            <Col xs={24} lg={12}>
                <Card title="Connected Devices" bordered={false} style={{ marginBottom: 16 }}>
                    <List
                        dataSource={connectedDevices}
                        renderItem={(device) => (
                            <List.Item
                                actions={[
                                    !device.current && (
                                        <Button 
                                            type="text" 
                                            danger 
                                            size="small"
                                            onClick={() => message.success(`${device.name} disconnected`)}
                                        >
                                            Disconnect
                                        </Button>
                                    )
                                ]}
                            >
                                <List.Item.Meta
                                    avatar={
                                        <Badge dot={device.current} color="green">
                                            <Avatar 
                                                icon={device.type === 'mobile' ? <MobileOutlined /> : <DesktopOutlined />} 
                                                style={{ backgroundColor: '#667eea' }}
                                            />
                                        </Badge>
                                    }
                                    title={
                                        <div>
                                            {device.name} 
                                            {device.current && <Badge count="Current" style={{ marginLeft: 8, backgroundColor: '#52c41a' }} />}
                                        </div>
                                    }
                                    description={
                                        <div>
                                            <div>{device.location}</div>
                                            <Text type="secondary">Last active: {device.lastActive}</Text>
                                        </div>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                </Card>
            </Col>
        </Row>
    );

    const renderPrivacySettings = () => (
        <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
                <Card title="Visibility Settings" bordered={false} style={{ marginBottom: 16 }}>
                    <Form layout="vertical">
                        <Form.Item label="Profile Visibility">
                            <Radio.Group 
                                value={settings.profileVisibility} 
                                onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
                            >
                                <Radio value="public">Public</Radio>
                                <Radio value="friends">Friends Only</Radio>
                                <Radio value="private">Private</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="Activity Visibility">
                            <Radio.Group 
                                value={settings.activityVisibility} 
                                onChange={(e) => handleSettingChange('activityVisibility', e.target.value)}
                            >
                                <Radio value="public">Public</Radio>
                                <Radio value="friends">Friends Only</Radio>
                                <Radio value="private">Private</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Form>
                </Card>
            </Col>
            <Col xs={24} lg={12}>
                <Card title="Data & Privacy" bordered={false} style={{ marginBottom: 16 }}>
                    <Space direction="vertical" style={{ width: '100%' }} size="large">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <Text strong>Data Collection</Text>
                                <br />
                                <Text type="secondary">Allow analytics and usage data collection</Text>
                            </div>
                            <Switch 
                                checked={settings.dataCollection}
                                onChange={(checked) => handleSettingChange('dataCollection', checked)}
                            />
                        </div>
                        <Divider />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <Text strong>Third-party Sharing</Text>
                                <br />
                                <Text type="secondary">Share data with trusted partners</Text>
                            </div>
                            <Switch 
                                checked={settings.thirdPartySharing}
                                onChange={(checked) => handleSettingChange('thirdPartySharing', checked)}
                            />
                        </div>
                    </Space>
                    
                    <Divider />
                    <Space>
                        <Button 
                            icon={<DownloadOutlined />}
                            onClick={() => setExportModalVisible(true)}
                        >
                            Export Data
                        </Button>
                        <Button 
                            type="primary" 
                            danger 
                            icon={<DeleteOutlined />}
                            onClick={() => setDeleteModalVisible(true)}
                        >
                            Delete Account
                        </Button>
                    </Space>
                </Card>
            </Col>
        </Row>
    );

    const renderPerformanceSettings = () => (
        <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
                <Card title="Application Performance" bordered={false} style={{ marginBottom: 16 }}>
                    <Space direction="vertical" style={{ width: '100%' }} size="large">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <Text strong>Auto-save</Text>
                                <br />
                                <Text type="secondary">Automatically save your work</Text>
                            </div>
                            <Switch 
                                checked={settings.autoSave}
                                onChange={(checked) => handleSettingChange('autoSave', checked)}
                            />
                        </div>
                        <Divider />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <Text strong>Cache Enabled</Text>
                                <br />
                                <Text type="secondary">Store data locally for faster loading</Text>
                            </div>
                            <Switch 
                                checked={settings.cacheEnabled}
                                onChange={(checked) => handleSettingChange('cacheEnabled', checked)}
                            />
                        </div>
                        <Divider />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <Text strong>Compression</Text>
                                <br />
                                <Text type="secondary">Compress data to save bandwidth</Text>
                            </div>
                            <Switch 
                                checked={settings.compressionEnabled}
                                onChange={(checked) => handleSettingChange('compressionEnabled', checked)}
                            />
                        </div>
                        <Divider />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <Text strong>Lazy Loading</Text>
                                <br />
                                <Text type="secondary">Load content as needed</Text>
                            </div>
                            <Switch 
                                checked={settings.lazyLoading}
                                onChange={(checked) => handleSettingChange('lazyLoading', checked)}
                            />
                        </div>
                    </Space>
                </Card>
            </Col>
            <Col xs={24} lg={12}>
                <Card title="Backup Settings" bordered={false} style={{ marginBottom: 16 }}>
                    <Form layout="vertical">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <div>
                                <Text strong><CloudOutlined /> Auto Backup</Text>
                                <br />
                                <Text type="secondary">Automatically backup your data</Text>
                            </div>
                            <Switch 
                                checked={settings.autoBackup}
                                onChange={(checked) => handleSettingChange('autoBackup', checked)}
                            />
                        </div>
                        <Divider />
                        <Form.Item label="Backup Frequency">
                            <Select 
                                value={settings.backupFrequency} 
                                onChange={(value) => handleSettingChange('backupFrequency', value)}
                                disabled={!settings.autoBackup}
                                style={{ width: '100%' }}
                            >
                                <Option value="hourly">Hourly</Option>
                                <Option value="daily">Daily</Option>
                                <Option value="weekly">Weekly</Option>
                                <Option value="monthly">Monthly</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="Retention Period (days)">
                            <InputNumber 
                                min={7} 
                                max={365} 
                                value={settings.retentionPeriod}
                                onChange={(value) => handleSettingChange('retentionPeriod', value)}
                                disabled={!settings.autoBackup}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <Text strong>Cloud Sync</Text>
                                <br />
                                <Text type="secondary">Sync data across devices</Text>
                            </div>
                            <Switch 
                                checked={settings.cloudSync}
                                onChange={(checked) => handleSettingChange('cloudSync', checked)}
                            />
                        </div>
                    </Form>
                </Card>
            </Col>
        </Row>
    );

    const renderAPISettings = () => (
        <Row gutter={[24, 24]}>
            <Col xs={24}>
                <Card title="API Keys" bordered={false} style={{ marginBottom: 16 }}>
                    <div style={{ marginBottom: 16 }}>
                        <Button type="primary" icon={<KeyOutlined />}>
                            Generate New API Key
                        </Button>
                    </div>
                    <List
                        dataSource={apiKeys}
                        renderItem={(apiKey) => (
                            <List.Item
                                actions={[
                                    <Button type="text" size="small">View</Button>,
                                    <Button type="text" size="small">Regenerate</Button>,
                                    <Button type="text" danger size="small">Delete</Button>
                                ]}
                            >
                                <List.Item.Meta
                                    avatar={<Avatar icon={<ApiOutlined />} style={{ backgroundColor: '#667eea' }} />}
                                    title={apiKey.name}
                                    description={
                                        <div>
                                            <div><Text code>{apiKey.key}</Text></div>
                                            <div>
                                                <Text type="secondary">Created: {apiKey.created}</Text> • 
                                                <Text type="secondary"> Last used: {apiKey.lastUsed}</Text>
                                            </div>
                                            <div>
                                                Permissions: {apiKey.permissions.map(perm => (
                                                    <span key={perm} style={{ marginRight: 8 }}>
                                                        <Badge color={perm === 'write' ? 'orange' : 'blue'} text={perm} />
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                </Card>
            </Col>
        </Row>
    );

    return (
        <div>
            {/* Header */}
            <Card bordered={false} style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <Title level={2} style={{ margin: 0, marginBottom: 8 }}>
                            <SettingOutlined /> Settings
                        </Title>
                        <Text type="secondary">Manage your account preferences and system settings</Text>
                    </div>
                    <Button 
                        type="primary" 
                        icon={<CheckCircleOutlined />}
                        loading={loading}
                        onClick={handleSaveSettings}
                        size="large"
                    >
                        Save All Settings
                    </Button>
                </div>
            </Card>

            {/* Settings Content */}
            <Card bordered={false}>
                <Tabs 
                    activeKey={activeTab} 
                    onChange={setActiveTab}
                    tabPosition="left"
                    items={[
                        {
                            key: 'general',
                            label: (
                                <span>
                                    <GlobalOutlined />
                                    General
                                </span>
                            ),
                            children: renderGeneralSettings()
                        },
                        {
                            key: 'notifications',
                            label: (
                                <span>
                                    <BellOutlined />
                                    Notifications
                                </span>
                            ),
                            children: renderNotificationSettings()
                        },
                        {
                            key: 'security',
                            label: (
                                <span>
                                    <SafetyOutlined />
                                    Security
                                </span>
                            ),
                            children: renderSecuritySettings()
                        },
                        {
                            key: 'privacy',
                            label: (
                                <span>
                                    <EyeOutlined />
                                    Privacy
                                </span>
                            ),
                            children: renderPrivacySettings()
                        },
                        {
                            key: 'performance',
                            label: (
                                <span>
                                    <ThunderboltOutlined />
                                    Performance
                                </span>
                            ),
                            children: renderPerformanceSettings()
                        },
                        {
                            key: 'api',
                            label: (
                                <span>
                                    <ApiOutlined />
                                    API
                                </span>
                            ),
                            children: renderAPISettings()
                        }
                    ]}
                    style={{ height: '100%' }}
                />
            </Card>
        </div>
    );
}

export default SettingPage;