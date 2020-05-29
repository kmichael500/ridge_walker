import React, { Component } from "react";
import { Feature } from '../interfaces/geoJsonInterface'
import { tn_counties } from '../dataservice/countyList'
import { PieChart, Pie, Sector } from 'recharts';
import { UploadLeads } from '../components/Karst Features/UploadLeads'

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
    message,
    Col,
    Tabs
  } from 'antd';
import Item from "antd/lib/list/Item";
import { Store } from "antd/lib/form/interface";
import { SubmittedPoint } from "../interfaces/submittedPointInterface";
import { getCurrentUserSubmissions } from '../dataservice/authentication'
import { addSubmittedPoint, getAllSubmittedPoints } from "../dataservice/submittedPoints";
import { getAllMasterPoints } from "../dataservice/getPoints";
import { DownloadCSVButton, DownloadGPXButton } from "../components/downloadData/DownloadButtons";
import { ReviewTable, ReviewPoint } from "./ReviewPoint";
import { DeadLeads } from "./DeadLeads";
import { userContext } from "../context/userContext";

const { Content } = Layout
const { Paragraph, Title, Text } = Typography;
const { TabPane } = Tabs;
interface State {
    submittedPoints: SubmittedPoint[]
    newPoints: SubmittedPoint[],
    existingPoints: SubmittedPoint[],
    deadLeadButton: "" | "View" | "Upload"
}
class Dashboard extends Component<any, State>{ 
    
    constructor(Props){
        super(Props);
        this.state = {
          submittedPoints: undefined,
          newPoints: undefined,
          existingPoints: undefined,
          deadLeadButton: "Upload"
        }
        this.leadButtons = this.leadButtons.bind(this);
    }

    componentDidMount(){
      getCurrentUserSubmissions().then((requstedSubmissions)=>{
        let newPoints = [];
        let existingPoints = []
        requstedSubmissions.map((submission)=>{
            if (submission.pointType === "New"){
                newPoints.push(submission)
            }
            else if (submission.pointType === "Existing"){
                existingPoints.push(submission)
            }
            
        })

        this.setState({submittedPoints: requstedSubmissions, newPoints, existingPoints})
    })

    }

    leadButtons(){
      return(
        <Space align="start">
          <Button
            type="primary"
            size="large"
            onClick={()=>{
              this.setState({deadLeadButton: "Upload"})
            }}
          >
            Upload
          </Button>
          <Button
            type="primary"
            size="large"
            onClick={()=>{
              this.setState({deadLeadButton: "View"})
            }}
          >
            View
          </Button>
        </Space>
      )
    }


    render(){
        

        return(
            <div className="site-layout-content">
              {this.context.user.role === "Admin" &&
                <div>
                  <Row justify="start" align="middle" style={{background:"#fbfdfe", minHeight:"200px", padding:"50px"}}>
                    <Title>Review Submissions</Title>
                    <div style={{minWidth:"100%"}}>
                      <ReviewPoint></ReviewPoint>
                    </div>
                      
                  </Row>
                </div>
              }
              
                <Row justify="start" align="middle" style={{background:"white", minHeight:"300px", padding: "50px"}}>
                <Title>My Submission Status</Title>
                  <div style={{minWidth:"100%"}}>
                    <Tabs defaultActiveKey="1">
                      <TabPane tab="New Caves" key="1">
                        <ReviewTable points={this.state.newPoints} action="Edit"></ReviewTable>
                      </TabPane>
                      <TabPane tab="Existing Caves" key="2">
                        <ReviewTable points={this.state.existingPoints} action="Edit"></ReviewTable>

                      </TabPane>
                    </Tabs>
                  </div>
                </Row>
                <Row justify="center" align="middle" style={{background:"#fbfdfe", minHeight:"300px", minWidth:"100%", padding: "50px"}}>
                    
                  {this.state.deadLeadButton === "View" &&
                    <div style={{minWidth: "100%"}}>
                      <Row justify="space-between">
                        <Col>
                          <Title>My Dead Leads</Title>
                        </Col>
                        <Col>
                          {this.leadButtons()}
                        </Col>
                      </Row>
                      
                      <DeadLeads></DeadLeads>
                    </div> 
                  }
                  {this.state.deadLeadButton === "Upload" &&
                    <div style={{minWidth: "100%"}}>
                      <Row justify="space-between">
                        <Col>
                        <Title style={{textAlign:"start"}}>Upload Dead Leads</Title>
                        </Col> 
                        <Col>
                          {this.leadButtons()}
                        </Col>
                      </Row>
                      <UploadLeads></UploadLeads>
                    </div> 
                  }                 
                </Row>

                <Row justify="center" align="middle" style={{background:"white", minHeight:"200px"}}>
                  <Space>
                  <div style={{background:"", flexBasis:"fit-content"}}>
                  <Title style={{textAlign:"center"}}>Download Files</Title>                    
                    <Space>
                    <DownloadCSVButton></DownloadCSVButton>
                    <DownloadGPXButton></DownloadGPXButton>
                    </Space>
                    </div>

                  </Space>
                </Row>
            </div>
        )
    }
}

Dashboard.contextType = userContext;

export { Dashboard };