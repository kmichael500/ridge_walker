import React, {Component, useState, Fragment} from 'react';
import {UserInterface} from '../../interfaces/UserInterface';
import {UserStatusTag} from './ListUsers';

import {
  Row,
  Col,
  Typography,
  Input,
  Select,
  Divider,
  Collapse,
} from 'antd';
const {Panel} = Collapse;
const Search = Input;
const Option = Select;

interface State {
  loading: boolean;
  searchParams: {
    name: string;
    email: string;
    phoneNumber: string;
    status: ('Approved' | 'Pending' | 'Rejected' | any)[];
    street: string;
    city: string;
    state: string;
    zipCode: string;
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
      loading: true,
      searchParams: {
        name: '',
        status: ['Approved', 'Pending'],
        email: '',
        phoneNumber: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
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

    // phone number search
    results = results.filter(user => {
      const phoneNumber = user.phoneNumber.toString();
      const searchText = this.state.searchParams.phoneNumber
        .toLowerCase()
        .replace(/[^0-9]/g, '');
      return phoneNumber.includes(searchText);
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

    // street search
    results = results.filter(user => {
      const searchText = this.state.searchParams.street.toLowerCase();
      return user.address.includes(searchText);
    });

    // City search
    results = results.filter(user => {
      const searchText = this.state.searchParams.city.toLowerCase();
      return user.city.toLowerCase().includes(searchText);
    });

    // State search
    results = results.filter(user => {
      const searchText = this.state.searchParams.state.toLowerCase();
      return user.state.toLowerCase().includes(searchText);
    });

    // Zip Code search
    results = results.filter(user => {
      const searchText = this.state.searchParams.zipCode.toLowerCase();
      return user.zipCode.toString().includes(searchText);
    });

    this.props.onSearch(results);
  }

  render() {
    const colSpanProps = {
      xs: {span: 24},
      sm: {span: 24},
      md: {span: 12},
      lg: {span: 8},
      xl: {span: 6},
    };
    return (
      <Collapse defaultActiveKey={[1]}>
        <Panel header="Advanced Search" key={1}>
          <Row gutter={[10, {xs: 8, sm: 16, md: 24, lg: 32}]}>
            {/* Search by name */}
            <Col {...colSpanProps}>
              <Row>
                <Col span={24}>Name</Col>
                <Col span={24}>
                  <Search
                    placeholder="Jane Doe"
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
            {/* Search by email */}
            <Col {...colSpanProps}>
              <Row>
                <Col span={24}>Email</Col>
                <Col span={24}>
                  <Search
                    placeholder="johndoe@example.com"
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
            {/* Search by phone number */}
            <Col {...colSpanProps}>
              <Row>
                <Col span={24}>Phone Number</Col>
                <Col span={24}>
                  <Search
                    placeholder="(123) 456-789"
                    onChange={e => {
                      const searchParams = {...this.state.searchParams};
                      searchParams.phoneNumber = e.target.value;
                      this.setState({searchParams}, () => {
                        this.handleSearch();
                      });
                    }}
                  ></Search>
                </Col>
              </Row>
            </Col>
            {/* Search by status */}
            <Col {...colSpanProps}>
              <Row>
                Status
                <Col span={24}>
                  <Select
                    mode="multiple"
                    placeholder="Select Status"
                    tagRender={props => {
                      return (
                        <UserStatusTag
                          status={props.label.toString()}
                        ></UserStatusTag>
                      );
                    }}
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
            <Divider></Divider>
            <Col span={24}>
              <h4>Address</h4>
            </Col>
            {/* Search by Street */}
            <Col {...colSpanProps}>
              <Row>
                <Col span={24}>Street</Col>
                <Col span={24}>
                  <Search
                    placeholder="123 Example Dr"
                    onChange={e => {
                      const searchParams = {...this.state.searchParams};
                      searchParams.street = e.target.value;
                      this.setState({searchParams}, () => {
                        this.handleSearch();
                      });
                    }}
                  ></Search>
                </Col>
              </Row>
            </Col>
            {/* Search by City */}
            <Col {...colSpanProps}>
              <Row>
                <Col span={24}>City</Col>
                <Col span={24}>
                  <Search
                    placeholder="Nashville"
                    onChange={e => {
                      const searchParams = {...this.state.searchParams};
                      searchParams.city = e.target.value;
                      this.setState({searchParams}, () => {
                        this.handleSearch();
                      });
                    }}
                  ></Search>
                </Col>
              </Row>
            </Col>
            {/* Search by State */}
            <Col {...colSpanProps}>
              <Row>
                <Col span={24}>State</Col>
                <Col span={24}>
                  <Search
                    placeholder="TN"
                    onChange={e => {
                      const searchParams = {...this.state.searchParams};
                      searchParams.state = e.target.value;
                      this.setState({searchParams}, () => {
                        this.handleSearch();
                      });
                    }}
                  ></Search>
                </Col>
              </Row>
            </Col>
            {/* Search by Zip */}
            <Col {...colSpanProps}>
              <Row>
                <Col span={24}>Zip Code</Col>
                <Col span={24}>
                  <Search
                    placeholder="12345"
                    onChange={e => {
                      const searchParams = {...this.state.searchParams};
                      searchParams.zipCode = e.target.value;
                      this.setState({searchParams}, () => {
                        this.handleSearch();
                      });
                    }}
                  ></Search>
                </Col>
              </Row>
            </Col>
          </Row>
        </Panel>
      </Collapse>
    );
  }
}
export {AdvancedUserSearch};
