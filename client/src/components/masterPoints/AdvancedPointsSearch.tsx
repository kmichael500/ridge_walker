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

    // topo_name search
    results = results.filter(point => {
        const topo_name = point.properties.topo_name.toLowerCase();
      const searchText = this.state.searchParams.topo_name.toLowerCase();
      return topo_name.includes(searchText);
    });

      // topo_indi search
      results = results.filter(point => {
        const topo_indi = point.properties.topo_indi.toLowerCase();
        const searchText = this.state.searchParams.topo_indi.toLowerCase();
        return topo_indi.includes(searchText);
    });

    // gear search
    results = results.filter(point => {
        const gear = point.properties.gear.toLowerCase();
        const searchText = this.state.searchParams.gear.toLowerCase();
        return gear.includes(searchText);
    });
    
    // ent_type search
    results = results.filter(point => {
        const ent_type = point.properties.ent_type.toLowerCase();
        const searchText = this.state.searchParams.ent_type.toLowerCase();
        return ent_type.includes(searchText);
    });

    // field_indi search
    results = results.filter(point => {
        const field_indi = point.properties.field_indi.toLowerCase();
        const searchText = this.state.searchParams.field_indi.toLowerCase();
        return field_indi.includes(searchText);
    });

    // map_status search
    results = results.filter(point => {
        const map_status = point.properties.map_status.toLowerCase();
        const searchText = this.state.searchParams.map_status.toLowerCase();
        return map_status.includes(searchText);
    });

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
            {/* Search by ownership */}
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
                <Col span={24}>Topo Indication</Col>
                <Col span={24}>
                  <Search
                    placeholder="Marked As Cave"
                    onChange={e => {
                      const searchParams = {...this.state.searchParams};
                      searchParams.topo_indi = e.target.value;
                      this.setState({searchParams}, () => {
                        this.handleSearch();
                      });
                    }}
                  ></Search>
                </Col>
              </Row>
            </Col>
            {/* Search by gear */}
            <Col {...colSpanProps}>
              <Row>
                <Col span={24}>Gear</Col>
                <Col span={24}>
                  <Search
                    placeholder="Normal Gear"
                    onChange={e => {
                      const searchParams = {...this.state.searchParams};
                      searchParams.gear = e.target.value;
                      this.setState({searchParams}, () => {
                        this.handleSearch();
                      });
                    }}
                  ></Search>
                </Col>
              </Row>
            </Col>
            {/* Search by ent_type */}
            <Col {...colSpanProps}>
              <Row>
                <Col span={24}>Enterance Type</Col>
                <Col span={24}>
                  <Search
                    placeholder="Stoop"
                    onChange={e => {
                      const searchParams = {...this.state.searchParams};
                      searchParams.ent_type = e.target.value;
                      this.setState({searchParams}, () => {
                        this.handleSearch();
                      });
                    }}
                  ></Search>
                </Col>
              </Row>
            </Col>
            {/* Search by field_indi */}
            <Col {...colSpanProps}>
              <Row>
                <Col span={24}>Field Indication</Col>
                <Col span={24}>
                  <Search
                    placeholder="Hillside"
                    onChange={e => {
                      const searchParams = {...this.state.searchParams};
                      searchParams.field_indi = e.target.value;
                      this.setState({searchParams}, () => {
                        this.handleSearch();
                      });
                    }}
                  ></Search>
                </Col>
              </Row>
            </Col>
            {/* Search by map_status */}
            <Col {...colSpanProps}>
              <Row>
                <Col span={24}>Map Status</Col>
                <Col span={24}>
                  <Search
                    placeholder="Mapped"
                    onChange={e => {
                      const searchParams = {...this.state.searchParams};
                      searchParams.map_status = e.target.value;
                      this.setState({searchParams}, () => {
                        this.handleSearch();
                      });
                    }}
                  ></Search>
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
