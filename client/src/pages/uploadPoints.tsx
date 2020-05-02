import React, { Component } from "react";
import { Points, Feature } from './geoJsonInterface'
import { UploadOutlined } from '@ant-design/icons';
import { MapView } from '../components/MapView'
import { UploadCSV } from '../components/upload'

import { Input, Button, Space } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';

import { Table } from 'antd'

interface State {
    points: Points,
    data: any,
    columns: any,
    searchText,
    searchedColumn,
    selectedRowKeys: any
}

interface Props {
}

class uploadPoints extends Component<Props, State>{  
    searchInput: any
    constructor(props){
        super(props);
        this.state = {
            points: undefined,
            data: null,
            columns: null,
            searchText: '',
            searchedColumn: '',
            selectedRowKeys: []
        }

        this.handleOnUploaded = this.handleOnUploaded.bind(this);
    }

    selectRow = (record) => {
        const selectedRowKeys = [...this.state.selectedRowKeys];
        if (selectedRowKeys.indexOf(record.key) >= 0) {
          selectedRowKeys.splice(selectedRowKeys.indexOf(record.key), 1);
        } else {
          selectedRowKeys.push(record.key);
        }

        this.setState({ selectedRowKeys });
      }
      onSelectedRowKeysChange = (selectedRowKeys) => {
        console.log(this.state.points.features[selectedRowKeys[0]]);
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

    handleOnUploaded(points: Points){
        const columns = [
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
              }
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
                title: 'Depth',
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

          let data = [];
        //   console.log(points.features[0])
          for (let i = 0; i<points.features.length; i++){
            let point = {
                key: i,
                name: points.features[i].properties.name,
                tcsnumber: points.features[i].properties.tcsnumber,
                gear: points.features[i].properties.gear,
                length: points.features[i].properties.length,
                pdep: points.features[i].properties.pdep,
                depth: points.features[i].properties.depth,
                map_status: points.features[i].properties.map_status,
                co_name: points.features[i].properties.co_name,
                ownership: points.features[i].properties.ownership,
                Depth:  points.features[i].properties.depth,
                description: "<pre>" + JSON.stringify(points.features[i].properties,null,1) + "</pre>"
            }
            data.push(point);
          }

          this.setState({data, columns})
    }
    
    render() {
        if (this.state.points === undefined){
            return(
                <UploadCSV
                    onUploaded={(points)=>{
                        this.setState({points}, ()=>{
                            this.handleOnUploaded(points);
                        });
                    }}
                >
                </UploadCSV>
            )
        }
        else{
            const { selectedRowKeys } = this.state;
            const rowSelection = {
                selectedRowKeys,
                onChange: this.onSelectedRowKeysChange,
            };
            
            return (
                // <pre>{JSON.stringify(this.state.points,null,2)}</pre>
                <Table
                    columns={this.state.columns}
                    expandable={{
                        expandedRowRender: record => <p style={{ margin: 0 }}>{record.description}</p>,
                        rowExpandable: record => record.name !== 'Not Expandable',
                    }}
                    rowSelection={rowSelection}
                    onRow={(record) => ({
                        onClick: () => {
                          this.selectRow(record);
                        },
                    })}
                    dataSource={this.state.data}
  />
            );
        }
    }
}
export { uploadPoints };