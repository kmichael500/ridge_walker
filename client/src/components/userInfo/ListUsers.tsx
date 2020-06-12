import React, {Component, useState} from 'react';
import {UserInterface} from '../../interfaces/UserInterface';
import {getAllUsers} from '../../dataservice/authentication';
import {Helmet} from 'react-helmet';
import {
  List,
  Card,
  Row,
  Col,
  Typography,
  Space,
  Tag,
  Tooltip,
  Button,
  Popconfirm,
} from 'antd';
import {
  CheckCircleOutlined,
  DeleteOutlined,
  StopOutlined,
} from '@ant-design/icons';

const {Text, Title, Paragraph} = Typography;

const UserToolbar = (user: UserInterface) => {
  const buttons = [];
  const approveButton = (
    <Tooltip title="Approve user!">
      <Button type="primary" icon={<CheckCircleOutlined />}>
        Approve
      </Button>
    </Tooltip>
  );
  const deleteButton = (
    <Popconfirm
      title={
        'Are you sure you want to permanently delete ' +
        user.firstName +
        "'s account?"
      }
      okText="Delete"
      okButtonProps={{danger: true}}
    >
      <Button icon={<DeleteOutlined />} danger>
        Delete
      </Button>
    </Popconfirm>
  );
  const rejectButton = (
    <Popconfirm
      title={
        <div>
          <Paragraph>
            Are you sure you want to reject {user.firstName}'s membership
            request?
          </Paragraph>
          <Paragraph>This will delete their account.</Paragraph>
        </div>
      }
      okText="Reject"
      okButtonProps={{danger: true}}
    >
      <Button icon={<DeleteOutlined />} danger>
        Reject
      </Button>
    </Popconfirm>
  );
  const pendingButton = (
    <Popconfirm
      title={
        'Are you sure you want to disable ' + user.firstName + "'s account?"
      }
      okText="Disable"
      okButtonProps={{danger: true}}
    >
      <Button icon={<StopOutlined />}>Revoke</Button>
    </Popconfirm>
  );
  switch (user.status) {
    case 'Approved':
      buttons.push(pendingButton, deleteButton);
      break;
    case 'Pending':
      buttons.push(approveButton, rejectButton);
      break;
    case 'Rejected':
      buttons.push(approveButton, pendingButton);
      break;
    default:
      break;
  }
  return buttons;
};

const formatPhoneNumber = (phoneNumber: number) => {
  let formattedPhoneNumber = '';
  const match = phoneNumber.toString().match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    formattedPhoneNumber = '(' + match[1] + ') ' + match[2] + '-' + match[3];
    return formattedPhoneNumber;
  } else {
    return 'Not found';
  }
};

const UserStatusTag: React.FunctionComponent<{user: UserInterface}> = props => {
  if (props.user.status === 'Pending') {
    return <Tag color="geekblue">{props.user.status}</Tag>;
  } else if (props.user.status === 'Approved') {
    return <Tag color="green">{props.user.status}</Tag>;
  } else if (props.user.status === 'Rejected') {
    return <Tag color="volcano">{props.user.status}</Tag>;
  } else {
    return null;
  }
};

const UserTag: React.FunctionComponent<{user: UserInterface}> = props => {
  if (props.user.role === 'Admin') {
    return <Tag color="green">{props.user.role}</Tag>;
  } else if (props.user.role === 'User') {
    return <Tag color="default">{props.user.role}</Tag>;
  } else {
    return null;
  }
};

// helper functinos
const DescriptionItem = ({title, content}) => (
  <Row>
    <Space>
      <Col>
        <h4>{title + ''}</h4>
        <Paragraph ellipsis={{rows: 2, expandable: true}}>{content}</Paragraph>
      </Col>
    </Space>
  </Row>
);

const AddressDescription = ({title, address, city, state, zipCode}) => (
  <div>
    <h4>{title + ''}</h4>
    <Row>
      <Col>
        <p>{address}</p>
        <p>{city + ', ' + state + ' ' + zipCode}</p>
      </Col>
    </Row>
  </div>
);

// End helper functions

interface State {
  userList: UserInterface[];
  loading: boolean;
}

interface Props {}

class ListUsers extends Component<Props, State> {
  constructor(Props) {
    super(Props);
    this.state = {
      userList: [],
      loading: true,
    };
  }
  componentDidMount() {
    getAllUsers().then(requestedUsers => {
      this.setState({userList: requestedUsers, loading: false});
    });
  }
  render() {
    return (
      <div>
        <Helmet>
          <title>Manage Users</title>
        </Helmet>

        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 4,
            lg: 4,
            xl: 4,
            xxl: 4,
          }}
          dataSource={this.state.userList}
          renderItem={user => (
            <List.Item>
              <Card
                title={
                  <Row>
                    <Col span={24}>{user.firstName + ' ' + user.lastName}</Col>
                    <Col span={24}>
                      <UserTag user={user}></UserTag>
                    </Col>
                  </Row>
                }
                actions={UserToolbar(user)}
                loading={this.state.loading}
              >
                <Row>
                  <Col span={24}>
                    <DescriptionItem
                      title="Email"
                      content={
                        <a href={'mailto:' + user.email}>{user.email}</a>
                      }
                    />
                  </Col>
                  <Col span={24}>
                    <DescriptionItem
                      title="Phone Number"
                      content={
                        <a href={'tel:' + user.phoneNumber}>
                          {formatPhoneNumber(user.phoneNumber)}
                        </a>
                      }
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <AddressDescription
                      title="Address"
                      address={user.address}
                      city={user.city}
                      state={user.state}
                      zipCode={user.zipCode}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <DescriptionItem
                      title="Status"
                      content={<UserStatusTag user={user}></UserStatusTag>}
                    ></DescriptionItem>
                  </Col>
                </Row>
              </Card>
            </List.Item>
          )}
        />
      </div>
    );
  }
}
export {ListUsers};
