import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import { userContext } from '../context/userContext'
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { loginUser } from "../dataservice/authentication"



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
    Typography,
    Divider,
    Card,
    Space,
    Row,
    Col,
    message,
  } from 'antd';

interface State{
    email: string,
    password: string,
    error: boolean,
    error_msg: string
}

interface Props{
    history: any,
}

class Login extends Component<Props,State> {
    constructor(props){
        super(props);
        this.state = {
            email: "",
            password: "",
            error: false,
            error_msg: ""
        }

        this.handleEmail = this.handleEmail.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleEmail(e: React.ChangeEvent<HTMLInputElement>){
        this.setState({email: e.target.value})
    }

    handlePassword(e: React.ChangeEvent<HTMLInputElement>){
        this.setState({password: e.target.value})
    }

    handleSubmit(value){
        loginUser(value.email, value.password).then((response)=>{
            console.log(response)
            this.context.setUser(response);
            this.context.setAuthenticated(true, ()=>{
                let redirectPath = "/admin";
                console.log(this.props.location)
                try{
                    redirectPath = this.props.location.state.from;
                }
                catch(error){
                    redirectPath = "/admin"
                }
                
                this.props.history.push(redirectPath)

            });
            
        }).catch((error)=>{
            console.log(error)
        })
    }

  render() {
    return(
        <Row justify="center" align="middle" style={{minHeight: '100vh'}}>
        <Form name="horizontal_login" onFinish={this.handleSubmit} size="large">
            <Form.Item
                name="email"
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
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
            </Form.Item>
            <Form.Item
                name="password"
                rules={[{ required: true, message: "Please input your password!"}]}
            >
                <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Password"
                />
            </Form.Item>
            <Form.Item shouldUpdate={true}>
                {() => (
                    <Button
                        type="primary"
                        htmlType="submit"
                    >
                        Log in
                    </Button>
                )}
            </Form.Item>
        </Form>
        </Row>
    )
  }
}

Login.contextType = userContext;

// tslint:disable-next-line: variable-name
const LoginPage = withRouter(Login);
export { LoginPage }