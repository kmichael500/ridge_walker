import React, { Component } from "react";
import { Feature } from '../interfaces/geoJsonInterface'
import { tn_counties } from '../dataservice/countyList'
import { PieChart, Pie, Sector } from 'recharts';

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
import { getAllMasterPoints } from "../dataservice/getPoints";

const { Content } = Layout
const { Paragraph, Title, Text } = Typography;


const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const {
      cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
      fill, payload, percent, value,
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';
  
    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>{payload.name}</text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`PV ${value}`}</text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
          {`(Rate ${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };

interface State {
    points: Feature[],
    mapped: number,
    unmapped: number,
    mapDictionary: any,
    activeIndex: number
}
class Dashboard extends Component<any, State>{ 
    
    constructor(Props){
        super(Props);
        this.state = {
            points: {} as Feature[],
            mapped: null,
            unmapped: null,
            mapDictionary: null,
            activeIndex: 0
        }
    }

    componentDidMount(){
        getAllMasterPoints().then((points)=>{
            let m = 0;
            let u = 0;
            let mapDictionary = {};
            for (let i = 0; i< points.length; i++){
                if (points[i].properties.map_status === "Mapped"){
                    m++;
                }
                else{
                    u++;
                }

                if (points[i].properties.map_status === ""){

                }
                else if (mapDictionary[points[i].properties.map_status] === undefined){
                    mapDictionary[points[i].properties.map_status] = 0;
                }
                else{
                    mapDictionary[points[i].properties.map_status]++;
                }
            }
            // console.log(mapDictionary)
            let values = []
            for (const key in mapDictionary){
                values.push({
                    name:key,
                    value: mapDictionary[key]
                })
            }
            this.setState({points, unmapped: u, mapped: m, mapDictionary: values})

        })
    }

    onPieEnter = (data, index) => {
        this.setState({
          activeIndex: index,
        });
      };


    render(){
        

        return(
            <div className="site-layout-content">
                <Card title="Dashboard">
                    <Button
                        shape="round"
                        size="large"
                    >
                    <a
                        href='http://localhost:5000/api/points/master/download/gpx'
                        download
                    >
                        Download GPX
                    </a
                    ></Button>
                    <Button
                        shape="round"
                        size="large"
                    >
                    <a
                        href='http://localhost:5000/api/points/master/download/csv'
                        download
                    >
                        Download CSV
                    </a
                    ></Button>
                    <Paragraph>{"Unmapped: " + this.state.unmapped + "\nMapped: " + this.state.mapped}</Paragraph>
                    <Paragraph>{JSON.stringify(this.state.mapDictionary)}</Paragraph>
                    <PieChart width={400} height={400}>
        <Pie
          activeIndex={this.state.activeIndex}
          activeShape={renderActiveShape}
          data={this.state.mapDictionary}
        //   cx={200}
        //   cy={200}
        //   innerRadius={60}
        //   outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          onMouseEnter={this.onPieEnter}
        />
      </PieChart>

                </Card>
            </div>
        )
    }
}
export { Dashboard };