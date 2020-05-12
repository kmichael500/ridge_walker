import React, { Component } from "react";
import { Card, Descriptions, PageHeader, Space,  Col, Row, Typography, Divider, Layout, message, Button, Form, Input } from 'antd'
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { getMasterPoint } from "../dataservice/getPoints";
import { cleanString } from "../dataservice/cleanString"
import { addSubmittedPoint } from '../dataservice/submittedPoints'
import { SubmittedPoint } from '../interfaces/submittedPointInterface'
import deepEqual from 'deep-equal'

import { MapView } from "../components/MapView"
import DisplayMap from "../components/DisplayPDF"
import DisplayAllMaps from "../components/DisplayAllMaps";
import { Feature } from "../interfaces/geoJsonInterface";

const { Content } = Layout
const { Paragraph, Title, Text } = Typography;
const { TextArea } = Input;

interface State {
    point: Feature,
    pointCopy: Feature,
    isLoading: boolean,
    proposedChanges: boolean,
    newNarrative: string
}

interface Props {
    match?:{
        params: {
            id: string
        }
    },
    id: string,
    showMap?: boolean,
    renderTitle?: boolean
}


const { Meta } = Card;





class CaveInfo extends Component<Props, State>{ 
    static defaultProps ={
        showMap: true,
        renderTitle: true
    } as Props
    
    constructor(Props){
        super(Props);
        this.state = {
            isLoading: true,
            proposedChanges: false,
            newNarrative: "",
            pointCopy: undefined,
            point: {
                type: "Feature",
                properties:{
                    tcsnumber: "",
                    name: "",
                    length: -1,
                    depth: -1,
                    pdep: -1,
                    ps: -1,
                    co_name: "",
                    topo_name: "",
                    topo_indi: "",
                    elev: 0,
                    ownership: "",
                    gear: "",
                    ent_type: "",
                    field_indi: "",
                    map_status: "",
                    geology: "",
                    geo_age: "",
                    phys_prov: "",
                    narr: ""
                },
                geometry: {
                    type: "Point",
                    coordinates: [0.0000, 0.0000]
                },
            } as Feature
        }

        this.renderDescription = this.renderDescription.bind(this);
        this.renderTitle = this.renderTitle.bind(this);
        this.proposeChangesBar = this.proposeChangesBar.bind(this);
    }

    componentDidMount(){
        let tcsnumber = ""
        if (this.props.match === undefined){
            tcsnumber = this.props.id;
        }
        else{
            tcsnumber = this.props.match.params.id;
        }
        getMasterPoint(tcsnumber).then((requestedPoint)=>{
            requestedPoint.geometry.coordinates.reverse();
            const pointCopy = JSON.parse(JSON.stringify(requestedPoint));
            this.setState({point:requestedPoint, pointCopy,isLoading: false});
        })
    }

    renderDescription(){
        let data = [
            {
                title: "TCS Number",
                description: this.state.point.properties.tcsnumber
            },
            {
                title: "Length",
                description: this.state.point.properties.length
            },
            {
                title: "Pit Depth",
                description: this.state.point.properties.pdep
            },
        ];
        let narrativeStr = cleanString(this.state.point.properties.narr);
        const narrative = narrativeStr.split('\n').map((item, i) => {
            return <Paragraph key={i}>{item}</Paragraph>;
        });
        return(
            <div>
            <Descriptions                
                bordered
                column={{ xxl: 1, xl: 3, lg: 2, md: 3, sm: 2, xs: 1 }}
            >
                <Descriptions.Item
                    label="Length"
                >
                        <Text
                            editable={ this.state.proposedChanges && {
                                onChange:((val)=>{
                                    if (!isNaN(Number(val))){
                                        const point = this.state.point;
                                        point.properties.length = Number(val);
                                        this.setState({point});
                                    }
                                    else{
                                        message.warn("Length must be a number");
                                    }
                                    
                                })
                            }}
                            
                            >{this.state.point.properties.length}
                        </Text>
                </Descriptions.Item>
                <Descriptions.Item
                    label="Pit Depth"
                >
                        <Text
                            editable={ this.state.proposedChanges && {
                                onChange:((val)=>{
                                    if (!isNaN(Number(val))){
                                        const point = this.state.point;
                                        point.properties.pdep = Number(val);
                                        this.setState({point});
                                    }
                                    else{
                                        message.warn("Pit depth must be a number");
                                    }
                                    
                                })
                            }}
                            
                            >{this.state.point.properties.pdep}
                        </Text>
                </Descriptions.Item>
                <Descriptions.Item
                    label="Vertical Extent"
                >
                        <Text
                            editable={ this.state.proposedChanges && {
                                onChange:((val)=>{
                                    if (!isNaN(Number(val))){
                                        const point = this.state.point;
                                        point.properties.depth = Number(val);
                                        this.setState({point});
                                    }
                                    else{
                                        message.warn("Vertical extent must be a number.");
                                    }
                                    
                                })
                            }}
                            
                            >{this.state.point.properties.depth}
                        </Text>
                </Descriptions.Item>
                <Descriptions.Item
                    label="Elevation"
                >
                        <Text
                            editable={ this.state.proposedChanges && {
                                onChange:((val)=>{
                                    if (!isNaN(Number(val))){
                                        const point = this.state.point;
                                        point.properties.elev = Number(val);
                                        this.setState({point});
                                    }
                                    else{
                                        message.warn("Elevation must be a number.");
                                    }
                                    
                                })
                            }}
                            
                            >{this.state.point.properties.elev}
                        </Text>
                </Descriptions.Item>
                <Descriptions.Item
                    label="PS"
                >
                        <Text
                            editable={ this.state.proposedChanges && {
                                onChange:((val)=>{
                                    if (!isNaN(Number(val))){
                                        const point = this.state.point;
                                        point.properties.ps = Number(val);
                                        this.setState({point});
                                    }
                                    else{
                                        message.warn("PS must be a number.");
                                    }
                                    
                                })
                            }}
                            
                            >{this.state.point.properties.ps}
                        </Text>
                </Descriptions.Item>
                <Descriptions.Item
                    label="County"
                >
                        <Text
                            editable={ this.state.proposedChanges && {
                                onChange:((val)=>{
                                    if (val.length !== 0){
                                        const point = this.state.point;
                                        point.properties.co_name = val;
                                        this.setState({point});
                                    }
                                    else{
                                        message.warn("County can't be blank.");
                                    }
                                    
                                })
                            }}
                            
                            >{this.state.point.properties.co_name}
                        </Text>
                </Descriptions.Item>
                <Descriptions.Item
                    label="Topo"
                >
                        <Text
                            editable={ this.state.proposedChanges && {
                                onChange:((val)=>{
                                    if (val.length !== 0){
                                        const point = this.state.point;
                                        point.properties.topo_name = val;
                                        this.setState({point});
                                    }
                                    else{
                                        message.warn("Topo can't be blank.");
                                    }
                                    
                                })
                            }}
                            
                            >{this.state.point.properties.topo_name}
                        </Text>
                </Descriptions.Item>
                <Descriptions.Item
                    label="Topo Indication"
                >
                        <Text
                            editable={ this.state.proposedChanges && {
                                onChange:((val)=>{
                                    if (val.length !== 0){
                                        const point = this.state.point;
                                        point.properties.topo_indi = val;
                                        this.setState({point});
                                    }
                                    else{
                                        message.warn("Topo Indication can't be blank.");
                                    }
                                    
                                })
                            }}
                            
                            >{this.state.point.properties.topo_indi}
                        </Text>
                </Descriptions.Item>
                <Descriptions.Item
                    label="Topo"
                >
                        <Text
                            editable={ this.state.proposedChanges && {
                                onChange:((val)=>{
                                    if (val.length !== 0){
                                        const point = this.state.point;
                                        point.properties.gear = val;
                                        this.setState({point});
                                    }
                                    else{
                                        message.warn("Gear can't be blank.");
                                    }
                                    
                                })
                            }}
                            
                            >{this.state.point.properties.gear}
                        </Text>
                </Descriptions.Item>
                <Descriptions.Item
                    label="Enterance Type"
                >
                        <Text
                            editable={ this.state.proposedChanges && {
                                onChange:((val)=>{
                                    if (val.length !== 0){
                                        const point = this.state.point;
                                        point.properties.ent_type = val;
                                        this.setState({point});
                                    }
                                    else{
                                        message.warn("Enterance type can't be blank.");
                                    }
                                    
                                })
                            }}
                            
                            >{this.state.point.properties.ent_type}
                        </Text>
                </Descriptions.Item>
                <Descriptions.Item
                    label="Field Indication"
                >
                        <Text
                            editable={ this.state.proposedChanges && {
                                onChange:((val)=>{
                                    if (val.length !== 0){
                                        const point = this.state.point;
                                        point.properties.field_indi = val;
                                        this.setState({point});
                                    }
                                    else{
                                        message.warn("Field indication can't be blank.");
                                    }
                                    
                                })
                            }}
                            
                            >{this.state.point.properties.field_indi}
                        </Text>
                </Descriptions.Item>
                <Descriptions.Item
                    label="Map Status"
                >
                        <Text
                            editable={ this.state.proposedChanges && {
                                onChange:((val)=>{
                                    if (val.length !== 0){
                                        const point = this.state.point;
                                        point.properties.map_status = val;
                                        this.setState({point});
                                    }
                                    else{
                                        message.warn("Map status can't be blank.");
                                    }
                                    
                                })
                            }}
                            
                            >{this.state.point.properties.map_status}
                        </Text>
                </Descriptions.Item>
                <Descriptions.Item
                    label="Geology"
                >
                        <Text
                            editable={ this.state.proposedChanges && {
                                onChange:((val)=>{
                                    if (val.length !== 0){
                                        const point = this.state.point;
                                        point.properties.geology = val;
                                        this.setState({point});
                                    }
                                    else{
                                        message.warn("Geology can't be blank.");
                                    }
                                    
                                })
                            }}
                            
                            >{this.state.point.properties.geology}
                        </Text>
                </Descriptions.Item>
                <Descriptions.Item
                    label="Geology Age"
                >
                        <Text
                            editable={ this.state.proposedChanges && {
                                onChange:((val)=>{
                                    if (val.length !== 0){
                                        const point = this.state.point;
                                        point.properties.geo_age = val;
                                        this.setState({point});
                                    }
                                    else{
                                        message.warn("Geology age can't be blank.");
                                    }
                                    
                                })
                            }}
                            
                            >{this.state.point.properties.geo_age}
                        </Text>
                </Descriptions.Item>
            </Descriptions>
            <Divider orientation="left">Narrative</Divider>
            
            <Paragraph>
                {narrative}
            </Paragraph>
            {this.state.proposedChanges &&
                <TextArea
                    placeholder="Add to the narrative."
                    autoSize={{ minRows: 4 }}
                    onChange={(newNarrative)=>{
                        this.setState({newNarrative: newNarrative.target.value})
                    }}
                >
                    {this.state.newNarrative}
                </TextArea>
            }
            </div>
        )
    }

    renderTitle = ()=>{
        return(
        <div>
            <Row justify="start">
                <Space align="baseline">
                    <Col>
                        <Title level={3}>{this.state.point.properties.name}</Title>
                    </Col>
                    <Col>
                        <Text type="secondary">{this.state.point.properties.tcsnumber}</Text>
                    </Col>
                    
                </Space>
                <div style={{marginLeft:"auto"}}>
                    {this.proposeChangesBar()}
                </div>
                
                    
            </Row>
            <Row justify="start">
                <Text type="secondary">{this.state.point.properties.co_name + " County"}</Text>
            </Row>
        </div>
        )
    }

    proposeChangesBar(){
        return(
        <div>
        {!this.state.proposedChanges ?
            <Button type="primary"
                onClick={()=>{
                    this.setState({proposedChanges: !this.state.proposedChanges});
                }}
            >
                Propose Changes
            </Button>
            :
            <Space>
                <Button danger
                    onClick={()=>{
                        const revertPoint = JSON.parse(JSON.stringify(this.state.pointCopy));
                        this.setState({
                            proposedChanges: !this.state.proposedChanges,
                            point: revertPoint
                        });
                        console.log(revertPoint)
                    }}
                    >
                    Cancel
                </Button>
                <Button
                    type="primary"
                    onClick={()=>{
                        const point = JSON.parse(JSON.stringify(this.state.point)) as Feature;
                        point.properties.narr += "\n\n" + this.state.newNarrative;
                        const newSubmission = {
                            submitted_by: "Michael Ketzner",
                            point: point,
                            status: "Pending",
                            pointType: "Existing"
                        } as SubmittedPoint;

                        if (!deepEqual(this.state.point, this.state.pointCopy) || this.state.newNarrative === "\n\n"){
                            
                            addSubmittedPoint(newSubmission).then(()=>{
                                message.success("Your changes to " + point.properties.tcsnumber + " are under review.")
                            })
                        }
                        else{
                            message.warn("You didn't make any changes.")
                        }
                        
                        this.setState({
                            proposedChanges: !this.state.proposedChanges,
                            point
                        }, ()=>{console.log(this.state.point.properties.narr)});
                    }}
                    >
                    Submit
                </Button>
            </Space>
        }
        </div>
        )
    }
    

    render(){
        
        return(
            <div className="site-layout-content">
                <Card
                    bordered={false}
                    loading={this.state.isLoading}
                    actions={[
                    // <SettingOutlined key="setting" />,
                    // <EditOutlined key="edit" />,
                    // <EllipsisOutlined key="ellipsis" />,
                    ]}
                    
                >
                {this.props.renderTitle &&
                    <div>
                        {this.renderTitle()}
                        <Divider orientation="left"></Divider>
                    </div>
                }
                <Meta description = {this.renderDescription()}></Meta>

                <Divider orientation="left">Maps</Divider>
                <DisplayAllMaps tcsnumber={this.state.point.properties.tcsnumber}></DisplayAllMaps>

                {this.props.showMap &&
                    <div>
                        <Divider orientation="left">Location</Divider>

                        <div style={{height:"400px"}}>
                            <MapView
                                center={this.state.point.geometry.coordinates}
                                zoom={15}
                            />
                        </div>
                    </div>
                }

                
                    
                </Card>                
            </div>
        )
    }
}
export { CaveInfo };