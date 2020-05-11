import React, { Component } from 'react';
import 'antd/dist/antd.css';
import { Layout, Menu, Breadcrumb } from 'antd';
import {ClickParam} from 'antd/lib/menu'
import { withRouter } from 'react-router-dom';


const { Header, Content, Footer } = Layout;

class NavBar extends Component<any, any>{
    constructor(props){
        super(props);
        this.handleMenuClick = this.handleMenuClick.bind(this);
    }
    handleMenuClick(param: ClickParam){
        this.props.history.push(param.key)
    }
    render(){
        return(
        <Layout className="layout" style={{height:"100vh"}}>
            <Header>
                <div className="logo" />
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['2']}
                    onClick={this.handleMenuClick}
                    >
                    
                    <Menu.Item key="/map">Map</Menu.Item>
                    <Menu.Item key="/points">Points</Menu.Item>
                    <Menu.Item key="/dashboard">Dashboard</Menu.Item>
                    <Menu.Item key="/upload">Upload</Menu.Item>
                </Menu>
            </Header>
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

const navBar = withRouter(NavBar);
export {navBar as NavBar}