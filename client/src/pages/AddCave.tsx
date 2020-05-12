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
    autocompleteDisabled: boolean
    point: Feature,
}




class AddCave extends Component<any, State>{ 
    
    constructor(Props){
        super(Props);
        this.state = {
            autocompleteDisabled: false,
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
        this.handleSubmit = this.handleSubmit.bind(this);
    }

 
    
    renderCoordinateForm(){
        return(
            <Input.Group compact>
                <Form.Item name="lat" label="Latitude">
                    <InputNumber></InputNumber>
                </Form.Item>
                <Form.Item name="long" label="Longitude">
                    <InputNumber></InputNumber>
                </Form.Item>
            </Input.Group>
        )
    }

    handleSubmit(values: Store){
        console.log(values)
        const newSubmmision = {
            submitted_by: "Michael Ketzner",
            status: "Pending",
            pointType: "New",
            point: {
                type: "Feature",
                properties:{
                    tcsnumber: values.tcsnumber,
                    name: values.name,
                    length: values.length,
                    depth: values.depth,
                    pdep: values.pdepth,
                    ps: values.ps,
                    co_name: values.co_name,
                    topo_name: values.topo_name,
                    topo_indi: values.topo_indi,
                    elev: values.elev,
                    ownership: values.ownership.join(" "),
                    gear: values.gear,
                    ent_type: values.ent_description[values.ent_description.length-1],
                    field_indi: values.field_indi,
                    map_status: values.map_status,
                    geology: values.geology,
                    geo_age: values.geo_age,
                    phys_prov: values.phys_prov,
                    narr: values.narr
                },
                geometry: {
                    type: "Point",
                    coordinates: [values.long, values.lat]
                },
            }
        } as SubmittedPoint

        addSubmittedPoint(newSubmmision).then(()=>{
            message.success(values.name + " submitted successfully.");
        })

        console.log(newSubmmision);
    }

    render(){

        let narrPlaceholderArr = [];
        narrPlaceholderArr.push("1. Photocopy portion of topographic map and mark cave location on it.");
        narrPlaceholderArr.push("2. Specific directions to cave including prominent field and topographic landmarks. Include Distances, compass angles, and sketch map.");
        narrPlaceholderArr.push("3. Complete narrative description of the cave including interesting scientific and historical information. Describe how the enterance appears in the field, dimmentions of enterance.");
        
        let narrPlaceholder = "";
        for (let i = 0; i<narrPlaceholderArr.length; i++){
            narrPlaceholder += narrPlaceholderArr[i]
            if (i <narrPlaceholderArr.length-1){
                narrPlaceholder += "\n"
            }
        }

        
        return(
            <div className="site-layout-content">
                <Card>
                <Divider></Divider>
                <Form
                    // labelCol={{ span: 8 }}
                    // wrapperCol={{ span: 14 }}
                    layout="vertical"
                    onFinish={this.handleSubmit}
                    initialValues={{ remember: true }}
                    
                >
                    <Form.Item label="Cave Name" name="name">
                        <Input />
                    </Form.Item>
                    <Row>
                        <Space>
                            <Form.Item label="Length (ft)" name="length">
                                <InputNumber defaultValue={0} min={0}></InputNumber>
                            </Form.Item>
                            <Form.Item label="Vertical Extent (ft)" name="depth">
                                <InputNumber defaultValue={0} min={0}></InputNumber>
                            </Form.Item>
                            <Form.Item label="Pit Depth (ft)" name="pdepth">
                                <InputNumber defaultValue={0} min={0}></InputNumber>
                            </Form.Item>
                            <Form.Item label="Elevation (ft)" name="elev">
                                <InputNumber defaultValue={0} min={0}></InputNumber>
                            </Form.Item>
                        </Space>
                    </Row>
                    <Row>
                        <Space>
                            <Form.Item label="County" name="co_name" style={{minWidth: "110px"}}>
                                <Select
                                    showSearch
                                    onFocus={()=>{
                                        document.querySelectorAll(".ant-select-selector input").forEach((e) => {
                                            e.setAttribute("autocomplete", "stopDamnAutocomplete");
                                           //you can put any value but NOT "off" or "false" because they DO NOT works
                                         })
                                    }}
                                    
                                    autoFocus={false}
                                    
                                    placeholder="Select"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {tn_counties.map((county)=>(
                                        <Select.Option value={county}>{county}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item label="Enterance Number" name="ent_num">
                                <Input />
                            </Form.Item>
                            <Form.Item label="Number of Enterances" name="num_of_ent">
                                <Input />
                            </Form.Item>
                            <Form.Item label="TCS#" name="tcsnumber">
                                <Input />
                            </Form.Item>
                        </Space>
                    </Row>
                    {this.renderCoordinateForm()}
                    <Row>
                        <Space>
                            <Form.Item label="Ownership" name="ownership">
                                <Cascader
                                    options={[
                                    {
                                        value: 'Goverment',
                                        label: 'Goverment',
                                        children: [
                                        {
                                            value: 'Owned',
                                            label: 'Owned',
                                        },
                                        {
                                            value: 'Leased',
                                            label: 'Leased',
                                        },
                                        {
                                            value: 'Park',
                                            label: 'Park',
                                        },
                                        ],
                                    },
                                    {
                                        value: 'NSS',
                                        label: 'NSS',
                                        children: [
                                        {
                                            value: 'Owned Or Leased',
                                            label: 'Owned or Leased',
                                        }
                                        ],
                                    },
                                    {
                                        value: 'Private Property',
                                        label: 'Private Property',
                                        
                                    },
                                    {
                                        value: 'Commercial',
                                        label: 'Commercial',
                                        
                                    },
                                    {
                                        value: 'Locked/Gated',
                                        label: 'Locked/Gated',
                                    },
                                    {
                                        value: 'Entry Forbidden',
                                        label: 'Entry Forbidden',
                                    },
                                    {
                                        value: 'Destroyed or Blocked',
                                        label: 'Destroyed or Blocked',

                                    },
                                    ]}
                                />
                            </Form.Item>
                            <Form.Item label="Gear Needed" name="gear">
                                <Select placeholder="Please select">
                                    <Select.Option value="Handline">Handline</Select.Option>
                                    <Select.Option value="Wading">Wading</Select.Option>
                                    <Select.Option value="Boat/Swimming">Boat/Swimming</Select.Option>
                                </Select>
                            </Form.Item>
                            <Form.Item label="Enterance Description" name="ent_description">
                                <Cascader
                                    options={[
                                    {
                                        value: 'horizontal',
                                        label: 'Horizontal',
                                        children: [
                                        {
                                            value: 'Extremely Big',
                                            label: 'Extremely Big',
                                        },
                                        {
                                            value: 'Walk In',
                                            label: 'Walk In',
                                        },
                                        {
                                            value: 'Stoop or Duck',
                                            label: 'Stoop or Duck',
                                        },
                                        {
                                            value: 'Crawl',
                                            label: 'Crawl',
                                        },
                                        {
                                            value: 'Artificial',
                                            label: 'Artificial',
                                        },
                                        ],
                                    },
                                    {
                                        value: 'Vertical',
                                        label: 'Vertical',
                                        children: [
                                        {
                                            value: 'Bells Out',
                                            label: 'Bells Out',
                                        },
                                        {
                                            value: 'Chimney/CLimb',
                                            label: 'Chinmey/Climb',
                                        },
                                        {
                                            value: 'Artificial',
                                            label: 'Artificial',
                                        },
                                        ],
                                    },
                                    ]}
                                />
                            </Form.Item>
                            <Form.Item label="Field Indication" name="field_indi">
                                <Select placeholder="Please select">
                                    <Select.Option value="Hillside">Hillside</Select.Option>
                                    <Select.Option value="Sink">Sink</Select.Option>
                                    <Select.Option value="Spring">Spring</Select.Option>
                                    <Select.Option value="Inflowing Stream">Inflowing Stream</Select.Option>
                                    <Select.Option value="Bluff or Outcrop">Bluff or Outcrop</Select.Option>
                                    <Select.Option value="Roadcut">Roadcut</Select.Option>
                                    <Select.Option value="Level Ground">Level Ground</Select.Option>
                                    <Select.Option value="Quary">Quary</Select.Option>
                                    <Select.Option value="Underwater">Underwater</Select.Option>
                                    <Select.Option value="Wet-Weather Streambed">Wet-Weather Streambed</Select.Option>
                                </Select>
                            </Form.Item>
                            </Space>
                    </Row>
                    <Row>
                        <Space>
                        <Form.Item label="Topo Indication" name="topo_indi">
                            <Select placeholder="Please select">
                                <Select.Option value="None">None</Select.Option>
                                <Select.Option value="Sink">Sink</Select.Option>
                                <Select.Option value="Contour Distortion">Contour Distortion</Select.Option>
                                <Select.Option value="Inflowing Stream">Inflowing Stream</Select.Option>
                                <Select.Option value="Spring">Spring</Select.Option>
                                <Select.Option value="Quary">Quary</Select.Option>
                                <Select.Option value="Marked as Cave">Marked as Cave</Select.Option>
                            </Select>
                        </Form.Item>
                            <Form.Item label="Geologic Formation" name="geology">
                                <Input></Input>
                            </Form.Item>
                            <Form.Item label="Physiographic Province" name="phys_prov">
                                <Input></Input>
                            </Form.Item>
                        </Space>
                    </Row>
                    <Form.Item label="Narrative" name="narr">
                        <Input.TextArea style={{height:"300px"}} placeholder={narrPlaceholder}>

                        </Input.TextArea>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                        Submit
                        </Button>
                    </Form.Item>
                </Form>
                </Card>
            </div>
        )
    }
}
export { AddCave };