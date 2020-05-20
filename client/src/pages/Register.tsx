
import React, { Component } from "react";

import { registerUser } from '../dataservice/authentication';

import { tn_counties } from '../dataservice/countyList'

import {
    Form,
    Input,
    Button,
    Radio,
    Select,
    Cascader,
    DatePicker,
    InputNumber,
    TreeSelect,
    Switch,
    Layout,
    Typography,
    Divider,
    Card,
    Space,
    Row,
    message,
  } from 'antd';
import Item from "antd/lib/list/Item";
import { Store } from "antd/lib/form/interface";


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

        console.log(value);

        registerUser(value.email, value.password).then((response)=>{
                    this.props.history.push("/admin/login");
                }).catch((error)=>{
                    message.error(error);
        });
        // e.preventDefault();

        // if (this.state.password !== this.state.repeat_password){
        //     this.setState({error_msg: "Passwords are not the same.", error: true})
        // }
        // else if (this.state.email === ""){
        //     this.setState({error_msg: "Email can't be empty.", error: true})
        // }
        // else if (this.state.password === ""){
        //     this.setState({error_msg: "Password can't be empty", error: true})
        // }
        // else{
        //     registerUser(this.state.email, this.state.password).then((response)=>{
        //         this.props.history.push("/admin/login");
        //     }).catch((error)=>{
        //         this.setState({error_msg: error, error: true})
        //     })
        // }
        
    }

  render() {
    return(
        <div className="site-layout-content">
        <Card>
            <Divider></Divider>
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
                        <Form.Item label="State" name="State"
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

export { Register }