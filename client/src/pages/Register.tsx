
import React, { Component } from "react";

import { registerUser } from '../dataservice/authentication';
import { userContext } from '../context/userContext'

// import { tn_counties } from '../dataservice/countyList'

import {
    Form,
    Input,
    Button,
    InputNumber,
    Card,
    Space,
    Row,
    message,
  } from 'antd';
import { RegisterUserInterface } from "../interfaces/UserInterface";


interface State{
    email: string,
    password: string,
    repeat_password: string,
    error: boolean,
    error_msg: string
}

interface Props{
    history: any
}


class Register extends Component<Props,State> {

    constructor(Props: Props){
        super(Props);
        this.state = {
            email: "",
            password: "",
            repeat_password: "",
            error: false,
            error_msg: ""
        }

        this.handleEmail = this.handleEmail.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.handlePasswordRepeat = this.handlePasswordRepeat.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleEmail(e: React.ChangeEvent<HTMLInputElement>){
        this.setState({email: e.target.value})
    }

    handlePassword(e: React.ChangeEvent<HTMLInputElement>){
        this.setState({password: e.target.value})
    }
    handlePasswordRepeat(e: React.ChangeEvent<HTMLInputElement>){
        this.setState({repeat_password: e.target.value})
    }

    handleSubmit(value: any){
        const newUser = {
            user: {
                email: value.email,
                password: value.password,
                firstName: value.firstname,
                lastName: value.lastname,
                address: value.address,
                city: value.city,
                state: value.state,
                zipCode: Number(value.zipcode),
                phoneNumber: Number(value.phonenumber),
                nssNumber: Number(value.nssnumber),
            }
        } as RegisterUserInterface
        registerUser(newUser).then((response)=>{
            this.props.history.push("/")
            message.success("Your application is under review!");
        }).catch((error)=>{
            message.error(error);
        });     
    }

  render() {
    return(
        <div className="site-layout-content">
            {/* {JSON.stringify(this.context)} */}
        <Card title="Membership Application">
            <Form
                // labelCol={{ span: 8 }}
                // wrapperCol={{ span: 14 }}
                layout="vertical"
                onFinish={this.handleSubmit}
                initialValues={{ remember: true }}
                
            >
                <Row>
                    <Space>
                        <Form.Item label="First Name" name="firstname"
                        rules={[{ required: true, message: 'Please input your first name!', whitespace: true }]}
                        >
                            <Input></Input>
                        </Form.Item>
                        <Form.Item label="Last Name" name="lastname"
                            rules={[{ required: true, message: 'Please input your last name!', whitespace: true }]}
                            >
                            <Input></Input>
                        </Form.Item>
                        <Form.Item label="NSS Number" name="nssnumber"
                            rules={[{ required: true, type: "number", message: 'Please input your NSS Number!', whitespace: true }]}
                            >
                            <InputNumber min={0}></InputNumber>
                        </Form.Item>
                    </Space>
                </Row>
                <Form.Item label="Address" name="address"
                        rules={[{ required: true, message: 'Please input your address!', whitespace: true }]}
                        >
                            <Input></Input>
                </Form.Item>
                <Row>
                    <Space>
                        <Form.Item label="City" name="city"
                            rules={[{ required: true, message: 'Please input your last name!', whitespace: true }]}
                            >
                            <Input></Input>
                        </Form.Item>
                        <Form.Item label="State" name="state"
                            rules={[{ required: true, message: 'Please input your state!', whitespace: true }]}
                            >
                            <Input></Input>
                        </Form.Item>
                        <Form.Item label="Zip Code" name="zipcode"
                            rules={[{ required: true, pattern: /^\d{5}$/g, message: 'Invalid zip code!', whitespace: true }]}
                            >
                            <Input></Input>
                        </Form.Item>
                    </Space>
                </Row>
                <Form.Item label="Phone Number" name="phonenumber"
                        rules={[{ required: true, message: 'Please input your phone number!', whitespace: true }]}
                        >
                            <Input></Input>
                </Form.Item>
                <Form.Item
                    name="email"
                    label="E-mail"
                    rules={[
                        {
                        type: 'email',
                        message: 'The input is not valid E-mail!',
                        },
                        {
                        required: true,
                        message: 'Please input your E-mail!',
                        },
                    ]}
                    >
                    <Input />                
                </Form.Item>
                <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                    {
                        required: true,
                        message: 'Please input your password!',
                    },
                    ]}
                    hasFeedback
                >
                    <Input.Password />
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
                        validator(rule, value) {
                        if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                        }
                        return Promise.reject('The two passwords that you entered do not match!');
                        },
                    }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item>
                        <Button type="primary" htmlType="submit">
                        Submit
                        </Button>
                </Form.Item>
                
            </Form>
        </Card>
        </div>
    )
  }
}

Register.contextType = userContext;

export { Register }