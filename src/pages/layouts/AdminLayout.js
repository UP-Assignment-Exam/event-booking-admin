import React, { useEffect, useState } from 'react';
import {
    Layout,
    Menu,
    Dropdown,
    Avatar,
    Badge,
    Button,
    Tooltip,
    Switch,
} from 'antd';
import {
    DashboardOutlined,
    CalendarOutlined,
    AppstoreOutlined,
    UserOutlined,
    BankOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    BellOutlined,
    SettingOutlined,
    LogoutOutlined,
    MoonOutlined,
    SunOutlined
} from '@ant-design/icons';
import { TiTicket } from 'react-icons/ti';
import "./AdminLayout.css"; // Assuming you have a CSS file for styles
import { Outlet, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../global/slices/ThemeSlice';
import { AiOutlineBank } from 'react-icons/ai';

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isDarkMode = useSelector((state) => state.theme.isDarkMode);
    const [collapsed, setCollapsed] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState(['dashboard']);

    // Enhanced dark mode state with system preference detection
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('userTheme');
        if (saved) return saved === 'dark';

        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return true;
        }
        return false;
    });

    useEffect(() => {
        setDarkMode(isDarkMode);
    }, [isDarkMode])

    // Menu items configuration
    const menuItems = [
        {
            key: 'dashboard',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
        },
        {
            key: 'events',
            icon: <CalendarOutlined />,
            label: 'Events',
        },
        {
            key: 'categories',
            icon: <AppstoreOutlined />,
            label: 'Categories',
        },
        {
            key: 'payment-methods',
            icon: <AiOutlineBank />,
            label: 'Payment Methods',
        },
        {
            key: 'tickets',
            icon: <TiTicket />,
            label: 'Ticket Management',
            children: [
                { key: 'ticket-types', label: 'Ticket Types' },
                { key: 'tickets-list', label: 'All Tickets' },
                { key: 'tickets-sales', label: 'Ticket Sales' },
            ]
        },
        {
            key: 'user-management',
            icon: <UserOutlined />,
            label: 'User Management',
            children: [
                { key: 'users', label: 'Users' },
                { key: 'roles', label: 'Roles' },
                { key: 'rights', label: 'Rights & Permissions' },
            ]
        },
        {
            key: 'organizations',
            icon: <BankOutlined />,
            label: 'Organizations',
        },
    ];

    // User dropdown menu
    const userMenuItems = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: 'Profile Settings',
        },
        {
            key: 'preferences',
            icon: <SettingOutlined />,
            label: 'Preferences',
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Logout',
            danger: true,
        },
    ];

    const handleMenuClick = ({ key }) => {
        navigate(`/${key}`);
        console.log('Selected menu:', key);
        setSelectedKeys([key]);
    };

    const handleUserMenuClick = ({ key }) => {
        if (key === 'logout') {
            navigate(`/login`);
            console.log('Logging out...');
        } else {
            navigate(`/${key}`);
            console.log('User menu action:', key);
        }
    };

    const toggleDarkMode = (checked) => {
        setDarkMode(checked);
        dispatch(toggleTheme())
        // Save preference to localStorage
        localStorage.setItem('userTheme', checked ? 'dark' : 'light');
        // In real app, you might also update user preferences via API
    };

    return (
        <div className={`admin-layout ${darkMode ? 'dark-theme' : 'light-theme'}`}>
            <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
                <Sider
                    trigger={null}
                    collapsible
                    collapsed={collapsed}
                    className="admin-sidebar"
                    width={280}
                    collapsedWidth={80}
                >
                    <div className="p-4 text-center border-bottom">
                        <div style={{
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: collapsed ? 'center' : 'flex-start',
                            gap: '12px'
                        }}>
                            <div style={{
                                width: '32px',
                                height: '32px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '16px'
                            }}>
                                A
                            </div>
                            {!collapsed && (
                                <span style={{
                                    fontWeight: 'bold',
                                    fontSize: '18px',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text'
                                }}>
                                    Admin Panel
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="sidebar-menu">
                        <Menu
                            mode="inline"
                            selectedKeys={selectedKeys}
                            onClick={handleMenuClick}
                            items={menuItems}
                            style={{
                                border: 'none',
                                background: 'transparent'
                            }}
                        />
                    </div>
                </Sider>

                <Layout style={{ background: 'transparent', overflow: 'hidden', maxHeight: "100dvh" }}>
                    <Header className="admin-header">
                        <div className="header-content">
                            <div className="header-left">
                                <Button
                                    type="text"
                                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                    onClick={() => setCollapsed(!collapsed)}
                                    className="toggle-btn"
                                />
                            </div>

                            <div className="header-right">
                                <div className="dark-mode-switch">
                                    <SunOutlined />
                                    <Switch
                                        size="small"
                                        checked={darkMode}
                                        onChange={toggleDarkMode}
                                        checkedChildren={<MoonOutlined />}
                                        unCheckedChildren={<SunOutlined />}
                                    />
                                </div>

                                <Tooltip title="Notifications">
                                    <Badge count={5} size="small">
                                        <Button
                                            type="text"
                                            icon={<BellOutlined />}
                                            className="notification-btn"
                                        />
                                    </Badge>
                                </Tooltip>

                                <Dropdown
                                    menu={{
                                        items: userMenuItems,
                                        onClick: handleUserMenuClick,
                                    }}
                                    trigger={['click']}
                                    placement="bottomRight"
                                >
                                    <div className="user-profile">
                                        <div className="user-info">
                                            <div className="user-name">John Doe</div>
                                            <div className="user-role">Super Admin</div>
                                        </div>
                                        <Avatar
                                            size={36}
                                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
                                            style={{
                                                border: '2px solid #667eea',
                                                boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
                                            }}
                                        />
                                    </div>
                                </Dropdown>
                            </div>
                        </div>
                    </Header>

                    <Content className="admin-content">
                        <Outlet />
                    </Content>
                </Layout>
            </Layout>
        </div>
    );
};

export default AdminLayout;