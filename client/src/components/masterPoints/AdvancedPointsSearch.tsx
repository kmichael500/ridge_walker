import React, {Component, useState, Fragment} from 'react';
import {Feature} from '../../interfaces/geoJsonInterface';

import {tn_counties} from '../../dataservice/countyList';
import {
  ownershipFields,
  topo_indiFields,
  gearFields,
  ent_typeFields,
  field_indiFields,
  map_statusFields,
} from '../../dataservice/pointDropDownFields';

import {Row, Col, Input, Select, Collapse, Tag} from 'antd';
const {Panel} = Collapse;
const Search = Input;
const Option = Select;

interface State {
  loading: boolean;
  searchParams: {
    name: string;
    tcsnumber: string;
    length: number;
    pdep: number;
    depth: number;
    elev: number;
    ps: number;
    co_name: string[];
    ownership: string[];
    topo_name: string;
    topo_indi: string[];
    gear: string[];
    ent_type: string[];
    field_indi: string[];
    map_status: string[];
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
        name: '',
        tcsnumber: '',
        length: null, //todo
        pdep: null, //todo
        depth: null, //tdo
        elev: null, //todo
        ps: null, //todo
        co_name: [],
        ownership: [],
        topo_name: '',
        topo_indi: [],
        gear: [],
        ent_type: [],
        field_indi: [],
        map_status: [],
        geology: '',
        geo_age: '',
        phys_prov: '',
      },
    };
    this.handleSearch = this.handleSearch.bind(this);
  }

  handleSearch() {
    // name search
    let results = [...this.props.pointList];
    results = results.filter(point => {
      const name = point.properties.name.toLowerCase();
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
    // checks for multiple counties
    if (this.state.searchParams.co_name.length !== 0) {
      results = results.filter(point => {
        return this.state.searchParams.co_name
          .map(county => {
            return (
              point.properties.co_name.toLowerCase() === county.toLowerCase()
            );
          })
          .reduce((a, b) => a || b, false); // combines true vals in array
      });
    }

    // ownership search
    // checks for multiple ownership
    if (this.state.searchParams.ownership.length !== 0) {
      results = results.filter(point => {
        return this.state.searchParams.ownership
          .map(ownership => {
            return (
              point.properties.ownership.toLowerCase() ===
              ownership.toLowerCase()
            );
          })
          .reduce((a, b) => a || b, false); // combines true vals in array
      });
    }

    // topo_name search
    results = results.filter(point => {
      const topo_name = point.properties.topo_name.toLowerCase();
      const searchText = this.state.searchParams.topo_name.toLowerCase();
      return topo_name.includes(searchText);
    });

    // topo_indi search
    // checks for multiple topo_indi
    if (this.state.searchParams.topo_indi.length !== 0) {
      results = results.filter(point => {
        return this.state.searchParams.topo_indi
          .map(topo_indi => {
            return (
              point.properties.topo_indi.toLowerCase() ===
              topo_indi.toLowerCase()
            );
          })
          .reduce((a, b) => a || b, false); // combines true vals in array
      });
    }

    // gear search
    // checks for multiple gear
    if (this.state.searchParams.gear.length !== 0) {
      results = results.filter(point => {
        return this.state.searchParams.gear
          .map(gear => {
            return point.properties.gear.toLowerCase() === gear.toLowerCase();
          })
          .reduce((a, b) => a || b, false); // combines true vals in array
      });
    }

    // ent_type search
    // checks for multiple ent_type
    if (this.state.searchParams.ent_type.length !== 0) {
      results = results.filter(point => {
        return this.state.searchParams.ent_type
          .map(ent_type => {
            return (
              point.properties.ent_type.toLowerCase() === ent_type.toLowerCase()
            );
          })
          .reduce((a, b) => a || b, false); // combines true vals in array
      });
    }

    // field_indi search
    // checks for multiple field_indi
    if (this.state.searchParams.field_indi.length !== 0) {
      results = results.filter(point => {
        return this.state.searchParams.field_indi
          .map(field_indi => {
            return (
              point.properties.field_indi.toLowerCase() ===
              field_indi.toLowerCase()
            );
          })
          .reduce((a, b) => a || b, false); // combines true vals in array
      });
    }

    // map_status search
    // checks for multiple map_status
    if (this.state.searchParams.map_status.length !== 0) {
      results = results.filter(point => {
        return this.state.searchParams.map_status
          .map(map_status => {
            return (
              point.properties.map_status.toLowerCase() ===
              map_status.toLowerCase()
            );
          })
          .reduce((a, b) => a || b, false); // combines true vals in array
      });
    }

    // geology search
    results = results.filter(point => {
      const geology = point.properties.geology.toLowerCase();
      const searchText = this.state.searchParams.geology.toLowerCase();
      return geology.includes(searchText);
    });

    // geo_age search
    results = results.filter(point => {
      const geo_age = point.properties.geo_age.toLowerCase();
      const searchText = this.state.searchParams.geo_age.toLowerCase();
      return geo_age.includes(searchText);
    });

    // phys_prov search
    results = results.filter(point => {
      const phys_prov = point.properties.phys_prov.toLowerCase();
      const searchText = this.state.searchParams.phys_prov.toLowerCase();
      return phys_prov.includes(searchText);
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
                County
                <Col span={24}>
                  <Select
                    mode="multiple"
                    placeholder="Select"
                    tagRender={props => {
                      return <Tag>{props.label.toString()}</Tag>;
                    }}
                    defaultValue={this.state.searchParams.co_name}
                    style={{width: '100%'}}
                    onChange={(counties: string[]) => {
                      const searchParams = {...this.state.searchParams};
                      searchParams.co_name = counties;
                      this.setState({searchParams}, () => {
                        this.handleSearch();
                      });
                    }}
                    tokenSeparators={[',']}
                  >
                    {tn_counties.map(county => {
                      return (
                        <Option key={county} value={county}>
                          {county}
                        </Option>
                      );
                    })}
                  </Select>
                </Col>
              </Row>
            </Col>
            {/* Search by ownership */}
            <Col {...colSpanProps}>
              <Row>
                County
                <Col span={24}>
                  <Select
                    mode="multiple"
                    placeholder="Select"
                    tagRender={props => {
                      return <Tag>{props.label.toString()}</Tag>;
                    }}
                    defaultValue={this.state.searchParams.ownership}
                    style={{width: '100%'}}
                    onChange={(ownership: string[]) => {
                      const searchParams = {...this.state.searchParams};
                      searchParams.ownership = ownership;
                      this.setState({searchParams}, () => {
                        this.handleSearch();
                      });
                    }}
                    tokenSeparators={[',']}
                  >
                    {ownershipFields.map(ownership => {
                      return (
                        <Option key={ownership} value={ownership}>
                          {ownership}
                        </Option>
                      );
                    })}
                  </Select>
                </Col>
              </Row>
            </Col>
            {/* Search by topo_name */}
            <Col {...colSpanProps}>
              <Row>
                <Col span={24}>Topo</Col>
                <Col span={24}>
                  <Search
                    placeholder="Lake City"
                    onChange={e => {
                      const searchParams = {...this.state.searchParams};
                      searchParams.topo_name = e.target.value;
                      this.setState({searchParams}, () => {
                        this.handleSearch();
                      });
                    }}
                  ></Search>
                </Col>
              </Row>
            </Col>
            {/* Search by topo_indi */}
            <Col {...colSpanProps}>
              <Row>
                Topo Indication
                <Col span={24}>
                  <Select
                    mode="multiple"
                    placeholder="Select"
                    tagRender={props => {
                      return <Tag>{props.label.toString()}</Tag>;
                    }}
                    defaultValue={this.state.searchParams.ownership}
                    style={{width: '100%'}}
                    onChange={(topo_indi: string[]) => {
                      const searchParams = {...this.state.searchParams};
                      searchParams.topo_indi = topo_indi;
                      this.setState({searchParams}, () => {
                        this.handleSearch();
                      });
                    }}
                    tokenSeparators={[',']}
                  >
                    {topo_indiFields.map(topo_indi => {
                      return (
                        <Option key={topo_indi} value={topo_indi}>
                          {topo_indi}
                        </Option>
                      );
                    })}
                  </Select>
                </Col>
              </Row>
            </Col>
            {/* Search by gear */}
            <Col {...colSpanProps}>
              <Row>
                Gear
                <Col span={24}>
                  <Select
                    mode="multiple"
                    placeholder="Select"
                    tagRender={props => {
                      return <Tag>{props.label.toString()}</Tag>;
                    }}
                    defaultValue={this.state.searchParams.gear}
                    style={{width: '100%'}}
                    onChange={(gear: string[]) => {
                      const searchParams = {...this.state.searchParams};
                      searchParams.gear = gear;
                      this.setState({searchParams}, () => {
                        this.handleSearch();
                      });
                    }}
                    tokenSeparators={[',']}
                  >
                    {gearFields.map(gear => {
                      return (
                        <Option key={gear} value={gear}>
                          {gear}
                        </Option>
                      );
                    })}
                  </Select>
                </Col>
              </Row>
            </Col>
            {/* Search by ent_type */}
            <Col {...colSpanProps}>
              <Row>
                Enterance Type
                <Col span={24}>
                  <Select
                    mode="multiple"
                    placeholder="Select"
                    tagRender={props => {
                      return <Tag>{props.label.toString()}</Tag>;
                    }}
                    defaultValue={this.state.searchParams.ent_type}
                    style={{width: '100%'}}
                    onChange={(ent_type: string[]) => {
                      const searchParams = {...this.state.searchParams};
                      searchParams.ent_type = ent_type;
                      this.setState({searchParams}, () => {
                        this.handleSearch();
                      });
                    }}
                    tokenSeparators={[',']}
                  >
                    {ent_typeFields.map(ent_type => {
                      return (
                        <Option key={ent_type} value={ent_type}>
                          {ent_type}
                        </Option>
                      );
                    })}
                  </Select>
                </Col>
              </Row>
            </Col>
            {/* Search by field_indi */}
            <Col {...colSpanProps}>
              <Row>
                Field Indication
                <Col span={24}>
                  <Select
                    mode="multiple"
                    placeholder="Select"
                    tagRender={props => {
                      return <Tag>{props.label.toString()}</Tag>;
                    }}
                    defaultValue={this.state.searchParams.field_indi}
                    style={{width: '100%'}}
                    onChange={(field_indi: string[]) => {
                      const searchParams = {...this.state.searchParams};
                      searchParams.field_indi = field_indi;
                      this.setState({searchParams}, () => {
                        this.handleSearch();
                      });
                    }}
                    tokenSeparators={[',']}
                  >
                    {field_indiFields.map(field_indi => {
                      return (
                        <Option key={field_indi} value={field_indi}>
                          {field_indi}
                        </Option>
                      );
                    })}
                  </Select>
                </Col>
              </Row>
            </Col>
            {/* Search by map_status */}
            <Col {...colSpanProps}>
              <Row>
                Map Status
                <Col span={24}>
                  <Select
                    mode="multiple"
                    placeholder="Select"
                    tagRender={props => {
                      return <Tag>{props.label.toString()}</Tag>;
                    }}
                    defaultValue={this.state.searchParams.map_status}
                    style={{width: '100%'}}
                    onChange={(map_status: string[]) => {
                      const searchParams = {...this.state.searchParams};
                      searchParams.map_status = map_status;
                      this.setState({searchParams}, () => {
                        this.handleSearch();
                      });
                    }}
                    tokenSeparators={[',']}
                  >
                    {map_statusFields.map(map_status => {
                      return (
                        <Option key={map_status} value={map_status}>
                          {map_status}
                        </Option>
                      );
                    })}
                  </Select>
                </Col>
              </Row>
            </Col>
            {/* Search by geology */}
            <Col {...colSpanProps}>
              <Row>
                <Col span={24}>Geology</Col>
                <Col span={24}>
                  <Search
                    placeholder="Copper Ridge Dolomite"
                    onChange={e => {
                      const searchParams = {...this.state.searchParams};
                      searchParams.geology = e.target.value;
                      this.setState({searchParams}, () => {
                        this.handleSearch();
                      });
                    }}
                  ></Search>
                </Col>
              </Row>
            </Col>
            {/* Search by geo_age */}
            <Col {...colSpanProps}>
              <Row>
                <Col span={24}>Geology Age</Col>
                <Col span={24}>
                  <Search
                    placeholder="Cambrian"
                    onChange={e => {
                      const searchParams = {...this.state.searchParams};
                      searchParams.geo_age = e.target.value;
                      this.setState({searchParams}, () => {
                        this.handleSearch();
                      });
                    }}
                  ></Search>
                </Col>
              </Row>
            </Col>
            {/* Search by Physiographic Province */}
            <Col {...colSpanProps}>
              <Row>
                <Col span={24}>Physiographic Province</Col>
                <Col span={24}>
                  <Search
                    placeholder="Valley and Ridge"
                    onChange={e => {
                      const searchParams = {...this.state.searchParams};
                      searchParams.phys_prov = e.target.value;
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
