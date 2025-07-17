import React from 'react'
import { Outlet } from 'react-router'

export default function AuthLayout() {
    return (
        <div className='auth-background position-relative'>
            <div className='container-fluid min-vh-100 d-flex justify-content-center align-items-center'>
                <div className="row justify-content-center align-items-center w-100">
                    <div className="col-md-5 col-lg-4 py-5">
                        <div className="shadow-lg auth-card">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
