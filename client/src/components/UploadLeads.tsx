import React, { Component } from "react";
import { tn_counties } from '../dataservice/countyList'
import { PieChart, Pie, Sector } from 'recharts';
import { CheckedStatusType, LeadType, LeadPointInterface, LeadPoints } from '../interfaces/LeadPointInterface';

import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';


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
    Tabs,
    Table,
    Checkbox
  } from 'antd';
import { UploadCSV } from "./upload";

const { Content } = Layout
const { Paragraph, Title, Text } = Typography;
const { TabPane } = Tabs;
interface State {
    data: any,
    columns: any,
    searchText,
    searchedColumn,
    selectedRowKeys: any
    latField: string,
    longField: string,
    defaultStatus: CheckedStatusType
}
class UploadLeads extends Component<any, State>{ 
    
    searchInput: any
    constructor(props){
        super(props);
        this.state = {
            data: null,
            columns: null,
            searchText: '',
            searchedColumn: '',
            selectedRowKeys: [],
            latField: "latitude",
            longField: "longitude",
            defaultStatus: CheckedStatusType.NOTCAVE
        }

        this.handleOnUploaded = this.handleOnUploaded.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){
        
    }




    // search 
    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <div style={{ padding: 8 }}>
            <Input
              ref={node => {
                this.searchInput = node;
              }}
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
              style={{ width: 188, marginBottom: 8, display: 'block' }}
            />
            <Space>
              <Button
                type="primary"
                onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                icon={<SearchOutlined />}
                size="small"
                style={{ width: 90 }}
              >
                Search
              </Button>
              <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                Reset
              </Button>
            </Space>
          </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
          record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => this.searchInput.select());
          }
        },
        render: text =>
          this.state.searchedColumn === dataIndex ? (
            <Highlighter
              highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
              searchWords={[this.state.searchText]}
              autoEscape
              textToHighlight={text.toString()}
            />
          ) : (
            text
          ),
      });
    
      handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        this.setState({
          searchText: selectedKeys[0],
          searchedColumn: dataIndex,
        });
      };
    
      handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
      };

    handleOnUploaded(points: LeadPoints){
        let columns = [];
        for (const key in points.features[0].properties){
            if (key !== "narr"){
                columns.push({
                    title: key,
                    dataIndex: key,
                    ...this.getColumnSearchProps(key)
                })
            } 
        }
        columns.push({
            title: "latitude",
            dataIndex: "latitude",
        })
        columns.push({
            title: "longitude",
            dataIndex: "longitude",
        })
        columns.push({
            title: "Lead Type",
            dataIndex: "lead_type",
        })
        columns.push({
            title: "Status",
            dataIndex: "status",
        })
        const defaultStatus = this.state.defaultStatus
        const data = points.features.map((feature, index)=>({
            key: index,
            longitude: points.features[index].geometry.coordinates[0],
            latitude: points.features[index].geometry.coordinates[1],
            lead_type: LeadType.KARSTFEATURE,
            status:
                <Form.Item>
                    <Radio.Group
                        onChange={(e)=>{
                                const val = [...this.state.data];
                                val[e.target.id].status_value = e.target.value;
                                this.setState({data: val})
                            }}
                        defaultValue={defaultStatus}
                    >
                        <Radio id={index.toString()} value={CheckedStatusType.NOTCAVE}>
                        {CheckedStatusType.NOTCAVE}
                        </Radio>
                        <Radio id={index.toString()} value={CheckedStatusType.PENDING}>
                        {CheckedStatusType.PENDING}
                        </Radio>

                    </Radio.Group>
                </Form.Item>
            ,
            status_value: defaultStatus,
                
            ...feature.properties,
        }))
        console.log(data);
        this.setState({data:data, columns})
    }

    renderTable(){
        return(
        <div>
        <Table
            columns={this.state.columns}
            dataSource={this.state.data}
        />
        <Button type="primary" onClick={()=>{
            console.log(this.state.data);
        }}>
          Submit
        </Button>
        </div>
        )
    }

    handleSubmit(){
        const newSubmission = {
            
        } as LeadPointInterface;
        console.log(this.state.data);
    }


    render(){
        

        return(
            <Card className="site-layout-content">
                <Row justify="center" style={{background:""}}>
                <Col span={24}>
                    <Title style={{textAlign:"center"}}>Upload Leads</Title>
                </Col>
                <Col span={24}>
                    {this.state.data === null ?
                        <div>
                            <Row justify="left">
                            <Col span={24}>
                                    <Paragraph style={{textAlign:"left"}}>Upload karst features that you have confirmed are not a cave so no one has to check the same place twice!</Paragraph>
                            </Col>
                            <Space direction="horizontal" align="start">
                            <div>
                                <Paragraph>
                                    Please specify the names of the latitude and longitude columns.
                                </Paragraph>
                                <Row gutter={[8,{xs:24, sm:24, md:12, lg:12, xl:12}]}>
                                    
                                    <Col >
                                        <Input
                                            placeholder="Latitude Field"
                                            defaultValue={this.state.latField}
                                            onChange={(e)=>{
                                                this.setState({latField: e.target.value})
                                            }}
                                        />
                                    </Col>
                                    <Col>
                                        <Input
                                            placeholder="Longitude Field"
                                            defaultValue={this.state.longField}
                                            onChange={(e)=>{
                                                this.setState({longField: e.target.value})
                                            }}
                                        />
                                    </Col>
                                </Row>
                            </div>
                            <div>
                                <Paragraph>
                                    Please specify the default value of the points you are uploading.
                                </Paragraph>
                                <Radio.Group
                                    onChange={(e)=>{ 
                                            this.setState({defaultStatus: e.target.value})
                                        }}
                                    defaultValue={this.state.defaultStatus}
                                >
                                    <Radio value={CheckedStatusType.NOTCAVE}>
                                        {CheckedStatusType.NOTCAVE}
                                    </Radio>
                                    <Radio value={CheckedStatusType.PENDING}>
                                        {CheckedStatusType.PENDING}
                                    </Radio>
                                </Radio.Group>
                            </div>
                            </Space>
                            </Row>
                            <Divider></Divider>
                            <div>
                            <UploadCSV
                                onUploaded={(points)=>{this.handleOnUploaded(points)}}
                                uploadPath="api/points/leads/upload"
                                lat={this.state.latField}
                                long={this.state.longField}
                            />
                            </div>
                        </div>
                        :
                        <div>
                            {this.renderTable()}
                        </div>
                    }
                </Col>   
                </Row> 
            </Card>
        )
    }
}
export { UploadLeads };