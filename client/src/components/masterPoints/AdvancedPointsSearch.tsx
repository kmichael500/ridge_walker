import React, {Component, useState, Fragment} from 'react';
import {Feature} from '../../interfaces/geoJsonInterface';

import {Row, Col, Input, Select, Collapse} from 'antd';
const {Panel} = Collapse;
const Search = Input;
const Option = Select;

interface State {
  loading: boolean;
  searchParams: {
    name: string;
    tcsnumber: string
    length: number;
    pdep: number;
    depth: number;
    elev: number;
    ps: number;
    co_name: string;
    ownership: string;
    topo_name: string;
    topo_indi: string;
    gear: string;
    ent_type: string;
    field_indi: string;
    map_status: string;
    geology: string;
    geo_age: string;
    phys_prov: string;
  };
}
interface Props {
  pointList: Feature[];
  onSearch: (results: Feature[]) => void;
}

class AdvancedPointsSearch extends Component<Props, State> {
  constructor(Props) {
    super(Props);
    this.state = {
      loading: true,
      searchParams: {
        name: "",
        tcsnumber: "",
        length: null, //todo
        pdep: null, //todo
        depth: null, //tdo
        elev: null, //todo
        ps: null, //todo
        co_name: "",
        ownership: "",
        topo_name: "",
        topo_indi: "",
        gear: "",
        ent_type: "",
        field_indi: "",
        map_status: "",
        geology: "",
        geo_age: "",
        phys_prov: "",
      }
    };
    this.handleSearch = this.handleSearch.bind(this);
  }

  handleSearch() {
    // name search
    let results = [...this.props.pointList];
    results = results.filter(point => {
      const name = (point.properties.name.toLowerCase());
      const searchText = this.state.searchParams.name.toLowerCase();
      return name.includes(searchText);
    });

    // tcsnumber serach
    results = results.filter(point => {
      const tcsnumber = point.properties.tcsnumber.toLowerCase();
      const searchText = this.state.searchParams.tcsnumber.toLowerCase();
      return tcsnumber.includes(searchText);
    });

    // county_name search
    results = results.filter(point => {
      const co_name = point.properties.co_name.toLowerCase();
      const searchText = this.state.searchParams.co_name.toLowerCase();
      return co_name.includes(searchText);
    });

    // ownership search
    results = results.filter(point => {
        const ownership = point.properties.ownership.toLowerCase();
      const searchText = this.state.searchParams.ownership.toLowerCase();
      return ownership.includes(searchText);
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
                    placeholder="Indian Grave Point"
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
                <Col span={24}>ID</Col>
                <Col span={24}>
                  <Search
                    placeholder="AN1"
                    onChange={e => {
                      const searchParams = {...this.state.searchParams};
                      searchParams.tcsnumber = e.target.value;
                      this.setState({searchParams}, () => {
                        this.handleSearch();
                      });
                    }}
                  ></Search>
                </Col>
              </Row>
            </Col>
            {/* Search by co_name */}
            <Col {...colSpanProps}>
              <Row>
                <Col span={24}>County</Col>
                <Col span={24}>
                  <Search
                    placeholder="Rutherford"
                    onChange={e => {
                      const searchParams = {...this.state.searchParams};
                      searchParams.co_name = e.target.value;
                      this.setState({searchParams}, () => {
                        this.handleSearch();
                      });
                    }}
                  ></Search>
                </Col>
              </Row>
            </Col>
            {/* Search by nss number */}
            <Col {...colSpanProps}>
              <Row>
                <Col span={24}>Ownership</Col>
                <Col span={24}>
                  <Search
                    placeholder="Goverment"
                    onChange={e => {
                      const searchParams = {...this.state.searchParams};
                      searchParams.ownership = e.target.value;
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
export {AdvancedPointsSearch};
