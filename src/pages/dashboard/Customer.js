import React from 'react'
import { useState } from 'react';
import { FaMessage } from "react-icons/fa6";
import { FaGift } from "react-icons/fa6";
import { RiNotification2Fill } from "react-icons/ri";
import { IoSettingsOutline } from "react-icons/io5";
import 'antd/dist/reset.css';
import { Table, Button, Space, message } from 'antd';


const dataSource = [
    {
        key: '1',
        name: 'John Doe',
        age: 32,
        address: 'New York',
    },
    {
        key: '2',
        name: 'Jane Smith',
        age: 28,
        address: 'London',
    },
];

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
    },
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
    },
    {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
            <Space>
                <Button type="button" className='btn btn-success' onClick={() => handleEdit(record)}>Publish</Button>
                <Button type="button" className='btn btn-danger' onClick={() => handleDelete(record)}>Delete</Button>
            </Space>
        ),
    },
];

const handleEdit = (record) => {
    message.info(`Editing: ${record.name}`);
};

const handleDelete = (record) => {
    message.error(`Deleted: ${record.name}`);
};

export default function Customer() {

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const rowSelection = {
        selectedRowKeys,
        onChange: setSelectedRowKeys,
    };

    return (
        <div>
            <div className='container-fluid'>

                <div className='row'>
                    <div className='col-xl-2'>
                        <h2 className='h-100 w-50 mb-5'>Reviews</h2>
                    </div>

                    <div className="col-xl-2">
                        <input
                            placeholder="Search here" className='me-5'
                            style={{
                                height: '40px',
                                width: '100%',
                                paddingRight: '30px',
                                paddingLeft: '10px',
                                borderRadius: '5px',
                                backgroundColor: 'black',
                                color: 'white',
                                fontSize: '12px',
                            }}
                        />
                    </div>
                    <div className='col-xl-2'>
                        <button type='button' className='btn btn-secondary me-1'>
                            <IoSettingsOutline />
                        </button>
                    </div>
                    <div className='col-xl-2'>
                        <button type='button' className='btn btn-secondary me-2'>
                            <RiNotification2Fill />
                        </button>
                        <button type='button' className='btn btn-secondary me-2'>
                            <FaMessage />
                        </button>
                        <button type='button' className='btn btn-secondary'>
                            <FaGift />
                        </button>
                    </div>

                    <div className="col-xl-2 ms-auto">
                        <div className="dropdown text-end">
                            <button
                                className="btn btn-dark dropdown-toggle"
                                type="button"
                                id="profileDropdown"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <img
                                    src="./logo192.png"
                                    alt="Profile"
                                    width="30"
                                    height="30"
                                    className="rounded-circle me-2"
                                />

                                David
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                                <li><a className="dropdown-item" href="#">My Profile</a></li>
                                <li><a className="dropdown-item" href="#">Settings</a></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><a className="dropdown-item" href="#">Logout</a></li>
                            </ul>
                        </div>
                    </div>

                </div>

                <div className='row contianer'>
                    <nav className="navbar navbar-expand-xxl border border-dark rounded-3">
                        <div className="container-fluid">
                            <a className="navbar-brand text-secondary fs-6" href="#">Event / Order List</a>
                        </div>
                    </nav>
                </div>


                <div className='mb-5'></div>

                <div className='row'>

                    <div className='col-xl-6'>
                        <div className="d-flex justify-content-between border border-dark bg-dark rounded-3 text-white p-2" style={{ height: "89%", width: "203%" }} >

                            <div className='mb-2 mt-1'>
                                <ul className="nav nav-tabs border-0">
                                    <li className="nav-link">
                                        <a className="text-white text-decoration-none" href="#">All Reviews</a>
                                    </li>
                                    <li className="nav-link">
                                        <a className="text-white text-decoration-none" href="#">Published</a>
                                    </li>
                                    <li className="nav-link">
                                        <a className="text-white text-decoration-none" href="#">Deleted</a>
                                    </li>
                                </ul>
                            </div>


                            <div className='mb-2 mt-1'>
                                <button type="button" className="btn btn-warning me-2">Publish</button>
                                <button type="button" className="btn btn-danger me-2">Delete</button>
                            </div>



                        </div>
                    </div>


                </div>

                <div className='mb-5'></div>

                <Table rowSelection={rowSelection}
                    dataSource={dataSource} columns={columns} />;

            </div>
        </div>
    )
}
