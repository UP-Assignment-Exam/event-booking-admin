import { Checkbox } from 'antd';
import React from 'react'
import { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa'; // if using react-icons
import { Button, Flex, Table } from 'antd';
import { FaUser } from 'react-icons/fa'; // Profile icon
import { FaMessage } from "react-icons/fa6";
import { FaGift } from "react-icons/fa6";
import { RiNotification2Fill } from "react-icons/ri";
import { IoHomeSharp } from "react-icons/io5";
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

export default function Dashboard() {
  const [customers, setCustomers] = useState([]);
  const [isActive, setIsActive] = useState(true);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const start = () => {
    setLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };
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
            <h2 className='h-100 w-50 mb-5'>Customer</h2>
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
            <button type='button' className='btn btn-success me-1'>
              <IoSettingsOutline />
            </button>
          </div>
          <div className='col-xl-2'>
            <button type='button' className='btn btn-success me-2'>
              <RiNotification2Fill />
            </button>
            <button type='button' className='btn btn-success me-2'>
              <FaMessage />
            </button>
            <button type='button' className='btn btn-success'>
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
          <div className='col-xl-12'>
            <nav className="navbar navbar-expand-lg border border-dark rounded-3">
              <div className="container-fluid">
                <a className="navbar-brand text-success fs-6" href="#">Customer / Customer List</a>
              </div>
            </nav>
          </div>
        </div>


        <div className='mb-5'></div>

        <div className='row'>
          <div className='col-xl-6'>
            <button type='button' className='btn btn-outline-success mb-5 w-50' style={{ height: "75%" }}>+ New Customer</button>
          </div>

          <div className='col-xl-6 ms-auto'>
            <div className="d-flex justify-content-between align-items-end border border-dark bg-dark rounded-3 text-white p-2" style={{ height: "80%" }} >

              <div>
                <div className='ms-5'>
                  <span className='small'>Total Customer</span>
                </div>
                <div className='mb-2 ms-3'>
                  <i className="bi bi-person-circle me-3"></i>
                  <span className='text-lg'>129,000 Person</span>
                </div>
              </div>

              <div className='mb-2'>
                <button type="button" className="btn btn-secondary me-2">
                  <input className="form-check-input" type="checkbox" id="activeSwitch" checked />
                  <label className="form-check-label ms-1" htmlFor="activeSwitch">Active</label>
                </button>
                <button type="button" className="btn btn-warning me-2">Edit</button>
                <button type="button" className="btn btn-danger me-2">Delete</button>
              </div>

            </div>


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
