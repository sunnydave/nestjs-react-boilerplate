import React, { useState } from 'react';
import {
    Form,
    Input,
    Checkbox,
    Button,
    notification,
    Result,
} from 'antd';
import {BaseService} from "../../services";
import FormItemLabel from "antd/es/form/FormItemLabel";


const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
};
const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};

function SignUp () {
    const [form] = Form.useForm();
    const [registering, setRegistering] = useState(false);
    const [signupSuccess, setSignupSuccess] = useState(false);
    const onFinish = (values: any) => {
        setRegistering(true);
        BaseService.create('signup/checkSubDomainAvailable', {
            subDomain: values.subDomain,
            name: values.name,
        })
            .then((response) => {
                if (response && response.statusCode === 201 && response.data.isSubDomainAvailable){
                    BaseService.create('signup/checkUserEmailAvailable', {
                        email: values.email,
                    })
                        .then((response) => {
                            if (response && response.statusCode === 201 && response.data.isEmailAvailable){
                                BaseService.create('organizations',values)
                                    .then((response) => {
                                        if (response && response.data && response.data.status){
                                            setSignupSuccess(true);
                                        }else if (!response || response.statusCode !== 200){
                                            notification['error']({
                                                message: 'Signup Failed',
                                                description: 'We could not complete your signup process. Please contact support at support@test.com'
                                            });
                                            setRegistering(false);
                                        }
                                    })
                                    .catch(exception => {
                                        notification['error']({
                                            message: 'Signup Failed',
                                            description: 'We could not complete your signup process. Please contact support at support@test.com'
                                        })
                                        setRegistering(false);
                                    })
                            }else{
                                notification['error']({
                                    message: 'Already Registered',
                                    description: 'Your email address is already registered. Please use login using' +
                                        ' your email address'
                                });
                                setRegistering(false);
                            }
                        })
                }else {
                    notification["error"]({
                        message: 'Already Registered',
                        description: 'The sub domain is not available. Please use another sub domain'
                    });
                    setRegistering(false);
                }
            })
    }

    return (
        <React.Fragment>
            {signupSuccess ?
                <Result status={"success"} title={"Signup Success"} subTitle={"We have sent you a confirmation" +
                    " email. Please use the link in the email to complete your signup process."}>
                </Result>
                : <Form
                    {...formItemLayout}
                    form={form}
                    name={'signup'}
                    onFinish={onFinish}
                    scrollToFirstError>
                    <Form.Item name={'email'} label={'Email'} rules={[
                        {
                            type: 'email',
                            message: 'The input is not a valid Email !',
                        },
                        {
                            required: true,
                            message: 'Email is required',
                        },
                    ]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name={'password'} label={'Password'} rules={[
                        {
                            required: true,
                            message: 'Password is required',
                        },
                    ]} hasFeedback>
                        <Input.Password/>
                    </Form.Item>
                    <Form.Item
                        name="confirm"
                        label="Confirm Password"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: 'Please confirm your password!',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        name="firstName"
                        label="First Name"
                        rules={[{ required: true, message: 'First Name is required', whitespace: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="lastName"
                        label="Last Name"
                        rules={[{ required: true, message: 'Last Name is required', whitespace: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="name"
                        label="Organisation Name"
                        tooltip="Name of your company"
                        rules={[{ required: true, message: 'Organisation Name is required', whitespace: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="subDomain"
                        label="Sub Domain"
                        rules={[{ required: true, message: 'Sub Domain is required', whitespace: true }]}
                    >
                        <Input addonAfter={".nerdyandnoisy.com"} addonBefore={"https://"}/>
                    </Form.Item>
                    <Form.Item
                        name="termsofservice"
                        valuePropName="checked"
                        rules={[
                            {
                                validator: (_, value) =>
                                    value ? Promise.resolve() : Promise.reject(new Error('Should accept Terms of Service')),
                            },
                        ]}
                        {...tailFormItemLayout}
                    >
                        <Checkbox>
                            I have read the <a href="">Terms of Service</a>
                        </Checkbox>
                    </Form.Item>
                    <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit" loading={registering}>
                            Register
                        </Button>
                    </Form.Item>
                </Form>
            }
        </React.Fragment>
    )
}

export default SignUp;
