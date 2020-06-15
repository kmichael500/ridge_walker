import React, {Component, Fragment} from 'react';

import {Drawer, Divider, Col, Row, Typography, Space, Spin, Button} from 'antd';
import {getOneUserByID} from '../../dataservice/authentication';
import {UserInterface} from '../../interfaces/UserInterface';
import {parsePhoneNumberFromString} from 'libphonenumber-js';
import {userContext, UserContextInterface} from '../../context/userContext';

const {Text} = Typography;

const DescriptionItem = ({title, content}) => (
  <Row>
    <Space>
      <Col>
        <h4>{title + ''}</h4>
        <p>{content}</p>
      </Col>
    </Space>
  </Row>
);

const DescriptionState = ({title, address, city, state, zipCode}) => (
  <div>
    <h4>{title + ''}</h4>
    <Row>
      <Space align="start">
        <Col>
          <p>{address}</p>
          <p>{city + ', ' + state + ' ' + zipCode}</p>
        </Col>
      </Space>
    </Row>
  </div>
);

interface UserSliderProps {
  userID: string;
}
interface UserSliderState {
  visible: boolean;
  user: UserInterface;
  loading: boolean;
}

class UserSlider extends Component<UserSliderProps, UserSliderState> {
  state = {
    visible: false,
    user: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      nssNumber: null,
      email: '',
    } as UserInterface,
    loading: true,
  };

  componentDidMount() {
    getOneUserByID(this.props.userID)
      .then(user => {
        this.setState({user, loading: false});
      })
      .catch(error => {
        this.setState({
          user: {
            firstName: 'Not',
            lastName: 'Found',
            nssNumber: -999,
            password: 'undefined',
            phoneNumber: 'Not Found',
            email: 'Not Found',
            address: 'Not Found',
            city: 'Not Found',
            state: 'Not Found',
            zipCode: 0,
            role: 'User',
            status: 'Pending',
            _id: '',
          },
          loading: false,
        });
      });
  }

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  renderAddress(user: UserInterface) {
    const currentUser = this.context as UserContextInterface;

    const allPrivate =
      user.privateFields.address &&
      user.privateFields.city &&
      user.privateFields.state &&
      currentUser.user.role !== 'Admin';

    const {address, city, state, zipCode, privateFields} = user;
    let addressString = '';
    if (currentUser.user.role === 'Admin' || !privateFields.city) {
      addressString += city;
    }
    if (currentUser.user.role === 'Admin' || !privateFields.state) {
      addressString += ' ' + state;
    }
    if (currentUser.user.role === 'Admin' || !privateFields.zipCode) {
      addressString += ' ' + zipCode;
    }
    return (
      <div>
        {!allPrivate && (
          <Fragment>
            <h4>Address</h4>
            <Row>
              <Col>
                {(currentUser.user.role === 'Admin' ||
                  !privateFields.address) && <p>{address}</p>}
                <p>{addressString}</p>
              </Col>
            </Row>
          </Fragment>
        )}
      </div>
    );
  }

  render() {
    const currentUser = this.context as UserContextInterface;

    if (!this.state.loading) {
      return (
        <>
          <Button type="link" onClick={this.showDrawer}>
            {this.state.user.firstName + ' ' + this.state.user.lastName}
          </Button>

          <Drawer
            width={640}
            placement="right"
            closable={true}
            onClose={this.onClose}
            visible={this.state.visible}
          >
            <h3>User Profile</h3>
            <Row>
              <Col span={12}>
                <Text>
                  {this.state.user.firstName + ' ' + this.state.user.lastName}
                </Text>
              </Col>
              <Divider />
              {(currentUser.user.role === 'Admin' ||
                !this.state.user.privateFields.email) && (
                <Col span={12}>
                  <DescriptionItem
                    title="Email"
                    content={
                      <a href={'mailto:' + this.state.user.email}>
                        {this.state.user.email}
                      </a>
                    }
                  />
                </Col>
              )}
              {(currentUser.user.role === 'Admin' ||
                !this.state.user.privateFields.phoneNumber) && (
                <Col span={12}>
                  <DescriptionItem
                    title="Phone Number"
                    content={
                      <a href={'tel:' + this.state.user.phoneNumber}>
                        {parsePhoneNumberFromString(this.state.user.phoneNumber)
                          ? parsePhoneNumberFromString(
                              this.state.user.phoneNumber
                            ).formatNational()
                          : 'Not Found'}
                      </a>
                    }
                  />
                </Col>
              )}
            </Row>
            <Row>
              <Col span={12}>{this.renderAddress(this.state.user)}</Col>
            </Row>
          </Drawer>
        </>
      );
    } else {
      return <Spin></Spin>;
    }
  }
}

UserSlider.contextType = userContext;

export {UserSlider};
