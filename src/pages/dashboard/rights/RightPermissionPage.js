import React, { useState } from 'react';
import {
    Space,
    Card,
    Row,
    Col,
    Tag,
} from 'antd';

export default function RightPermissionPage() {
    const [permissions, setPermissions] = useState([
        { category: 'Users', permissions: ['users.create', 'users.read', 'users.update', 'users.delete'] },
        { category: 'Events', permissions: ['events.create', 'events.read', 'events.update', 'events.delete'] },
        { category: 'Tickets', permissions: ['tickets.create', 'tickets.read', 'tickets.update', 'tickets.delete'] },
        { category: 'Roles', permissions: ['roles.create', 'roles.read', 'roles.update', 'roles.delete'] },
        { category: 'Organizations', permissions: ['orgs.create', 'orgs.read', 'orgs.update', 'orgs.delete'] },
    ]);

    return (
        <div>
            <div style={{ marginBottom: '16px' }}>
                <h3 style={{ margin: 0, color: '#667eea' }}>System Permissions</h3>
                <p style={{ margin: '4px 0 0 0', color: '#64748b' }}>
                    Available permissions organized by category
                </p>
            </div>
            <Card>
                <Row gutter={[16, 16]}>
                    {permissions.map((category) => (
                        <Col xs={24} sm={12} lg={8} key={category.category}>
                            <Card
                                size="small"
                                title={category.category}
                                style={{
                                    borderLeft: '4px solid #667eea',
                                    background: 'rgba(102, 126, 234, 0.02)'
                                }}
                            >
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    {category.permissions.map((perm) => (
                                        <div key={perm} style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            padding: '4px 0'
                                        }}>
                                            <span style={{ fontSize: '13px' }}>
                                                {perm.split('.')[1]?.toUpperCase()}
                                            </span>
                                            <Tag size="small" color="blue">
                                                {perm}
                                            </Tag>
                                        </div>
                                    ))}
                                </Space>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Card>
        </div>
    )
}
