import React, { Component, Fragment } from 'react';
import { Layout, Menu, Breadcrumb, Affix } from 'antd';
import { UserOutlined } from '@ant-design/icons'
import {ClickParam} from 'antd/lib/menu'
import { withRouter } from 'react-router-dom';
import SubMenu from 'antd/lib/menu/SubMenu';
import { userContext } from '../context/userContext';
import { logoutUser } from '../dataservice/authentication'




const { Header, Content, Footer } = Layout;

class NavBar extends Component<any, any>{
    constructor(props){
        super(props);
        this.handleMenuClick = this.handleMenuClick.bind(this);
        this.loggedInSubMenu = this.loggedInSubMenu.bind(this);
        this.loggedInMenu = this.loggedInMenu.bind(this);
    }
    handleMenuClick(param: ClickParam){
        if (param.key === "logout"){
            logoutUser();
            this.context.setAuthenticated(false);
            this.props.history.push("/")
        }
        else {
            this.props.history.push(param.key)
        }
        
    }

    onFinish(vals){
        console.log(vals);
    }

    loggedInMenu(){
        if (this.context.isAuthenticated){
            return(
                <Menu
                selectable={true}
                theme="dark"
                mode="horizontal"
                // defaultSelectedKeys={['2']}
                onClick={this.handleMenuClick}
                >

                    <Menu.Item key="/map">Map</Menu.Item>
                    <Menu.SubMenu title="Points" key="/points" onTitleClick={this.handleMenuClick}>
                        <Menu.Item key="/add/points">Add</Menu.Item>
                        <Menu.Item key="/review/points">Review</Menu.Item>
                    </Menu.SubMenu>
                    <Menu.Item key="/dashboard">Dashboard</Menu.Item>
                    <Menu.Item key="/upload">Upload</Menu.Item>
                    {this.loggedInSubMenu()}
                </Menu>
            )
        }
        else{
            return(
                <Menu
                selectable={false}
                theme="dark"
                mode="horizontal"
                // defaultSelectedKeys={['2']}
                onClick={this.handleMenuClick}
                >

                    <Menu.Item key="/">Tennessee Cave Survey</Menu.Item>
                    
                    {this.loggedInSubMenu()}
                </Menu>
            )
        }
    }
    loggedInSubMenu(){
        if (this.context.isAuthenticated){
            return(
                <Menu.SubMenu icon={<UserOutlined />} style={{float: 'right'}} title={"Welcome, " + this.context.user.firstName + "!"}>
                    <Menu.Item key="/settings">Settings</Menu.Item>
                    <Menu.Item key="logout">Logout</Menu.Item>
                </Menu.SubMenu>
            );
        }
        else{
            return(
                <Menu.SubMenu icon={<UserOutlined />} style={{float: 'right'}} title="Login" key="/login" onTitleClick={this.handleMenuClick}>
                </Menu.SubMenu>
            )
        }
        
    }
    render(){
        return(
        <Layout className="layout" style={{height:"100vh"}}>
            <Affix>
            <Header>
                <div className="logo" />
                {this.loggedInMenu()}
            </Header>
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
export {navBar as NavBar}