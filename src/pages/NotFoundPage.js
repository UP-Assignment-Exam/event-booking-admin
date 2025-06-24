import { Button, Result } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router'

export default function NotFoundPage() {
    const navigate = useNavigate();
    return (
        <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            extra={<Button className='esi-std-button' onClick={() => navigate("/")}>Back Home</Button>}
        />
    )
}
