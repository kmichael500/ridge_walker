import React, {Component} from 'react';
import {QuestionCircleOutlined, SlidersOutlined} from '@ant-design/icons';
import {GrSearchAdvanced} from 'react-icons/gr';

import {tn_counties} from '../../dataservice/countyList';
import {
  ownershipFields,
  topo_indiFields,
  gearFields,
  ent_typeFields,
  field_indiFields,
  map_statusFields,
} from '../../dataservice/pointDropDownFields';

import {
  Row,
  Col,
  Input,
  Select,
  Collapse,
  Tag,
  InputNumber,
  Tooltip,
  Button,
  Typography,
  Drawer,
  Space,
} from 'antd';

import {SearchOutlined} from '@ant-design/icons';
import {Gutter} from 'antd/lib/grid/row';
import {
  MasterPointPaginationReq,
  SearchParams,
} from '../../interfaces/MasterPointPagination';

const {Paragraph} = Typography;
const Search = Input;
const Option = Select;

interface State {
  loading: boolean;
  searchParams: SearchParams;
  sortParams: 'length' | 'depth' | 'pdep' | 'elev' | 'relevance';
  sortOrder: 'asc' | 'desc';
  narrRelevanceSearch: boolean;
  visible: boolean;
  advancedColor: string;
}
interface Props {
  onSearchFinished: (searchParams: MasterPointPaginationReq) => void;
  isLoading: (loading: boolean) => void;
  limit: number;
}

class AdvancedPointsSearch extends Component<Props, State> {
  constructor(Props) {
    super(Props);
    this.state = {
      loading: false,
      narrRelevanceSearch: false,
      advancedColor: '',
      searchParams: {
        name: '',
        tcsnumber: '',
        lengthL: null,
        lengthR: null,
        lengthCmp: '<=',
        pdepL: null,
        pdepR: null,
        pdepCmp: '<=',
        depthL: null,
        depthR: null,
        depthCmp: '<=',
        elevL: null,
        elevR: null,
        elevCmp: '<=',
        psL: null,
        psR: null,
        psCmp: '<=',
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
        narr: '',
      },
      sortParams: 'relevance',
      sortOrder: 'desc',
      visible: false,
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.changeAdvancedButtonColor = this.changeAdvancedButtonColor.bind(this);
  }

  handleSearch() {
    this.props.isLoading(true);
    this.setState({loading: true});

    const reqParams = {
      sortOrder: this.state.sortOrder,
      sortBy: this.state.sortParams,
      pagination: true,
      page: 1,
      limit: this.props.limit,
      searchParams: this.state.searchParams,
    } as MasterPointPaginationReq;
    this.props.onSearchFinished(reqParams);
    this.props.isLoading(false);
    this.setState({loading: false, visible: false});
  }
  changeAdvancedButtonColor(val: any) {
    const color = 'green';
    const defaultColor = '';
    if (Array.isArray(val)) {
      if (val.length <= 0) {
        this.setState({advancedColor: defaultColor});
      } else if (val.length > 0) {
        this.setState({advancedColor: color});
      }
    } else if (typeof val === 'string') {
      if (val.length <= 0) {
        this.setState({advancedColor: defaultColor});
      } else {
        this.setState({advancedColor: color});
      }
    } else if (val === null) {
      this.setState({advancedColor: defaultColor});
    } else {
      this.setState({advancedColor: color});
    }
  }

  render() {
    const colSpanProps = {
      xs: {span: 24},
      sm: {span: 24},
      md: {span: 12},
      lg: {span: 8},
      xl: {span: 6},
    };
    const rowProps = {
      gutter: [10, {xs: 8, sm: 16, md: 24, lg: 32}] as Gutter,
    };

    return (
      <div>
        <Row>
          <div style={{width: '60%'}}>
            <Input.Search
              // width="100%"

              size="large"
              onPressEnter={() => {
                this.handleSearch();
              }}
              onSearch={() => {
                this.handleSearch();
              }}
              enterButton
              placeholder="Search by name"
              value={this.state.searchParams.name}
              onChange={e => {
                const searchParams = {...this.state.searchParams};
                searchParams.name = e.target.value;
                this.setState({searchParams});
              }}
            ></Input.Search>
          </div>
          <div style={{marginLeft: 'auto'}}>
            <Button
              style={{color: this.state.advancedColor, height: '100%'}}
              onClick={() => {
                this.setState({visible: true});
              }}
            >
              Advanced Search
            </Button>
          </div>
        </Row>
        <Drawer
          title="Advanced Search"
          placement="right"
          closable={true}
          width={'90%'}
          onClose={() => {
            this.setState({visible: false});
          }}
          visible={this.state.visible}
        >
          <Row {...rowProps}>
            {/* Search by name */}
            <Col {...colSpanProps}>
              <Row>
                <Col span={24}>Name</Col>
                <Col span={24}>
                  <Search
                    onPressEnter={() => {
                      this.handleSearch();
                    }}
                    value={this.state.searchParams.name}
                    size="large"
                    placeholder="Indian Grave Point"
                    onChange={e => {
                      const searchParams = {...this.state.searchParams};
                      searchParams.name = e.target.value;
                      this.setState({searchParams});
                    }}
                  ></Search>
                </Col>
              </Row>
            </Col>
            {/* Search by narr */}
            <Col {...colSpanProps}>
              <Row>
                <Col span={24}>
                  <span>
                    Narrative&nbsp;
                    <Tooltip
                      title={
                        <div style={{width: '100%'}}>
                          Advanced narrative search options.
                          <table style={{textAlign: 'center'}}>
                            <tr>
                              <th>Description</th>
                              <th>Example</th>
                            </tr>
                            <tr
                              style={{border: 'solid 1px', textAlign: 'center'}}
                            >
                              <td>Use quotes for an exact match.</td>
                              <td>"flowstone"</td>
                            </tr>
                            <tr
                              style={{border: 'solid 1px', textAlign: 'center'}}
                            >
                              <td>To exclude certain words, use a dash.</td>
                              <td>-flowstone</td>
                            </tr>
                          </table>
                        </div>
                      }
                      style={{backgroundColor: 'white'}}
                    >
                      <QuestionCircleOutlined></QuestionCircleOutlined>
                    </Tooltip>
                  </span>
                </Col>
                <Col span={24}>
                  <Search
                    size="large"
                    onPressEnter={() => {
                      this.handleSearch();
                    }}
                    placeholder="flowstone"
                    onChange={e => {
                      const searchParams = {...this.state.searchParams};
                      searchParams.narr = e.target.value;
                      let narrRelevanceSearch = false;
                      if (e.target.value.match(/\S/)) {
                        narrRelevanceSearch = true;
                      }
                      this.changeAdvancedButtonColor(e.target.value);
                      this.setState({searchParams, narrRelevanceSearch});
                    }}
                  ></Search>
                </Col>
              </Row>
            </Col>
            {/* Search by ID */}
            <Col {...colSpanProps}>
              <Row>
                <Col span={24}>ID</Col>
                <Col span={24}>
                  <Search
                    size="large"
                    onPressEnter={() => {
                      this.handleSearch();
                    }}
                    placeholder="AN1"
                    onChange={e => {
                      const searchParams = {...this.state.searchParams};
                      searchParams.tcsnumber = e.target.value;
                      this.changeAdvancedButtonColor(e.target.value);
                      this.setState({searchParams});
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
                    size="large"
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
                      this.changeAdvancedButtonColor(counties);
                      this.setState({searchParams});
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
                Ownership
                <Col span={24}>
                  <Select
                    size="large"
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
                      this.changeAdvancedButtonColor(ownership);
                      this.setState({searchParams});
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
                    size="large"
                    onPressEnter={() => {
                      this.handleSearch();
                    }}
                    placeholder="Lake City"
                    onChange={e => {
                      const searchParams = {...this.state.searchParams};
                      searchParams.topo_name = e.target.value;
                      this.changeAdvancedButtonColor(e.target.value);
                      this.setState({searchParams});
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
                    size="large"
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
                      this.changeAdvancedButtonColor(topo_indi);
                      this.setState({searchParams});
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
                    size="large"
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
                      this.changeAdvancedButtonColor(gear);
                      this.setState({searchParams});
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
                Entrance Type
                <Col span={24}>
                  <Select
                    size="large"
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
                      this.changeAdvancedButtonColor(ent_type);
                      this.setState({searchParams});
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
                    size="large"
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
                      this.changeAdvancedButtonColor(field_indi);
                      this.setState({searchParams});
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
                    size="large"
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
                      this.changeAdvancedButtonColor(map_status);
                      this.setState({searchParams});
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
                    size="large"
                    onPressEnter={() => {
                      this.handleSearch();
                    }}
                    placeholder="Copper Ridge Dolomite"
                    onChange={e => {
                      const searchParams = {...this.state.searchParams};
                      searchParams.geology = e.target.value;
                      this.changeAdvancedButtonColor(e.target.value);
                      this.setState({searchParams});
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
                    size="large"
                    onPressEnter={() => {
                      this.handleSearch();
                    }}
                    placeholder="Cambrian"
                    onChange={e => {
                      const searchParams = {...this.state.searchParams};
                      searchParams.geo_age = e.target.value;
                      this.changeAdvancedButtonColor(e.target.value);
                      this.setState({searchParams});
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
                    size="large"
                    onPressEnter={() => {
                      this.handleSearch();
                    }}
                    placeholder="Valley and Ridge"
                    onChange={e => {
                      const searchParams = {...this.state.searchParams};
                      searchParams.phys_prov = e.target.value;
                      this.changeAdvancedButtonColor(e.target.value);
                      this.setState({searchParams});
                    }}
                  ></Search>
                </Col>
              </Row>
            </Col>
            {/* Search by Length */}
            <Col {...colSpanProps}>
              <Row gutter={5}>
                <Col span={24}>Length</Col>
                <Col span={7}>
                  <InputNumber
                    size="large"
                    onPressEnter={() => {
                      this.handleSearch();
                    }}
                    placeholder="100"
                    style={{width: '100%'}}
                    onChange={val => {
                      const searchParams = {...this.state.searchParams};
                      searchParams.lengthL = val;
                      this.changeAdvancedButtonColor(val);
                      this.setState({searchParams});
                    }}
                  ></InputNumber>
                </Col>
                <Col span={10}>
                  <Select
                    size="large"
                    style={{width: '100%', textAlign: 'center'}}
                    defaultValue={this.state.searchParams.lengthCmp}
                    onChange={val => {
                      const searchParams = {...this.state.searchParams};
                      searchParams.lengthCmp = val;
                      this.setState({searchParams});
                    }}
                  >
                    <Option style={{textAlign: 'center'}} value="<=">
                      <Tooltip title="Length is greater than or equal to x and less or equal to y.">
                        <div>{'x <= L <= y'}</div>
                      </Tooltip>
                    </Option>
                    <Option style={{textAlign: 'center'}} value="<">
                      <Tooltip title="Length is greater than x and less than y.">
                        <div>{'x < L < y'}</div>
                      </Tooltip>
                    </Option>
                  </Select>
                </Col>

                <Col span={7}>
                  <InputNumber
                    size="large"
                    onPressEnter={() => {
                      this.handleSearch();
                    }}
                    placeholder="500"
                    style={{width: '100%'}}
                    onChange={val => {
                      const searchParams = {...this.state.searchParams};
                      searchParams.lengthR = val;
                      this.changeAdvancedButtonColor(val);
                      this.setState({searchParams});
                    }}
                  ></InputNumber>
                </Col>
              </Row>
            </Col>
            {/* Search by Depth/Vertical Extent */}
            <Col {...colSpanProps}>
              <Row gutter={5}>
                <Col span={24}>Vertical Extent</Col>
                <Col span={7}>
                  <InputNumber
                    size="large"
                    onPressEnter={() => {
                      this.handleSearch();
                    }}
                    placeholder="100"
                    style={{width: '100%'}}
                    onChange={val => {
                      const searchParams = {...this.state.searchParams};
                      searchParams.depthL = val;
                      this.changeAdvancedButtonColor(val);
                      this.setState({searchParams});
                    }}
                  ></InputNumber>
                </Col>
                <Col span={10}>
                  <Select
                    size="large"
                    style={{width: '100%', textAlign: 'center'}}
                    defaultValue={this.state.searchParams.depthCmp}
                    onChange={val => {
                      const searchParams = {...this.state.searchParams};
                      searchParams.depthCmp = val;
                      this.setState({searchParams});
                    }}
                  >
                    <Option style={{textAlign: 'center'}} value="<=">
                      <Tooltip title="Vertical extent is greater than or equal to x and less or equal to y.">
                        <div>{'x <= VE <= y'}</div>
                      </Tooltip>
                    </Option>
                    <Option style={{textAlign: 'center'}} value="<">
                      <Tooltip title="Vertical extent is greater than x and less than y.">
                        <div>{'x < VE < y'}</div>
                      </Tooltip>
                    </Option>
                  </Select>
                </Col>

                <Col span={7}>
                  <InputNumber
                    size="large"
                    onPressEnter={() => {
                      this.handleSearch();
                    }}
                    placeholder="500"
                    style={{width: '100%'}}
                    onChange={val => {
                      const searchParams = {...this.state.searchParams};
                      searchParams.depthR = val;
                      this.changeAdvancedButtonColor(val);
                      this.setState({searchParams});
                    }}
                  ></InputNumber>
                </Col>
              </Row>
            </Col>
            {/* Search by pdep */}
            <Col {...colSpanProps}>
              <Row gutter={5}>
                <Col span={24}>Pit Depth</Col>
                <Col span={7}>
                  <InputNumber
                    size="large"
                    onPressEnter={() => {
                      this.handleSearch();
                    }}
                    placeholder="100"
                    style={{width: '100%'}}
                    onChange={val => {
                      const searchParams = {...this.state.searchParams};
                      searchParams.pdepL = val;
                      this.changeAdvancedButtonColor(val);
                      this.setState({searchParams});
                    }}
                  ></InputNumber>
                </Col>
                <Col span={10}>
                  <Select
                    size="large"
                    style={{width: '100%', textAlign: 'center'}}
                    defaultValue={this.state.searchParams.pdepCmp}
                    onChange={val => {
                      const searchParams = {...this.state.searchParams};
                      searchParams.pdepCmp = val;
                      this.setState({searchParams});
                    }}
                  >
                    <Option style={{textAlign: 'center'}} value="<=">
                      <Tooltip title="Pit depth is greater than or equal to x and less or equal to y.">
                        <div>{'x <= PD <= y'}</div>
                      </Tooltip>
                    </Option>
                    <Option style={{textAlign: 'center'}} value="<">
                      <Tooltip title="Pit depth is greater than x and less than y.">
                        <div>{'x < PD < y'}</div>
                      </Tooltip>
                    </Option>
                  </Select>
                </Col>

                <Col span={7}>
                  <InputNumber
                    size="large"
                    onPressEnter={() => {
                      this.handleSearch();
                    }}
                    placeholder="500"
                    style={{width: '100%'}}
                    onChange={val => {
                      const searchParams = {...this.state.searchParams};
                      searchParams.pdepR = val;
                      this.changeAdvancedButtonColor(val);
                      this.setState({searchParams});
                    }}
                  ></InputNumber>
                </Col>
              </Row>
            </Col>
            {/* Search by elev */}
            <Col {...colSpanProps}>
              <Row gutter={5}>
                <Col span={24}>Elevation</Col>
                <Col span={7}>
                  <InputNumber
                    size="large"
                    onPressEnter={() => {
                      this.handleSearch();
                    }}
                    placeholder="100"
                    style={{width: '100%'}}
                    onChange={val => {
                      const searchParams = {...this.state.searchParams};
                      searchParams.elevL = val;
                      this.changeAdvancedButtonColor(val);
                      this.setState({searchParams});
                    }}
                  ></InputNumber>
                </Col>
                <Col span={10}>
                  <Select
                    size="large"
                    style={{width: '100%', textAlign: 'center'}}
                    defaultValue={this.state.searchParams.elevCmp}
                    onChange={val => {
                      const searchParams = {...this.state.searchParams};
                      searchParams.elevCmp = val;
                      this.setState({searchParams});
                    }}
                  >
                    <Option style={{textAlign: 'center'}} value="<=">
                      <Tooltip title="Elevation is greater than or equal to x and less or equal to y.">
                        <div>{'x <= E <= y'}</div>
                      </Tooltip>
                    </Option>
                    <Option style={{textAlign: 'center'}} value="<">
                      <Tooltip title="Elevation is greater than x and less than y.">
                        <div>{'x < E < y'}</div>
                      </Tooltip>
                    </Option>
                  </Select>
                </Col>

                <Col span={7}>
                  <InputNumber
                    size="large"
                    onPressEnter={() => {
                      this.handleSearch();
                    }}
                    placeholder="500"
                    style={{width: '100%'}}
                    onChange={val => {
                      const searchParams = {...this.state.searchParams};
                      searchParams.elevR = val;
                      this.changeAdvancedButtonColor(val);
                      this.setState({searchParams});
                    }}
                  ></InputNumber>
                </Col>
              </Row>
            </Col>
            {/* Search by ps */}
            <Col {...colSpanProps}>
              <Row gutter={5}>
                <Col span={24}>Number of Pits</Col>
                <Col span={7}>
                  <InputNumber
                    size="large"
                    onPressEnter={() => {
                      this.handleSearch();
                    }}
                    placeholder="100"
                    style={{width: '100%'}}
                    onChange={val => {
                      const searchParams = {...this.state.searchParams};
                      searchParams.psL = val;
                      this.changeAdvancedButtonColor(val);
                      this.setState({searchParams});
                    }}
                  ></InputNumber>
                </Col>
                <Col span={10}>
                  <Select
                    size="large"
                    style={{width: '100%', textAlign: 'center'}}
                    defaultValue={this.state.searchParams.psCmp}
                    onChange={val => {
                      const searchParams = {...this.state.searchParams};
                      searchParams.psCmp = val;
                      this.setState({searchParams});
                    }}
                  >
                    <Option style={{textAlign: 'center'}} value="<=">
                      <Tooltip title="Number of pits is greater than or equal to x and less or equal to y.">
                        <div>{'x <= NP <= y'}</div>
                      </Tooltip>
                    </Option>
                    <Option style={{textAlign: 'center'}} value="<">
                      <Tooltip title="Number of pits is greater than x and less than y.">
                        <div>{'x < NP < y'}</div>
                      </Tooltip>
                    </Option>
                  </Select>
                </Col>

                <Col span={7}>
                  <InputNumber
                    size="large"
                    onPressEnter={() => {
                      this.handleSearch();
                    }}
                    placeholder="500"
                    style={{width: '100%'}}
                    onChange={val => {
                      const searchParams = {...this.state.searchParams};
                      searchParams.psR = val;
                      this.changeAdvancedButtonColor(val);
                      this.setState({searchParams});
                    }}
                  ></InputNumber>
                </Col>
              </Row>
            </Col>
            {/* Sort */}
            <Col span={24}>
              <Row gutter={5}>
                <Col span={24}>Sort</Col>
                <Col span={12}>
                  <Select
                    size="large"
                    placeholder="Sort by"
                    defaultValue={this.state.sortParams}
                    style={{width: '100%'}}
                    onChange={sortBy => {
                      this.setState({sortParams: sortBy});
                    }}
                    tokenSeparators={[',']}
                  >
                    <Option key={'relevance'} value={'relevance'}>
                      Relevance
                    </Option>
                    <Option key={'length'} value={'length'}>
                      Length
                    </Option>
                    <Option key={'pdep'} value={'pdep'}>
                      Pit Depth
                    </Option>
                    <Option key={'depth'} value={'depth'}>
                      Vertical Extent
                    </Option>
                    <Option key={'elev'} value={'elev'}>
                      Elevation
                    </Option>
                    <Option key={'ps'} value={'ps'}>
                      Number of Pits
                    </Option>
                  </Select>
                </Col>
                {(this.state.sortParams !== 'relevance' ||
                  !this.state.narrRelevanceSearch) && (
                  <Col span={12}>
                    <Select
                      size="large"
                      // placeholder="Sort by"
                      defaultValue={this.state.sortOrder}
                      style={{width: '100%'}}
                      onChange={sortBy => {
                        this.setState({sortOrder: sortBy});
                      }}
                      tokenSeparators={[',']}
                    >
                      <Option key={'desc'} value={'desc'}>
                        Descending
                      </Option>
                      <Option key={'asc'} value={'asc'}>
                        Ascending
                      </Option>
                    </Select>
                  </Col>
                )}
              </Row>
            </Col>
            <Col span={24}>
              <Row gutter={5}>
                <Col span={24}>
                  <Button
                    size="large"
                    type="primary"
                    icon={<SearchOutlined />}
                    loading={this.state.loading}
                    onClick={() => {
                      this.handleSearch();
                    }}
                  >
                    Search
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Drawer>
      </div>
    );
  }
}
export {AdvancedPointsSearch};
