import React, {Component, useState, Fragment} from 'react';
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
  Divider,
} from 'antd';
const {Title} = Typography;
const Search = Input;
const Option = Select;

interface State {
  userList: UserInterface[];
  searchData: UserInterface[];
  loading: boolean;
  searchParams: {
    name: string;
    email: string;
    status: ('Approved' | 'Pending' | 'Rejected' | any)[];
  };
}
interface Props {
  userList: UserInterface[];
  onSearch: (results: UserInterface[]) => void;
}

class AdvancedUserSearch extends Component<Props, State> {
  constructor(Props) {
    super(Props);
    this.state = {
      userList: this.props.userList,
      searchData: [],
      loading: true,
      searchParams: {
        name: '',
        status: ['Approved', 'Pending'],
        email:"",
      },
    };
    this.handleSearch = this.handleSearch.bind(this);
  }

  handleSearch() {
    // name search
    let results = [...this.props.userList];
    results = results.filter(user => {
      const name = (user.firstName + ' ' + user.lastName).toLowerCase();
      const searchText = this.state.searchParams.name.toLowerCase();
      return name.includes(searchText);
    });

    // email search
    results = results.filter(user => {
        const searchText = this.state.searchParams.email.toLowerCase();
        return user.email.includes(searchText);
      });

      // status serach
    // checks for multiple statues
    results = results.filter(user => {
      return (
        // checks if user has any of the selected statues
        this.state.searchParams.status
          .map(status => {
            return user.status === status;
          })
          .reduce((a, b) => a || b, false) // combines true vals in array
      );
    });
    this.props.onSearch(results);
  }

  render() {
      const colSpanProps = {xs:{span:24}, sm:{span:24}, md:{span:12}, lg:{span:12}};
    return (
      <Card bordered={true} style={{background: 'fbfdfe'}}>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col span={24}>
            <Title level={4}>Search</Title>
          </Col>
          <Col
            {...colSpanProps}
          >
            <Row>
              <Col span={24}>Name</Col>
              <Col span={24}>
                <Search
                  placeholder="Search by name"
                  onChange={e => {
                    const searchParams = {...this.state.searchParams};
                    searchParams.name = e.target.value;
                    this.setState({searchParams}, () => {
                      this.handleSearch();
                    });
                  }}
                ></Search>
              </Col>
            </Row>
          </Col>
          <Col
            {...colSpanProps}
          >
            <Row>
              <Col span={24}>Email</Col>
              <Col span={24}>
                <Search
                  placeholder="Search by email"
                  onChange={e => {
                    const searchParams = {...this.state.searchParams};
                    searchParams.email = e.target.value;
                    this.setState({searchParams}, () => {
                      this.handleSearch();
                    });
                  }}
                ></Search>
              </Col>
            </Row>
          </Col>

          <Col {...colSpanProps}>
            <Row>
              Status
              <Col span={24}>
                <Select
                  mode="multiple"
                  placeholder="Select Status"
                  defaultValue={this.state.searchParams.status}
                  style={{width: '100%'}}
                  onChange={(statuses: string[]) => {
                    const searchParams = {...this.state.searchParams};
                    searchParams.status = statuses;
                    this.setState({searchParams}, () => {
                      this.handleSearch();
                    });
                  }}
                  tokenSeparators={[',']}
                >
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
          </Col>
        </Row>
      </Card>
    );
  }
}
export {AdvancedUserSearch};
