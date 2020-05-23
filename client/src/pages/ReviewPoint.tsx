import React, { Component } from "react";
import { SubmittedPoint } from '../interfaces/submittedPointInterface'
import { Feature } from '../interfaces/geoJsonInterface'
import { PointsTable } from '../components/PointsTable'
import { getAllSubmittedPoints, deleteOneSubmittedPointByID } from '../dataservice/submittedPoints'
import { List, Card, Skeleton, Button, Tabs, Space, Input, Typography, message, Popconfirm } from 'antd'
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import { Table } from 'antd'
import { withRouter, Link } from 'react-router-dom';
import { getOneUserByID } from '../dataservice/authentication'
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
    points: SubmittedPoint[],
    action?: string
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
    }

    componentDidMount(){
        if (this.props.points !== undefined){
            this.processPoints(this.props.points);
            this.setState({isLoading: false})
        }
    }
    componentDidUpdate(prevProps) {
      if (this.props.points !== prevProps.points) {
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
        // console.log(this.props.points[selectedRowKeys[0]]);
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
                    {/* <Button> */}
                      <Link to={
                        {
                          pathname:"/review/points/"+record._id,
                          state:{
                            action:this.props.action
                          }
                        }}>{this.props.action === "Review" ? "Review" : "Edit"}</Link>
                    {/* </Button> */}
                    <Popconfirm
                      title={"Are you sure delete " + record.name}
                      onConfirm={()=>{
                        deleteOneSubmittedPointByID(record._id).then(()=>{
                          let data = JSON.parse(JSON.stringify(this.state.data));
                          delete data[record.key]
                          // console.log(data)
                          this.setState({data});
                        })
                      }}
                      onCancel={()=>{
                      }}
                      okText="Yes"
                      cancelText="No"
                    >
                      <a href="#">Delete</a>
                    </Popconfirm>
                    </Space>
                )
            }
          ];

          if (this.props.action === "Edit"){
            delete columns[2]
          }


          // columns.length=2;
          let data = [];
          for (let i = 0; i<points.length; i++){
            console.log(i);
            
            
            const narrative = points[i].point.properties.narr.split('\n').map((item, i) => {
                return <Paragraph key={i}>{item}</Paragraph>;
            });
            let point = {
                key: i,
                name: points[i].point.properties.name,
                tcsnumber: points[i].point.properties.tcsnumber,
                submitted_by: "",
                status: points[i].status,
                date: new Date(points[i].date).toLocaleDateString(),
                _id: points[i]._id
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
            getOneUserByID(points[i].submitted_by).then((user)=>{
              point.submitted_by = user.firstName + " " + user.lastName;
            });
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
                    action="Review"
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
                    action="Review"
                    points={this.state.existingPoints}
                >

                </ReviewTable>
            // </Card>
        )
    }

    

    

    render(){
        const newPointsLength = this.state.newPoints === undefined ? 0 : this.state.newPoints.length;
        const existingPointLength = this.state.existingPoints === undefined ? 0 : this.state.existingPoints.length;
        return(
            <div className="site-layout-content">
                <Card>
                {/* <Space> */}
                <Tabs defaultActiveKey="1">
                    <TabPane tab={"New Caves (" + (newPointsLength) + ")"} key="1">
                        {this.renderNewCaves()}
                    </TabPane>
                    <TabPane tab={"Existing Caves (" + existingPointLength + ")"} key="2">
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