import { useEffect, useState, useCallback } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { PING_URL } from '../constants/Url';
import httpClient from '../utils/HttpClient';
import { Spin } from 'antd';

export default function AdminGuard() {
    // const [auth, setAuth] = useState(false);
    // const [loading, setLoading] = useState(true);

    // const pingBackend = useCallback(async () => {
    //     try {
    //         await httpClient.get(PING_URL);
    //         setAuth(true);
    //     } catch (err) {
    //         setAuth(false);
    //     } finally {
    //         setLoading(false);
    //     }
    // }, []);

    // useEffect(() => {
    //     pingBackend();
    // }, [pingBackend]);

    // if (loading) return <Spin fullscreen />

    // return auth ? <Outlet /> : <Navigate to="/login" replace />;

    return <Outlet />;
}
