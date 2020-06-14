import React, {Component, useState} from 'react';
import {UserInterface} from '../../interfaces/UserInterface';
import {getAllUsers, updateOneUserByID, deleteOneUserByID} from '../../dataservice/authentication';
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
  Input,
  Select,
  Divider,
  message,
} from 'antd';
import {
  CheckCircleOutlined,
  DeleteOutlined,
  StopOutlined,
  PlusCircleOutlined,
  CloseCircleOutlined,
  MinusCircleOutlined
} from '@ant-design/icons';
import {AdvancedUserSearch} from './AdvancedUserSerach';

const {Paragraph} = Typography;

const deleteUserFromSreen = (user: UserInterface, that: any) => {
    const listData = [...that.state.listData] as UserInterface[];
    let userIndex = listData.findIndex((u)=>(user._id === u._id));
    listData.splice(userIndex, 1);

    const userList = [...that.state.listData] as UserInterface[];
    userIndex = userList.findIndex((u)=>(user._id === u._id));
    userList.splice(userIndex, 1);
    console.log(userList, userIndex)
    that.setState({listData, userList})
}

const updateOneUserOnScreen = (user: UserInterface, that: Component<Props,State>) => {
    const listData = [...that.state.listData] as UserInterface[];
    const userIndex = listData.findIndex((u)=>(user._id === u._id));
    listData[userIndex] = user;
    that.setState({listData}, ()=>{
        console.log(that.state)
    })
}

let UserToolbar = (user: UserInterface, that: Component<Props,State>) => {
  const buttons = [];
  const approveButton = (
    <Tooltip title="Approve user!">
        <CheckCircleOutlined
        style={{color:"green"}}
        onClick={()=>{
            user.status = "Approved";
            updateOneUserByID(user._id, user).then(()=>{
                message.success(user.firstName + " has been approved!")
                updateOneUserOnScreen(user, that);
            });
        }}
      >
        Approve
      </CheckCircleOutlined>
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
      onConfirm={()=>{
        deleteOneUserByID(user._id).then(()=>{
            message.error(user.firstName + " has been rejected!")
            deleteUserFromSreen(user, that);
        });
      }}
    >
      <Tooltip title="Delete user!">
            <DeleteOutlined style={{color:"red"}}/>
      </Tooltip>
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
      onConfirm={()=>{
        deleteOneUserByID(user._id).then(()=>{
            message.error(user.firstName + " has been rejected!")
            deleteUserFromSreen(user, that);
        });
      }}
    >
        <Tooltip title="Reject user!">
            <CloseCircleOutlined style={{color:"red"}} />
        </Tooltip>
    </Popconfirm>
  );
  const pendingButton = (
    <Popconfirm
      title={
        'Are you sure you want to disable ' + user.firstName + "'s account?"
      }
      okText="Disable"
      okButtonProps={{danger: true}}
      onConfirm={()=>{
        user.status = "Pending";
        updateOneUserByID(user._id, user).then(()=>{
            message.warning(user.firstName + " has been disabled!")
            updateOneUserOnScreen(user, that);
        });
    }}
    >
        <Tooltip title="Disable Account">
            <StopOutlined/>
        </Tooltip>
    </Popconfirm>
  );
  const makeAdminButton = (
    <Popconfirm
      title={
        'Are you sure you want to make ' + user.firstName + " an admin?"
      }
      okText="Make Admin"
      onConfirm={()=>{
        user.role = "Admin";
        updateOneUserByID(user._id, user).then(()=>{
            message.success(user.firstName + " is now an admin!")
            updateOneUserOnScreen(user, that);
        });
    }}
    >
        <Tooltip title="Make admin!">
            <PlusCircleOutlined style={{color:"green"}} />
        </Tooltip>
    </Popconfirm>
  );

  const makeUserButton = (
    <Popconfirm
      title={
        'Are you sure you want revoke ' + user.firstName + "'s admin privileges?"
      }
      okText="Make User"
      onConfirm={()=>{
        user.role = "User";
        updateOneUserByID(user._id, user).then(()=>{
            message.success(user.firstName + " is now a user!")
            updateOneUserOnScreen(user, that);
        });
    }}
    >
        <Tooltip title="Make user!">
            <MinusCircleOutlined style={{color:"red"}} />
        </Tooltip>
    </Popconfirm>
  );
  switch (user.status) {
    case 'Approved':
      buttons.push(pendingButton, deleteButton);
      if (user.role === "User"){
          buttons.push(makeAdminButton);
      }
      else if (user.role === "Admin"){
          buttons.push(makeUserButton);
      }
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

interface UserStatusTagProps {
    status: string;

}
export const UserStatusTag: React.FunctionComponent<UserStatusTagProps> = (props) => {
  if (props.status === 'Pending') {
    return <Tag color="geekblue">{props.status}</Tag>;
  } else if (props.status === 'Approved') {
    return <Tag color="green">{props.status}</Tag>;
  } else if (props.status === 'Rejected') {
    return <Tag color="volcano">{props.status}</Tag>;
  } else {
    return <Tag>{props.status}</Tag>;
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
  listData: UserInterface[];
  loading: boolean;
}

interface Props {}

class ListUsers extends Component<Props, State> {
  constructor(Props) {
    super(Props);
    this.state = {
      userList: [],
      listData: [],
      loading: true,
    };
  }
  componentDidMount() {
    getAllUsers().then(requestedUsers => {
      this.setState({
        userList: requestedUsers,
        listData: requestedUsers,
        loading: false,
      });
    });
  }
  render() {
    return (
      <div>
        <Helmet>
          <title>Manage Users</title>
        </Helmet>
        <Card>
          <AdvancedUserSearch
            userList={this.state.userList}
            onSearch={results => {
              this.setState({listData: results});
            }}
          ></AdvancedUserSearch>
          <Divider></Divider>
          <List
            pagination={{
                onChange: page => {

                },
                pageSize: 8,
                position: "bottom"
                
              }}
            grid={{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 3,
              lg: 4,
              xl: 5,
              xxl: 6,
            }}
            dataSource={this.state.listData}
            renderItem={user => (
              <List.Item>
                <Card
                  title={
                    <Row>
                      <Col span={24}>
                        {user.firstName + ' ' + user.lastName}
                      </Col>
                      <Col span={24}>
                        <UserTag user={user}></UserTag>
                      </Col>
                    </Row>
                  }
                  actions={UserToolbar(user, this)}
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
                        content={<UserStatusTag status={user.status}></UserStatusTag>}
                      ></DescriptionItem>
                    </Col>
                  </Row>
                </Card>
              </List.Item>
            )}
          />
        </Card>
      </div>
    );
  }
}
export {ListUsers};
