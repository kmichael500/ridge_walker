import React, { Component } from "react";
import { Feature } from '../interfaces/geoJsonInterface'
import { tn_counties } from '../dataservice/countyList'
import { Parallax, Background } from 'react-parallax'
// import "./homepage.css"
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
    PageHeader,
    Col
  } from 'antd';
import Item from "antd/lib/list/Item";
import { Store } from "antd/lib/form/interface";
import { SubmittedPoint } from "../interfaces/submittedPointInterface";
import { addSubmittedPoint } from "../dataservice/submittedPoints";

const { Content } = Layout
const { Paragraph, Title, Text } = Typography;

interface State {

}


const { Footer } = Layout;


class HomePage extends Component<any, State>{ 
    
    constructor(Props){
        super(Props);
        this.state = {
            
        }
    }

    renderCaveImage(){
        return(
            <Parallax
                strength={500}
                bgImage="https://live.staticflickr.com/65535/49339367413_e2af5eb8cc_6k.jpg"
                // bgImageStyle={{opacity:.1}}
            >
            <Row style={{
                    height:500,
                    background:"linear-gradient(to right, rgba(1,1,1,0.9), rgba(0,0,0,0)",
                    opacity:.9,
                }}
                align="middle"
            >
                <div style={{
                    position: "absolute",
                    left: "20%",
                    top: "50%",
                    transform: "translate(-50%,-50%)",
                    
                }}>

                    <h1 style={{textAlign: "center",color:"white"}}>Discovery</h1>
                    <h1 style={{textAlign: "center",color:"white"}}>Exploration</h1>
                    <h1 style={{textAlign: "center",color:"white"}}>Survey</h1>
                    <h1 style={{textAlign: "center",color:"white"}}>Mapping</h1>
                </div>
                
            </Row>
            
        </Parallax>

        
        )
    }


    render(){

        return(
             <div>
                
                {/* {this.renderCaveImage()} */}
 
                <Parallax strength={500} bgStyle={{backgroundColor:"white"}}>
                    <div style={{
                        paddingRight: 100,
                        paddingLeft: 100,
                        paddingBottom: 50,
                        paddingTop:25,
                        backgroundColor: "white"
                        
                        }}
                    >
                        <Title style={{textAlign: "center"}}>Tennessee Cave Survey</Title>
                        <Paragraph>The Tennessee Cave Survey (TCS) is an internal organization of the National Speleological Society (NSS). The TCS is committed to the discovery, exploration, survey and mapping of the caves of Tennessee and to systematically collect, organize, maintain, and disseminate cave location information, cave narrative files, bibliographic data, and cave maps. The TCS relies exclusively on the volunteer participation of its caver members for all its data.</Paragraph>
                        <img width="100%" src={"cave_dist_2018.jpg"}></img>
                        <h5 style={{textAlign:"center"}}>Caves of Tennessee 2018</h5>
                    </div>
                    
                </Parallax>
        


       


                {/* <Parallax strength={500}>
                    <div style={{
                        height: "100%",
                        backgroundColor:"white",
                        padding: 100,
                        }}
                    >
                    <Title style={{textAlign:"center"}}>Caves of Tennessee 2018</Title>
                    <img width="100%" src={"cave_dist_2018.jpg"}></img>
                    </div>
                </Parallax> */}

                <Parallax
                        bgImage="http://www.subworks.com/tcs/images/tcs_CS_2019.jpg"
                        strength={500}
                >
                <div style={{ height: 500 }}>
                    <div style={{
                        // background: "white",
                        // padding: 20,
                        // position: "absolute",
                        // top: "50%",
                        // left: "50%",
                        // transform: "translate(-50%,-50%)"
                    }}></div>
                </div>
                </Parallax>

                <Parallax strength={500}>
                    <div style={{
                            backgroundColor: "white",
                            height: "100%",
                            paddingRight: 100,
                            paddingLeft: 100,
                            paddingBottom: 50,
                            paddingTop:25,
                        }}
                    >
                        <Title style={{textAlign:"center"}}>Become a Member</Title>
                        <Paragraph>    TCS data is available to vetted members of the caving community. The TCS, along with its parent organization the NSS, strongly encourages and promotes the protection of the caves of Tennessee from significant adverse environmental impact. The TCS recognizes that this conservation should also be consistent with reasonable cave access for recreation, scientific study, exploration and survey by cavers in good standing. </Paragraph>
                        <Paragraph>    The TCS encourages its member cavers to cultivate and maintain good relationships with private landowners, as well as local, state and federal government institutions.</Paragraph>
                        <Paragraph>The TCS discourages widespread dissemination of sensitive cave information, that may encourage unprincipled or uneducated people to cause harm to the cave environment. The TCS does not release cave locations, cave maps, or other TCS data en mass to any person, outdoors group, government agency, state agency, private or non-profit organizations. However, on a case by case basis, TCS will consider releasing limited data to responsible people or agencies that it considers necessary to help preserve the cave and/or its environment.</Paragraph>
                        <Row justify="center">
                            <Button shape="round" size="large" onClick={()=>{this.props.history.push("/register")}}>Membership Application</Button>
                        </Row>
                    </div>
                </Parallax>

    
        
 
                <Footer style={{backgroundColor:"white", color: "black", textAlign:"center"}}>
                    <Divider>
                        
                    </Divider>
                    <p style={{fontSize:8}}>Copyright © 1998-2020 Tennessee Cave Survey, All Rights Reserved. All of the TCS information & data are proprietary including any TCS information contained on this web site. The TCS does not give out Tennessee cave locations. Duplication, distribution & use of any of any TCS information & data is by written permission only. Failure to request permission to use contents as stated herein is considered a violation of the U.S. Copyright Law.</p>
                    </Footer>

            </div>

            
            
            

            
            // <Row justify="space-between" align="middle">
            //     <Space direction="vertical" size="large">
            //     <Paragraph>
            //     The Tennessee Cave Survey (TCS) is an internal organization of the National Speleological Society (NSS). The TCS is committed to the discovery, exploration, survey and mapping of the caves of Tennessee and to systematically collect, organize, maintain, and disseminate cave location information, cave narrative files, bibliographic data, and cave maps. The TCS relies exclusively on the volunteer participation of its caver members for all its data.
            //     </Paragraph>
            //     <img width="100%" src="https://live.staticflickr.com/1955/44569793024_5fa86410e6_6k.jpg"></img>
            //     </Space>

            // </Row>
            // </div>
        )
    }
}
export { HomePage };