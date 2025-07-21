import React from 'react'
import { Outlet } from 'react-router-dom'

export default function AdminGuard() {
    return (
        <Outlet />
    )
}
