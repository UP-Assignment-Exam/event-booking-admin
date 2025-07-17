import React from 'react'
import { Outlet, NavLink } from 'react-router'
import { FaBars } from "react-icons/fa";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RxDashboard } from "react-icons/rx";
import { MdEventNote } from "react-icons/md";
import { IoPersonOutline } from "react-icons/io5";
import { CiHome } from "react-icons/ci";
import { CiSettings } from "react-icons/ci";

export default function AdminLayout({ children }) {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
    const navigate = useNavigate();

    const menuItem = [
        {
            path: 'Dashboard',
            name: 'Dashboard',
            icon: <RxDashboard />
        },
        {
            path: 'Event',
            name: 'Event',
            icon: <MdEventNote />
        },
        {
            path: 'Customer',
            name: 'Customer',
            icon: <IoPersonOutline />
        },
        {
            path: 'Theater',
            name: 'Theater',
            icon: <CiHome />
        },
        {
            path: 'setting',
            name: 'setting',
            icon: <CiSettings />
        }
    ]
    
    return (
        <div className="d-flex">
            <div
                className={`bg-dark text-white min-vh-100 d-flex flex-column p-3 transition-all`}
                style={{ width: isOpen ? '200px' : '65px' }}
            >
                <div className="d-flex align-items-center justify-content-between mb-3">
                    {isOpen && <h5 className="ms-2 mb-0">AdminLayout</h5>}
                    <button className="btn btn-outline-light btn-sm ms-auto" onClick={toggle}>
                        <FaBars />
                    </button>
                </div>

                {menuItem.map((item, index) => (
                    <NavLink
                        to={item.path}
                        key={index}
                        className={({ isActive }) =>
                            `nav-link text-white d-flex align-items-center my-2 ${isActive ? 'active bg-secondary rounded' : ''}`
                        }
                    >
                        <div className="d-flex justify-content-center align-items-center" style={{ width: '40px', height: '40px' }}>{item.icon}</div>
                        {isOpen && <span>{item.name}</span>}
                    </NavLink>
                ))}
                
            </div>

            <div className="flex-grow-1 p-3">
                <Outlet />
            </div>
        </div>
    )
};
