import React, { Component } from "react";
import { Feature } from '../interfaces/geoJsonInterface'

import { Input, Button, Space, Typography } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import { Table } from 'antd'
import { withRouter } from 'react-router-dom';

const { Paragraph } = Typography;


interface State {
    points: Feature[],
    data: any,
    columns: any,
    searchText,
    searchedColumn,
    selectedRowKeys: any,
    isLoading: boolean
}

interface Props {
    points: Feature[]
}

class PointsTable extends Component<Props, State>{  
    searchInput: any
    constructor(props){
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

    
    componentDidUpdate(prevProps) {
      if (this.props.points !== prevProps.points) {
        this.processPoints(this.props.points);
        this.setState({isLoading: false})
      }
    }


    selectRow = (record) => {
        this.props.history.push("/points/"+record.tcsnumber)


        // const selectedRowKeys = [...this.state.selectedRowKeys];
        // if (selectedRowKeys.indexOf(record.key) >= 0) {
        //   selectedRowKeys.splice(selectedRowKeys.indexOf(record.key), 1);
        // } else {
        //   selectedRowKeys.push(record.key);
        // }

        // this.setState({ selectedRowKeys });
      }
      onSelectedRowKeysChange = (selectedRowKeys) => {
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

    processPoints(points: Feature[]){
        let columns = [
            {
              title: 'Name',
              dataIndex: 'name',
              fixed: "left",
              // width: "200px",
              ...this.getColumnSearchProps('name'),
            },
            {
                title: 'ID',
                dataIndex: 'tcsnumber',
                ...this.getColumnSearchProps('tcsnumber'),
              },
            {
                title: 'Gear',
                dataIndex: 'gear',
                ...this.getColumnSearchProps('gear'),
            },
              
            {
              title: 'Length',
              dataIndex: 'length',
            //   width: '12%',
              sorter: {
                compare: (a, b) =>  b.length - a.length,
                // multiple: 3,
              },
              defaultSortOrder: "ascend"
            },
            {
                title: 'Pit Depth',
                dataIndex: 'pdep',
              //   width: '12%',
                sorter: {
                  compare: (a, b) => b.pdep - a.pdep,
                //   multiple: 4,
                }
              },
              {
                title: 'Vertical Extent',
                dataIndex: 'depth',
              //   width: '12%',
                sorter: {
                  compare: (a, b) => b.depth - a.depth,
                //   multiple: 4,
                }
              },
              {
                title: 'Owner',
                dataIndex: 'ownership',
              //   width: '12%',
                ...this.getColumnSearchProps('ownership'),
              },
            {
                title: 'Map Status',
                dataIndex: 'map_status',
                //   width: '30%',
                ...this.getColumnSearchProps('map_status'),
            },
            {
              title: 'County',
              dataIndex: 'co_name',
            //   width: '30%',
              ...this.getColumnSearchProps('co_name'),
            },
          ];

          // columns.length=2;
          let data = [];
          for (let i = 0; i<points.length; i++){
            const narrative = points[i].properties.narr.split('\n').map((item, i) => {
                return <Paragraph key={i}>{item}</Paragraph>;
            });
            let point = {
                key: i,
                name: points[i].properties.name,
                tcsnumber: points[i].properties.tcsnumber,
                gear: points[i].properties.gear,
                length: points[i].properties.length,
                pdep: points[i].properties.pdep,
                depth: points[i].properties.depth,
                map_status: points[i].properties.map_status,
                co_name: points[i].properties.co_name,
                ownership: points[i].properties.ownership,
                Depth:  points[i].properties.depth,
                description: narrative
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
              scroll={{ x: 1000 }}
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

const pointsTable = withRouter(PointsTable)
export { pointsTable as PointsTable };