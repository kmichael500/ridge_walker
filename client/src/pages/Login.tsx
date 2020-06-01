import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {userContext} from '../context/userContext';
import {UserOutlined, LockOutlined} from '@ant-design/icons';
import {loginUser} from '../dataservice/authentication';

import {Form, Input, Button, Typography, Row, message} from 'antd';
const {Title} = Typography;

interface State {
  email: string;
  password: string;
  error: boolean;
  error_msg: string;
}

interface Props {
  history: any;
}

class Login extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: false,
      error_msg: '',
    };

    this.handleEmail = this.handleEmail.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleEmail(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({email: e.target.value});
  }

  handlePassword(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({password: e.target.value});
  }

  handleSubmit(value) {
    loginUser(value.email, value.password)
      .then(response => {
        this.context.setUser(response);
        this.context.setAuthenticated(true, () => {
          let redirectPath = '/map';
          try {
            redirectPath = this.props.location.state.from;
          } catch (error) {
            redirectPath = '/map';
          }

          this.props.history.push(redirectPath);
        })
      }).catch(error => {
        message.error(error);
      });
  }

  render() {
    return (
      <Row
        justify="center"
        align="middle"
        style={{height: '100%', background: 'white'}}
      >
        <div style={{width:'90%', borderRadius:'10px'}}>
          <Row justify="center">
            <Title>Member Portal</Title>
          </Row>
          <Form
            name="horizontal_login"
            onFinish={this.handleSubmit}
            size="large"
          >
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
              <Input
                size="large"
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Email"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{required: true, message: 'Please input your password!'}]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                size="large"
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item shouldUpdate={true}>
              {() => (
                <Row justify="center">
                  <Button size="large" type="primary" htmlType="submit">
                    Log in
                  </Button>
                </Row>
              )}
            </Form.Item>
          </Form>
        </div>
      </Row>
    );
  }
}

Login.contextType = userContext;

// tslint:disable-next-line: variable-name
const LoginPage = withRouter(Login);
export {LoginPage};
