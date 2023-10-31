import {Form, Input, Button, Checkbox, notification} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {BaseService, LocalStorageService} from "../../services";
import React, {useState} from "react";
import './Login.page.css';
import {Navigate} from "react-router-dom";

function Login () {
    const [loginProcessing, setLoginProcessing] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const onFinish = (values: any) => {
        setLoginProcessing(true);
        BaseService.create('auth/login',{
            username: values.email,
            password: values.password
        })
            .then((response) => {
                if (response && response.statusCode === 201 && response.data.access_token){
                    LocalStorageService.setToken(response.data.access_token);
                    LocalStorageService.set('role', response.data.role);
                    setIsLoggedIn(true);
                }else if (response && response.statusCode === 401){
                    notification['error']({
                        message: 'Login Failed',
                        description: 'Email and Password do not match'
                    });
                    setLoginProcessing(false);
                }else {
                    notification['error']({
                        message: 'Something went wrong',
                        description: 'We are not able to process your request. Please try after sometime.'
                    });
                    setLoginProcessing(false);
                }
            })
    };

    return (
        <React.Fragment>
            {
                isLoggedIn ? <Navigate to={'/app/home'}/> :
                    <Form
                        name="normal_login"
                        className={'login-form'}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                    >
                        <Form.Item
                            name="email"
                            rules={[{ required: true, message: 'Please input your Username!' }]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Please input your Password!' }]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="Password"
                            />
                        </Form.Item>
                        <Form.Item>
                            <a className={'login-form-forgot'} href="">
                                Forgot password
                            </a>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className={'login-form-button'} loading={loginProcessing}>
                                Log in
                            </Button>
                            Or <a href="/signup">register now!</a>
                        </Form.Item>
                    </Form>
            }
        </React.Fragment>

    );
}

export default Login;
