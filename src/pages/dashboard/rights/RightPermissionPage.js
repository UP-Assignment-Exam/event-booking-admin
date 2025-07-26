import React, { useCallback, useEffect, useState } from 'react';
import {
    Space,
    Card,
    Row,
    Col,
    Tag,
    Skeleton,
} from 'antd';
import { debounce } from 'lodash';
import httpClient from '../../../utils/HttpClient';
import { RIGHT_PERMISSIONS_URL } from '../../../constants/Url';
import { groupRightsByCategory } from '../../../utils/Utils';

export default function RightPermissionPage() {
    const [loading, setLoading] = useState(true);
    const [permissions, setPermissions] = useState([]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await httpClient.get(RIGHT_PERMISSIONS_URL).then(res => res.data)

            if (res.status === 200) {
                setPermissions(groupRightsByCategory(res.data));
            } else {
                setPermissions([]);
            }
        } catch (error) {
            setPermissions([]);
            console.error("Error fetching permissions:", error);
        } finally {
            setLoading(false);
        }
    }, [])

    const debounceFetchData = useCallback(debounce(fetchData, 300), [fetchData]);

    useEffect(() => {
        debounceFetchData();
        return debounceFetchData.cancel;
    }, [debounceFetchData])

    // Simulated skeleton count
    const skeletonCards = Array.from({ length: 6 });

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
                    {loading
                        ? skeletonCards.map((_, idx) => (
                            <Col xs={24} sm={12} lg={8} key={idx}>
                                <Card size="small">
                                    <Skeleton active title paragraph={{ rows: 4 }} />
                                </Card>
                            </Col>
                        ))
                        : permissions.map((category) => (
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
                                            <div key={perm._id} style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                padding: '4px 0'
                                            }}>
                                                <span style={{ fontSize: '13px' }}>
                                                    {perm.name?.split(':')[1]?.toUpperCase()}
                                                </span>
                                                <Tag size="small" color="blue">
                                                    {perm.name}
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
