import React from 'react'
import { useState } from 'react';
import { Flex, Table } from 'antd';
import { FaMessage } from "react-icons/fa6";
import { FaGift } from "react-icons/fa6";
import { RiNotification2Fill } from "react-icons/ri";
import { IoSettingsOutline } from "react-icons/io5";

const columns = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Age', dataIndex: 'age' },
    { title: 'Address', dataIndex: 'address' },
];
const dataSource = Array.from({ length: 46 }).map((_, i) => ({
    key: i,
    name: `Edward King ${i}`,
    age: 32,
    address: `London, Park Lane no. ${i}`,
}));
export default function Event() {

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const onSelectChange = newSelectedRowKeys => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0
    return (
        <div>
            <div className='container-fluid'>

                <div className='row'>
                    <div className='col-xl-2'>
                        <h2 className='h-100 w-50 mb-5'>Event</h2>
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
                        <div className="d-flex justify-content-between border border-dark bg-dark rounded-3 text-white p-2" style={{ height: "80%", width: "150%" }} >

                            <div className='ms-3 mt-1'>
                                <p className='small text-secondary'>
                                    Lorem ipsum dolor sit amel,
                                    <p>consectetur adipiscing elit,</p>
                                </p>
                            </div>

                            <div className='ms-3'>
                                <div className='ms-5'>
                                    <span className='large'>Total Customer</span>
                                </div>
                                <div className='mb-2 ms-3'>
                                    <i className="bi bi-person-circle me-3"></i>
                                    <span className='text-sm'>129,000 Person</span>
                                </div>
                            </div>


                            <div className='ms-3'>
                                <div className='ms-5'>
                                    <span className='large'>Total Customer</span>
                                </div>
                                <div className='mb-2 ms-3'>
                                    <i className="bi bi-person-circle me-3"></i>
                                    <span className='text-sm'>129,000 Person</span>
                                </div>
                            </div>

                            <div className='ms-3'>
                                <div className='ms-5'>
                                    <span className='large'>Total Customer</span>
                                </div>
                                <div className='mb-2 ms-3'>
                                    <i className="bi bi-person-circle me-3"></i>
                                    <span className='text-sm'>129,000 Person</span>
                                </div>
                            </div>

                            <div className='ms-5'>
                                <button
                                    className="btn btn-dark dropdown-toggle"
                                    type="button"
                                    id="profileDropdown"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    This Week
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                                    <li><a className="dropdown-item" href="#">My Profile</a></li>
                                    <li><a className="dropdown-item" href="#">Settings</a></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><a className="dropdown-item" href="#">Logout</a></li>
                                </ul>
                            </div>

                            <div className='me-4'></div>


                        </div>
                    </div>

                    <div className='col-xl-6 d-flex justify-content-end'>
                        <button type='button' className='btn btn-success mb-5 w-50 rounded-3' style={{ height: "76%" }}>Generate Order Report</button>
                    </div>



                </div>

                <div className='mb-5'></div>


                <Flex gap="middle" vertical>
                    <Flex align="center" gap="middle">
                        {hasSelected ? `Selected ${selectedRowKeys.length} items` : null}
                    </Flex>
                    <Table rowSelection={rowSelection} columns={columns} dataSource={dataSource} />
                </Flex>

            </div>
        </div>
    )
}
