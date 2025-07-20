import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router'

export default function AuthLayout() {
    const isDarkMode = useSelector((state) => state.theme.isDarkMode);

    return (
        <div className={`auth-background position-relative ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
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
