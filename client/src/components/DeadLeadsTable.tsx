import React, { Component } from "react";
import { Input, Button, Space, Typography, Tag } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import { Table } from 'antd'
import { withRouter } from 'react-router-dom';
import { LeadPointInterface } from "../interfaces/LeadPointInterface";
import { UserSlider } from "./userInfo/UserSlider";

const { Paragraph } = Typography;


interface State {
    points: LeadPointInterface[],
    data: any,
    columns: any,
    searchText: any,
    searchedColumn: any,
    selectedRowKeys: any,
    isLoading: boolean
}

interface Props {
    points: LeadPointInterface[]
}

class DeadLeadsTable extends Component<Props, State>{  
    searchInput: any
    constructor(props: any){
        super(props);
        this.state = {
            points: this.props.points,
            data: null,
            columns: null,
            searchText: '',
            searchedColumn: '',
            selectedRowKeys: [],
            isLoading: true
        }

        this.processPoints = this.processPoints.bind(this);
    }

    
    componentDidUpdate(prevProps: any) {
      if (this.props.points !== prevProps.points) {
        this.processPoints(this.props.points);
        this.setState({isLoading: false})
      }
    }


    selectRow = (record: any) => {
        // this.props.history.push("/points/"+record.tcsnumber)


        // const selectedRowKeys = [...this.state.selectedRowKeys];
        // if (selectedRowKeys.indexOf(record.key) >= 0) {
        //   selectedRowKeys.splice(selectedRowKeys.indexOf(record.key), 1);
        // } else {
        //   selectedRowKeys.push(record.key);
        // }

        // this.setState({ selectedRowKeys });
      }
      onSelectedRowKeysChange = (selectedRowKeys: any) => {
        this.setState({ selectedRowKeys });
      }

    // search 
    getColumnSearchProps = (dataIndex: React.ReactText) => ({
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
                onClick={() => this.handleSearch((selectedKeys), confirm, dataIndex)}
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

    processPoints(points: LeadPointInterface[]){
        let columns = [
            {
              title: 'Submitted By',
              dataIndex: 'submitted_by',
            //   width: "100px",
              render: (text, row, index) => {
                return <UserSlider userID={text}></UserSlider>;
                },
            },
            {
                title: 'Last Update',
                dataIndex: 'updatedAt',
                // width: "200px",
                render: (value)=>{
                    return(new Date(value).toDateString())
                },
                sorter: {
                compare: (a, b) =>  new Date(b).getTime() - new Date(a).getTime(),
                // multiple: 3,
                },
                defaultSortOrder: "ascend"
            },
            {
                title: "Status",
                dataIndex: "status",
                // width: "100px",
                render: (val, record)=>{
                    return(
                        <Tag color="volcano">{val}</Tag>
                    )
                }
            }
          ];

          // columns.length=2;
          let data = [];
          for (let i = 0; i<points.length; i++){
            const description = points[i].point.properties.description.split('\n').map((item, i) => {
                return <Paragraph key={i}>{item}</Paragraph>;
            });
            let point = {
                key: i,
                submitted_by: points[i].point.properties.submitted_by,
                updatedAt: points[i].updatedAt,
                description,
                status: points[i].point.properties.checked_status
            }
            data.push(point);
          }


          this.setState({data, columns})
    }
    
    render() {
      // const { selectedRowKeys } = this.state;
      // const rowSelection = {
      //     selectedRowKeys,
      //     onChange: this.onSelectedRowKeysChange,
      // };
      return (
          <Table
              columns={this.state.columns}
              scroll={{ x: 500 }}
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

const deadLeadsTable = withRouter(DeadLeadsTable)
export { deadLeadsTable as DeadLeadsTable };