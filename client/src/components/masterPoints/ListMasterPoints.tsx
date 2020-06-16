import React, {Component, useState, Fragment} from 'react';
import {UserInterface} from '../../interfaces/UserInterface';
import {getAllMasterPoints} from '../../dataservice/getPoints'
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
  Popconfirm,
  Divider,
  message,
} from 'antd';
import {
  CheckCircleOutlined,
  DeleteOutlined,
  StopOutlined,
  PlusCircleOutlined,
  CloseCircleOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';
// import {AdvancedUserSearch} from './AdvancedUserSerach';
import {userContext, UserContextInterface} from '../../context/userContext';
import { Feature } from '../../interfaces/geoJsonInterface';

const {Paragraph} = Typography;


const UserToolbar = (user: UserInterface, that: Component<Props, State>) => {
  const buttons = [];
  const approveButton = (
    <Tooltip title="Approve user!">
      <CheckCircleOutlined
        style={{color: 'green'}}
        
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
      
    >
      <Tooltip title="Delete user!">
        <DeleteOutlined style={{color: 'red'}} />
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
      onConfirm={() => {
        
      }}
    >
      <Tooltip title="Reject user!">
        <CloseCircleOutlined style={{color: 'red'}} />
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
      onConfirm={() => {
        user.status = 'Pending';
        
      }}
    >
      <Tooltip title="Disable Account">
        <StopOutlined />
      </Tooltip>
    </Popconfirm>
  );
  const makeAdminButton = (
    <Popconfirm
      title={'Are you sure you want to make ' + user.firstName + ' an admin?'}
      okText="Make Admin"
      
    >
      <Tooltip title="Make admin!">
        <PlusCircleOutlined style={{color: 'green'}} />
      </Tooltip>
    </Popconfirm>
  );

  const makeUserButton = (
    <Popconfirm
      title={
        'Are you sure you want revoke ' +
        user.firstName +
        "'s admin privileges?"
      }
      okText="Make User"
      
    >
      <Tooltip title="Make user!">
        <MinusCircleOutlined style={{color: 'red'}} />
      </Tooltip>
    </Popconfirm>
  );
  switch (user.status) {
    case 'Approved':
      buttons.push(pendingButton, deleteButton);
      if (user.role === 'User') {
        buttons.push(makeAdminButton);
      } else if (user.role === 'Admin') {
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



interface UserStatusTagProps {
  status: string;
}
export const UserStatusTag: React.FunctionComponent<UserStatusTagProps> = props => {
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

export const UserRoleTag: React.FunctionComponent<{role: string}> = props => {
  if (props.role === 'Admin') {
    return <Tag color="green">{props.role}</Tag>;
  } else if (props.role === 'User') {
    return <Tag color="default">{props.role}</Tag>;
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

// End helper functions

interface State {
  pointsList: Feature[];
  listData: Feature[];
  loading: boolean;
}

interface Props {}

class listPoints extends Component<Props, State> {
  constructor(Props) {
    super(Props);
    this.state = {
      pointsList: [],
      listData: [],
      loading: true,
    };
  }
  componentDidMount() {
    getAllMasterPoints().then(requestedPoints => {
      this.setState({
        pointsList: requestedPoints,
        listData: requestedPoints,
        loading: false,
      });
    });
  }

  render() {
    const currentUser = this.context as UserContextInterface;
    return (
      <div>
        <Helmet>
          <title>Manage Users</title>
        </Helmet>
        <Card>
          {/* <AdvancedUserSearch
            userList={this.state.userList}
            onSearch={results => {
              this.setState({listData: results});
            }}
          ></AdvancedUserSearch> */}
          <Divider></Divider>
          <List
            pagination={{
              onChange: page => {},
              pageSize: 8,
              position: 'bottom',
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
            renderItem={point => (
              <List.Item>
                <Card
                  title={
                    <Row>
                      <Col span={24}>
                        {point.properties.name}
                      </Col>
                      <Col span={24}>
                        <UserRoleTag role={point.properties.tcsnumber}></UserRoleTag>
                      </Col>
                    </Row>
                  }
                //   actions={UserToolbar(point, this)}
                  loading={this.state.loading}
                >
                  <Row>
                    <Col span={24}>
                      <DescriptionItem
                        title="Gear"
                        content={point.properties.gear}
                      />
                    </Col>
                  </Row>
                  
                    <Row>
                      <Col span={24}>
                        <DescriptionItem
                          title="Length"
                          content={point.properties.length}
                        />
                      </Col>
                    </Row>
                  
                    <Row>
                      <Col span={24}>
                        <DescriptionItem
                          title="Pit Depth"
                          content={point.properties.pdep}
                        />
                      </Col>
                    </Row>
                  <Row>
                    <Col span={24}>
                      <DescriptionItem
                        title="Vertical Extent"
                        content={point.properties.depth}
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

listPoints.contextType = userContext;

export {listPoints};
