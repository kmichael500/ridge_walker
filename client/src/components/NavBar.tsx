import React, {Component} from 'react';
import {Layout, Menu, Affix, Space} from 'antd';
import "../App.css"
import {
  UserOutlined,
  FormOutlined,
  EyeOutlined,
  ContainerOutlined,
  SettingOutlined,
  LogoutOutlined,
  DashboardOutlined,
} from '@ant-design/icons';

import {ClickParam} from 'antd/lib/menu';
import {withRouter, Link} from 'react-router-dom';
import {userContext} from '../context/userContext';
import {logoutUser} from '../dataservice/authentication';

const {Header, Content} = Layout;

class NavBar extends Component<any, any> {
  constructor(props) {
    super(props);
    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.loggedInSubMenu = this.loggedInSubMenu.bind(this);
    this.loggedInMenu = this.loggedInMenu.bind(this);
  }
  handleMenuClick(param: ClickParam) {
    if (param.key === 'logout') {
      logoutUser();
      this.context.setAuthenticated(false);
      this.props.history.push('/');
    } else {
      this.props.history.push(param.key);
    }
  }

  onFinish(vals) {}

  loggedInMenu() {
    if (this.context.isAuthenticated) {
      return (
        <Menu
          selectable={true}
          theme="dark"
          mode="horizontal"
          // defaultSelectedKeys={['2']}
          // onClick={this.handleMenuClick}
        >
          <Menu.Item key="/">
            <Link to="/">
              <Space size="large">
                <img src={'logo.png'} height="30px" alt=""></img>
                Home
              </Space>
            </Link>
          </Menu.Item>
          <Menu.Item key="/map">
            <Link to="/map">Map</Link>
          </Menu.Item>

          <Menu.SubMenu title="Points">
            <Menu.Item key="/points" title="View">
              <Link to="/points">
                <EyeOutlined />
                View
              </Link>
            </Menu.Item>
            <Menu.Item key="/add/points">
              <Link to="/add/points">
                <FormOutlined />
                Add
              </Link>
            </Menu.Item>
            {this.context.user.role === 'Admin' && (
              <Menu.Item key="/review/points">
                <Link to="/review/points">
                  <ContainerOutlined />
                  Review
                </Link>
              </Menu.Item>
            )}
          </Menu.SubMenu>
          <Menu.Item key="/users">
            <Link to="/users">User Directory</Link>
          </Menu.Item>
          {/* <Menu.Item key="/upload">Upload</Menu.Item> */}
          {this.loggedInSubMenu()}
        </Menu>
      );
    } else {
      return (
        <Menu
          selectable={false}
          theme="dark"
          mode="horizontal"
          // defaultSelectedKeys={['2']}
          // onClick={this.handleMenuClick}
        >
          <Menu.Item key="/">
            <Link to="/">
              <Space size="large">
                <img src="logo.png" alt="" height="30px"></img>
                Tennessee Cave Survey
              </Space>
            </Link>
          </Menu.Item>

          {this.loggedInSubMenu()}
        </Menu>
      );
    }
  }
  loggedInSubMenu() {
    if (this.context.isAuthenticated) {
      return (
        <Menu.SubMenu
          icon={<UserOutlined />}
          style={{float: 'right'}}
          title={'Welcome, ' + this.context.user.firstName + '!'}
        >
          <Menu.Item key="/dashboard">
            <Link to="/dashboard">
              <DashboardOutlined />
              Dashboard
            </Link>
          </Menu.Item>
          <Menu.Item key="/settings">
            <Link to="/settings">
              <SettingOutlined />
              Settings
            </Link>
          </Menu.Item>
          <Menu.Item
            icon={<LogoutOutlined />}
            key="logout"
            onClick={() => {
              logoutUser();
              this.context.setAuthenticated(false);
              this.props.history.push('/');
            }}
          >
            Logout
          </Menu.Item>
        </Menu.SubMenu>
      );
    } else {
      return (
        <Menu.Item
          style={{float: 'right'}}
          key="/login"
          // onTitleClick={this.handleMenuClick}
        >
          <Link to="/login">
            <UserOutlined />
            Login
          </Link>
        </Menu.Item>
      );
    }
  }
  render() {
    return (
      <Layout className="layout" style={{height: '100vh', background: 'white'}}>
        <Affix>
          <Header className="NoPrint">{this.loggedInMenu()}</Header>
        </Affix>
        <Content>
          {/* <div className="site-layout-content"> */}
          {this.props.children}
          {/* </div> */}
        </Content>
        {/* <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer> */}
      </Layout>
    );
  }
}

NavBar.contextType = userContext;

const navBar = withRouter(NavBar);
export {navBar as NavBar};
