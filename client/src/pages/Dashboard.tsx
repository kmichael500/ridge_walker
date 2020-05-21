import React, { Component } from "react";
import { Feature } from '../interfaces/geoJsonInterface'
import { tn_counties } from '../dataservice/countyList'

import {
    Form,
    Input,
    Button,
    Radio,
    Select,
    Cascader,
    DatePicker,
    InputNumber,
    TreeSelect,
    Switch,
    Layout,
    Typography,
    Divider,
    Card,
    Space,
    Row,
    message
  } from 'antd';
import Item from "antd/lib/list/Item";
import { Store } from "antd/lib/form/interface";
import { SubmittedPoint } from "../interfaces/submittedPointInterface";
import { addSubmittedPoint } from "../dataservice/submittedPoints";

const { Content } = Layout
const { Paragraph, Title, Text } = Typography;

interface State {

}




class Dashboard extends Component<any, State>{ 
    
    constructor(Props){
        super(Props);
        this.state = {
            
        }
    }


    render(){

        return(
            <div className="site-layout-content">
                <Card title="Dashboard">
                </Card>
            </div>
        )
    }
}
export { Dashboard };