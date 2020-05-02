import React, { Component } from 'react';
import 'antd/dist/antd.css';
import { Layout, Menu, Breadcrumb } from 'antd';

const { Header, Content, Footer } = Layout;

class NavBar extends Component{
    render(){
        return(
            <Header>
                <div className="logo" />
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
                    <Menu.Item key="1">Home</Menu.Item>
                    <Menu.Item key="2">Dashboard</Menu.Item>
                    <Menu.Item key="3">Upload</Menu.Item>
                </Menu>
            </Header>
        );
    }
}

export { NavBar };