import React, {Component} from 'react';

import {Drawer, Divider, Col, Row, Typography, Space, Spin, Button} from 'antd';
import {getOneUserByID} from '../../dataservice/authentication';
import {UserInterface} from '../../interfaces/UserInterface';

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
  formattedPhoneNumber: string;
}

class UserSlider extends Component<UserSliderProps, UserSliderState> {
  state = {
    visible: false,
    user: {
      firstName: '',
      lastName: '',
      nssNumber: null,
    } as UserInterface,
    loading: true,
    formattedPhoneNumber: '',
  };

  componentDidMount() {
    getOneUserByID(this.props.userID).then(user => {
      let formattedPhoneNumber = '';
      const match = user.phoneNumber
        .toString()
        .match(/^(\d{3})(\d{3})(\d{4})$/);
      if (match) {
        formattedPhoneNumber =
          '(' + match[1] + ') ' + match[2] + '-' + match[3];
      }
      this.setState({user, loading: false, formattedPhoneNumber});
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

  render() {
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
              <Col span={12}>
                <DescriptionItem
                  title="Phone Number"
                  content={
                    <a href={'tel:' + this.state.user.phoneNumber}>
                      {this.state.formattedPhoneNumber}
                    </a>
                  }
                />
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <DescriptionState
                  title="Address"
                  address={this.state.user.address}
                  city={this.state.user.city}
                  state={this.state.user.state}
                  zipCode={this.state.user.zipCode}
                />
              </Col>
            </Row>
          </Drawer>
        </>
      );
    } else {
      return <Spin></Spin>;
    }
  }
}

export {UserSlider};
