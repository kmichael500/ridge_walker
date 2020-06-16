import React, {Component, Fragment} from 'react';

import {registerUser} from '../dataservice/authentication';
import {userContext} from '../context/userContext';
import {Helmet} from 'react-helmet';
import {us_states} from '../dataservice/StateList';
import {AsYouType, parsePhoneNumberFromString} from 'libphonenumber-js';
import {QuestionCircleOutlined} from '@ant-design/icons';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

import {
  Form,
  Input,
  Button,
  InputNumber,
  Card,
  Checkbox,
  Row,
  message,
  Col,
  Select,
  Descriptions,
  Tooltip,
} from 'antd';
import {RegisterUserInterface} from '../interfaces/UserInterface';
import {Icon} from 'leaflet';

interface State {
  email: string;
  password: string;
  repeat_password: string;
  error: boolean;
  error_msg: string;
}

interface Props {
  history: any;
}

class Register extends Component<Props, State> {
  constructor(Props: Props) {
    super(Props);
    this.state = {
      email: '',
      password: '',
      repeat_password: '',
      error: false,
      error_msg: '',
    };

    this.handleEmail = this.handleEmail.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handlePasswordRepeat = this.handlePasswordRepeat.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleEmail(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({email: e.target.value});
  }

  handlePassword(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({password: e.target.value});
  }
  handlePasswordRepeat(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({repeat_password: e.target.value});
  }

  handleSubmit(value: any) {
    const privateFieldsArray = value.privateFields as string[];
    const privateFields = {
      email: false,
      address: false,
      city: false,
      state: false,
      zipCode: false,
      phoneNumber: false,
    };
    for (let i = 0; i < privateFieldsArray.length; i++) {
      switch (privateFieldsArray[i]) {
        case 'email':
          privateFields.email = true;
          break;
        case 'address':
          privateFields.address = true;
          break;
        case 'city':
          privateFields.city = true;
          break;
        case 'state':
          privateFields.state = true;
          break;
        case 'zipCode':
          privateFields.zipCode = true;
          break;
        case 'phoneNumber':
          privateFields.phoneNumber = true;
          break;
        default:
          break;
      }
    }

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
        phoneNumber: value.phonenumber,
        nssNumber: Number(value.nssnumber),
        privateFields,
      },
    } as RegisterUserInterface;
    registerUser(newUser)
      .then(response => {
        // this.props.history.push('/');
        message.success('Your application is under review!');
      })
      .catch(error => {
        message.error(error);
      });
  }

  render() {
    const colSpanProps = {
      xs: {span: 24},
      sm: {span: 24},
      md: {span: 12},
      lg: {span: 8},
      xl: {span: 6},
    };
    return (
      <div className="site-layout-content">
        <Helmet>
          <title>Register</title>
        </Helmet>
        {/* {JSON.stringify(this.context)} */}
        <Card title="Membership Application">
          <Form
            // labelCol={{ span: 8 }}
            // wrapperCol={{ span: 14 }}
            layout="vertical"
            onFinish={this.handleSubmit}
            initialValues={{remember: true}}
          >
            <Row gutter={[10, {xs: 8, sm: 16, md: 24, lg: 32}]}>
              {/* First Name */}
              <Col {...colSpanProps}>
                <Row>
                  <Col span={24}>
                    <Form.Item
                      label="First Name"
                      name="firstname"
                      rules={[
                        {
                          required: true,
                          message: 'First name required!',
                          whitespace: true,
                        },
                      ]}
                    >
                      <Input></Input>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              {/* Last Name */}
              <Col {...colSpanProps}>
                <Row>
                  <Col span={24}>
                    <Form.Item
                      label="Last Name"
                      name="lastname"
                      rules={[
                        {
                          required: true,
                          message: 'Last name required!',
                          whitespace: true,
                        },
                      ]}
                    >
                      <Input></Input>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              {/* NSS Number */}
              <Col {...colSpanProps}>
                <Row>
                  <Col span={24}>
                    <Form.Item
                      label="NSS Number"
                      name="nssnumber"
                      rules={[
                        {
                          required: true,
                          type: 'number',
                          message: 'NSS number required!',
                          whitespace: true,
                        },
                      ]}
                    >
                      <InputNumber
                        min={0}
                        style={{width: '100%'}}
                      ></InputNumber>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              {/* Street Address */}
              <Col {...colSpanProps}>
                <Row>
                  <Col span={24}>
                    <Form.Item
                      label="Address"
                      name="address"
                      rules={[
                        {
                          required: true,
                          message: 'Address required!',
                          whitespace: true,
                        },
                      ]}
                    >
                      <Input></Input>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              {/* City */}
              <Col {...colSpanProps}>
                <Row>
                  <Col span={24}>
                    <Form.Item
                      label="City"
                      name="city"
                      rules={[
                        {
                          required: true,
                          message: 'City required!',
                          whitespace: true,
                        },
                      ]}
                    >
                      <Input></Input>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              {/* State */}
              <Col {...colSpanProps}>
                <Row>
                  <Col span={24}>
                    <Form.Item
                      label="State"
                      name="state"
                      rules={[
                        {
                          required: true,
                          message: 'State required!',
                          whitespace: true,
                        },
                      ]}
                    >
                      <Select
                        showSearch
                        onFocus={() => {
                          document
                            .querySelectorAll('.ant-select-selector input')
                            .forEach(e => {
                              e.setAttribute(
                                'autocomplete',
                                'stopDamnAutocomplete'
                              );
                              //you can put any value but NOT "off" or "false" because they DO NOT work
                            });
                        }}
                        autoFocus={false}
                        placeholder="Select"
                        filterOption={(input, option) =>
                          option.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {us_states.map(state => (
                          <Select.Option value={state}>{state}</Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              {/* Zip Code */}
              <Col {...colSpanProps}>
                <Row>
                  <Col span={24}>
                    <Form.Item
                      label="Zip Code"
                      name="zipcode"
                      rules={[
                        {
                          required: true,
                          pattern: /^\d{5}$/g,
                          message: 'Invalid zip code!',
                          whitespace: true,
                        },
                      ]}
                    >
                      <Input></Input>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              {/* Phone Number */}
              <Col {...colSpanProps}>
                <Row>
                  <Col span={24}>
                    <Form.Item
                      label="Phone Number"
                      name="phonenumber"
                      rules={[
                        {
                          required: true,
                          type: 'string',
                          message: 'Phone number required!',
                          whitespace: true,
                        },
                        ({getFieldValue, setFieldsValue}) => ({
                          validator(rule, value) {
                            const phoneNumber =
                              value !== undefined
                                ? parsePhoneNumberFromString(value)
                                : false;
                            if (phoneNumber) {
                              if (phoneNumber.isValid()) {
                                return Promise.resolve();
                              } else {
                                return Promise.reject('Invalid phone number');
                              }
                            } else {
                              return Promise.reject('Invalid phone number');
                            }
                          },
                        }),
                      ]}
                    >
                      <PhoneInput
                        defaultCountry="US"
                        value=""
                        onChange={() => {}}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>

              {/* Email */}
              <Col span={24}>
                <Row>
                  <Col span={24}>
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
                          message: 'E-Mail required!',
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              {/* Confirm Email */}
              <Col span={24}>
                <Row>
                  <Col span={24}>
                    <Form.Item
                      name="confirmemail"
                      label="Confirm Email"
                      dependencies={['email']}
                      hasFeedback
                      rules={[
                        {
                          type: 'email',
                          message: 'The input is not valid E-mail!',
                        },
                        {
                          required: true,
                          message: 'Please confirm your E-mail!',
                        },
                        ({getFieldValue}) => ({
                          validator(rule, value) {
                            if (
                              !value ||
                              getFieldValue('email').toLowerCase() ===
                                value.toLowerCase()
                            ) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              'The two e-mails that you entered do not match!'
                            );
                          },
                        }),
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              {/* Password */}
              <Col span={24}>
                <Row>
                  <Col span={24}>
                    <Form.Item
                      name="password"
                      label="Password"
                      rules={[
                        {
                          required: true,
                          message: 'Password required!',
                        },
                      ]}
                      hasFeedback
                    >
                      <Input.Password />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              {/* Confirm Password */}
              <Col span={24}>
                <Row>
                  <Col span={24}>
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
                        ({getFieldValue}) => ({
                          validator(rule, value) {
                            if (!value || getFieldValue('password') === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              'The two passwords that you entered do not match!'
                            );
                          },
                        }),
                      ]}
                    >
                      <Input.Password />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              {/*Private Fields*/}
              <Col>
                <Row>
                  <Col span={24}>
                    <Form.Item
                      label={
                        <span>
                          Private Fields&nbsp;
                          <Tooltip title="Hide some or all of your information from the user directory.">
                            <QuestionCircleOutlined></QuestionCircleOutlined>
                          </Tooltip>
                        </span>
                      }
                      name="privateFields"
                      initialValue={['address']}
                      valuePropName={'checked'}
                    >
                      <Checkbox.Group
                        options={[
                          {label: 'Email', value: 'email'},
                          {label: 'Phone Number', value: 'phoneNumber'},
                          {label: 'Street', value: 'address'},
                          {label: 'City', value: 'city'},
                          {label: 'State', value: 'state'},
                          {label: 'Zip Code', value: 'zipCode'},
                        ]}
                        defaultValue={['address']}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              {/* Submit Button */}
              <Col span={24}>
                <Row>
                  <Col span={24}>
                    <Form.Item>
                      <Button type="primary" htmlType="submit">
                        Submit
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </Card>
      </div>
    );
  }
}

Register.contextType = userContext;

export {Register};
