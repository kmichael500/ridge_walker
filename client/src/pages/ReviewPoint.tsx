import React, { Component } from "react";
import { SubmittedPoint } from '../interfaces/submittedPointInterface'
import { Feature } from '../interfaces/geoJsonInterface'
import { PointsTable } from '../components/PointsTable'
import { getAllSubmittedPoints } from '../dataservice/submittedPoints'
import { List, Card, Skeleton, Button, Tabs, Space, Input, Typography } from 'antd'
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import { cleanString } from "../dataservice/cleanString"
import { Table } from 'antd'
import { withRouter } from 'react-router-dom';
const { Paragraph } = Typography;


const { TabPane } = Tabs;

interface ReviewTableState {
    points: SubmittedPoint[],
    data: any,
    columns: any,
    searchText: string,
    searchedColumn: string,
    selectedRowKeys: any,
    isLoading: boolean
}

interface ReviewTableProps {
    points: SubmittedPoint[]
}

class reviewTable extends Component<ReviewTableProps, ReviewTableState>{
    searchInput: any
    constructor(props){
        super(props);
        this.state = {
            points: undefined,
            data: null,
            columns: null,
            searchText: '',
            searchedColumn: '',
            selectedRowKeys: [],
            isLoading: true
        }

        this.processPoints = this.processPoints.bind(this);
        // console.log(this.props.points)
    }

    componentDidMount(){
        if (this.props.points !== undefined){
            this.processPoints(this.props.points);
            this.setState({isLoading: false})
        }
    }
    componentDidUpdate(prevProps) {
      if (this.props.points !== prevProps.points) {
        console.log(this.props.points)
        this.processPoints(this.props.points);
        this.setState({isLoading: false})
      }
    }


    selectRow = (record) => {
        // this.props.history.push("/points/"+record.tcsnumber)


        // const selectedRowKeys = [...this.state.selectedRowKeys];
        // if (selectedRowKeys.indexOf(record.key) >= 0) {
        //   selectedRowKeys.splice(selectedRowKeys.indexOf(record.key), 1);
        // } else {
        //   selectedRowKeys.push(record.key);
        // }

        // this.setState({ selectedRowKeys });
      }
      onSelectedRowKeysChange = (selectedRowKeys) => {
        console.log(this.props.points[selectedRowKeys[0]]);
        this.setState({ selectedRowKeys });
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

    processPoints(points: SubmittedPoint[]){
        console.log(points)
        let columns = [
            {
              title: 'Name',
              dataIndex: 'name',
              ...this.getColumnSearchProps('name'),
            },
            {
                title: 'ID',
                dataIndex: 'tcsnumber',
                ...this.getColumnSearchProps('tcsnumber'),
              },
            {
                title: 'Submitted By',
                dataIndex: 'submitted_by',
                ...this.getColumnSearchProps('submitted_by'),
            }, 
            {
              title: 'Date',
              dataIndex: 'date',
            //   width: '12%',
              sorter: {
                compare: (a, b) =>  b.length - a.length,
                // multiple: 3,
              }
            },
            {
                title: 'Status',
                dataIndex: 'status',
              //   width: '12%',
                sorter: {
                  compare: (a, b) =>  b.length - a.length,
                  // multiple: 3,
                }
              },
            {
                title: "Action",
                key: "action",
                render: (text, record) => (
                    <Space size="middle">
                    <a href={"/review/points/"+record.mongoID}>Review</a>
                    <a>Delete</a>
                    </Space>
                )
            }
          ];


          // columns.length=2;
          let data = [];
          for (let i = 0; i<points.length; i++){
            let narrativeStr = cleanString(points[i].point.properties.narr);
            const narrative = narrativeStr.split('\n').map((item, i) => {
                return <Paragraph key={i}>{item}</Paragraph>;
            });
            let point = {
                key: i,
                name: points[i].point.properties.name,
                tcsnumber: points[i].point.properties.tcsnumber,
                submitted_by: points[i].submitted_by,
                status: points[i].status,
                date: new Date(points[i].date).toLocaleDateString(),
                mongoID: points[i]._id
                ,
                // gear: points[i].point.properties.gear,
                // length: points[i].point.properties.length,
                // pdep: points[i].point.properties.pdep,
                // depth: points[i].point.properties.depth,
                // map_status: points[i].point.properties.map_status,
                // co_name: points[i].point.properties.co_name,
                // ownership: points[i].point.properties.ownership,
                // Depth:  points[i].point.properties.depth,
                // description: narrative
            }
            data.push(point);
          }

          this.setState({data, columns})
    }
    
    render() {
      const { selectedRowKeys } = this.state;
      const rowSelection = {
          selectedRowKeys,
          onChange: this.onSelectedRowKeysChange,
      };
      return (
          <Table
              columns={this.state.columns}
              size="middle"
              scroll={{ x: 10 }}
              expandable={{
                  expandedRowRender: record => <p style={{ margin: 0 }}>{record.description}</p>,
                  rowExpandable: record => record.name !== 'Not Expandable',
              }}
              // rowSelection={rowSelection}
              onRow={(record) => ({
                  onClick: () => {
                    this.selectRow(record);
                  },
              })}
              dataSource={this.state.data}
              loading={this.state.isLoading}
          />
      );
  }
}
const ReviewTable = withRouter(reviewTable)
export {reviewTable as ReviewTable}




interface State {
    submittedPoints: SubmittedPoint[]
    newPoints: SubmittedPoint[],
    existingPoints: SubmittedPoint[],
}

interface Props {

}
class ReviewPoint extends Component<Props, State>{  
    
    constructor(Props){
        super(Props);
        this.state = {
            submittedPoints: undefined,
            newPoints: undefined,
            existingPoints: undefined
        }
        this.renderNewCaves = this.renderNewCaves.bind(this);
        this.renderExistingCaves = this.renderExistingCaves.bind(this);
    }

    componentDidMount(){
        getAllSubmittedPoints().then((requstedSubmissions)=>{
            // console.log(requstedPoints);
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

    renderNewCaves(){
        return(
            // <Card>
                <ReviewTable
                    points={this.state.newPoints}
                >

                </ReviewTable>
            // </Card>
        )
    }

    renderExistingCaves(){
        return(
            // <Card>
                <ReviewTable
                    points={this.state.existingPoints}
                >

                </ReviewTable>
            // </Card>
        )
    }

    

    

    render(){
        return(
            <div className="site-layout-content">
                <Card>
                {/* <Space> */}
                <Tabs defaultActiveKey="1">
                    <TabPane tab="New Caves" key="1">
                        {this.renderNewCaves()}
                    </TabPane>
                    <TabPane tab="Existing Caves" key="2">
                        {this.renderExistingCaves()}
                    </TabPane>
                </Tabs>
                {/* </Space> */}
                </Card>
                
            </div>
        )
    }
}
export { ReviewPoint };