import React, {Component, useState} from 'react';
import {UserInterface} from '../../interfaces/UserInterface';
import {getAllUsers} from '../../dataservice/authentication';
import {
    List,
    Card,
    Row,
    Col,
    Typography,
    Space,
    Tag,
    Tooltip,
    Button,
    Popconfirm,
    Input,
    Select,
  } from 'antd';
const Search = Input; 
const Option = Select; 

interface State {
    userList: UserInterface[];
    searchData: UserInterface[];
    loading: boolean;
    searchParams: {
        name: string,
        status: "Approved" | "Pending" | "Rejected"[],
    };
}
interface Props {
    userList: UserInterface[];
}

class AdvancedUserSearch extends Component<Props, State> {
    constructor(Props) {
      super(Props);
      this.state = {
        userList: [],
        searchData: [],
        loading: true,
        searchParams: {
            name: "",
            status: []
        }
      };
      this.handleSearch = this.handleSearch.bind(this);
    }

    handleSearch(){

    }

    render() {
      return (
          <Row>
              <Col span={12}>
                  <Search
                      placeholder="Search by name"
                      onChange={(e)=>{
                          let results = [...this.state.userList]
                          results = results.filter((user)=>{
                              const name = (user.firstName + " " + user.lastName).toLowerCase();
                              const searchText = e.target.value.toLowerCase();
                              return (name.includes(searchText));
                          })
                          this.setState({searchData: results});
                      }}
                  >
                  </Search>
              </Col>
              <Col span={12}>
                  <Select
                      mode="multiple"
                      placeholder="Select Status"
                      style={{ width: '35%' }}
                      defaultValue={["Pending", "Approved", "Rejected"]}
                      onChange={(statuses: string[])=>{
                          let results = [...this.state.userList];
                          
                          // checks for multiple statues
                          results = results.filter((user)=>{
                              return (
                                  // checks if user has any of the selected statues
                                  statuses
                                  .map((status)=>{
                                      return (user.status === status)
                                  })
                                  .reduce((a, b)=>(a || b), false) // combines true vals in array
                                  )
                          })
                          this.setState({searchData: results});
                      }}
                      tokenSeparators={[',']}>
                      <Option key="Approved" value="Approved">
                          Approved
                      </Option>
                      <Option key="Pending" value="Pending">
                          Pending
                      </Option>
                      <Option key="Rejected" value="Rejected">
                          Rejected
                      </Option>
                  </Select>
              </Col>
          </Row>
      );
    }
  }
  export {AdvancedUserSearch};