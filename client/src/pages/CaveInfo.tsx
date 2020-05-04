import React, { Component } from "react";
import { Feature } from '../pages/geoJsonInterface'
import { Card, Descriptions, PageHeader, Space,  Col, Row, Typography, Divider, Layout } from 'antd'
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { getMasterPoint } from "../dataservice/getPoints";
import { cleanString } from "../dataservice/cleanString"

import { MapView } from "../components/MapView"
import { PointInfoPopup } from "../components/PointInfoPopup";

const { Content } = Layout
const { Paragraph, Title, Text } = Typography;

interface State {
    point: Feature,
    isLoading: boolean,
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
            this.setState({point:requestedPoint, isLoading: false});
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

                // title={this.state.point.properties.name}
                
                bordered
                column={{ xxl: 1, xl: 3, lg: 2, md: 3, sm: 2, xs: 1 }}
            >
                <Descriptions.Item label="Length">{this.state.point.properties.length}</Descriptions.Item>
                <Descriptions.Item label="Pit Depth">{this.state.point.properties.pdep}</Descriptions.Item>
                <Descriptions.Item label="Vertical Extent">{this.state.point.properties.depth}</Descriptions.Item>
                <Descriptions.Item label="Elevation">{this.state.point.properties.elev}</Descriptions.Item>
                <Descriptions.Item label="PS">{this.state.point.properties.ps}</Descriptions.Item>
                <Descriptions.Item label="County">{this.state.point.properties.co_name}</Descriptions.Item>
                <Descriptions.Item label="Topo">{this.state.point.properties.topo_name}</Descriptions.Item>
                <Descriptions.Item label="Topo Indication">{this.state.point.properties.topo_indi}</Descriptions.Item>
                <Descriptions.Item label="Gear">{this.state.point.properties.gear}</Descriptions.Item>
                <Descriptions.Item label="Enterance Type">{this.state.point.properties.ent_type}</Descriptions.Item>
                <Descriptions.Item label="Field Indication">{this.state.point.properties.field_indi}</Descriptions.Item>
                <Descriptions.Item label="Map Status">{this.state.point.properties.map_status}</Descriptions.Item>
                <Descriptions.Item label="Geology">{this.state.point.properties.geology}</Descriptions.Item>
                <Descriptions.Item label="Geology Age">{this.state.point.properties.geo_age}</Descriptions.Item>
            </Descriptions>
            <Divider orientation="left">Narrative</Divider>
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
                </Row>
            <Row justify="start">
                <Text type="secondary">{this.state.point.properties.co_name + " County"}</Text>
            </Row>
        </div>
        )
    }
    

    render(){
        
        return(
            <div className="site-layout-content">
                <Card
                    bordered={false}
                    loading={this.state.isLoading}
                    style={{  }}
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
                
                <Meta description={this.renderDescription()}/>


                
                <Paragraph>
                    {this.state.point.properties.narr}
                </Paragraph>

                {this.props.showMap &&
                    <div>
                        <Divider orientation="left">Map</Divider>

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