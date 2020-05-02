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
    searchedColumn
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
        }

        this.handleOnUploaded = this.handleOnUploaded.bind(this);
    }
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
              key: 'name',
              ...this.getColumnSearchProps('name'),
            },
            {
                title: 'ID',
                dataIndex: 'tcsnumber',
                key: 'tcsnumber',
                ...this.getColumnSearchProps('tcsnumber'),
              },
            {
                title: 'Gear',
                dataIndex: 'gear',
                key: 'gear',
                ...this.getColumnSearchProps('gear'),
            },
              
            {
              title: 'Length',
              dataIndex: 'length',
              key: 'length',
            //   width: '12%',
              sorter: {
                compare: (a, b) =>  b.length - a.length,
                // multiple: 3,
              }
            },
            {
                title: 'Pit Depth',
                dataIndex: 'pdep',
                key: 'length',
              //   width: '12%',
                sorter: {
                  compare: (a, b) => b.pdep - a.pdep,
                //   multiple: 4,
                }
              },
            {
                title: 'Map Status',
                dataIndex: 'map_status',
                //   width: '30%',
                key: 'map_status',
                ...this.getColumnSearchProps('map_status'),
            },
            {
              title: 'County',
              dataIndex: 'co_name',
            //   width: '30%',
              key: 'co_name',
              ...this.getColumnSearchProps('co_name'),
            },
          ];

          let data = [];
        //   console.log(points.features[0])
          for (let i = 0; i<points.features.length; i++){
            let point = {
                name: points.features[i].properties.name,
                tcsnumber: points.features[i].properties.tcsnumber,
                gear: points.features[i].properties.gear,
                length: points.features[i].properties.length,
                pdep: points.features[i].properties.pdep,
                map_status: points.features[i].properties.map_status,
                co_name: points.features[i].properties.co_name,
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
            
            return (
                // <pre>{JSON.stringify(this.state.points,null,2)}</pre>
                <Table
                    columns={this.state.columns}
                    expandable={{
                    expandedRowRender: record => <p style={{ margin: 0 }}>{record.description}</p>,
                    rowExpandable: record => record.name !== 'Not Expandable',
      
    }}
    dataSource={this.state.data}
  />
            );
        }
    }
}
export { uploadPoints };