import React, {Component} from 'react';
import {Feature} from '../interfaces/geoJsonInterface';
import {tn_counties} from '../dataservice/countyList';
import {Helmet} from 'react-helmet';
import {FormInstance} from 'antd/lib/form';

import {
  Form,
  Input,
  Button,
  Select,
  Cascader,
  InputNumber,
  Card,
  Space,
  Row,
  message,
} from 'antd';
import {Store} from 'antd/lib/form/interface';
import {SubmittedPoint} from '../interfaces/submittedPointInterface';
import {addSubmittedPoint} from '../dataservice/submittedPoints';
import {userContext} from '../context/userContext';

interface State {
  autocompleteDisabled: boolean;
  point: Feature;
}

class AddCave extends Component<any, State> {
  formRef = React.createRef<FormInstance>();
  constructor(Props) {
    super(Props);
    this.state = {
      autocompleteDisabled: false,
      point: {
        type: 'Feature',
        properties: {
          tcsnumber: '',
          name: '',
          length: -1,
          depth: -1,
          pdep: -1,
          ps: -1,
          co_name: '',
          topo_name: '',
          topo_indi: '',
          elev: 0,
          ownership: '',
          gear: '',
          ent_type: '',
          field_indi: '',
          map_status: '',
          geology: '',
          geo_age: '',
          phys_prov: '',
          narr: '',
        },
        geometry: {
          type: 'Point',
          coordinates: [0.0, 0.0],
        },
      } as Feature,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.doesCaveQualify = this.doesCaveQualify.bind(this);
  }

  renderCoordinateForm() {
    return (
      <Input.Group compact>
        <Form.Item
          name="lat"
          label="Latitude"
          rules={[
            {
              required: true,
              message: 'Lat required!',
              whitespace: true,
            },
            ({getFieldValue}) => {
              const regex = /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/g;
              return {
                validator(rule, value) {
                  if (value.match(regex)) {
                    return Promise.resolve();
                  } else {
                    return Promise.reject('Wrong format!');
                  }
                },
              };
            },
          ]}
        >
          <Input></Input>
        </Form.Item>
        <Form.Item
          name="long"
          label="Longitude"
          rules={[
            {
              required: true,
              message: 'Long required!',
              whitespace: true,
            },
            ({getFieldValue}) => {
              const regex = /^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/g;
              return {
                validator(rule, value) {
                  if (value.match(regex)) {
                    return Promise.resolve();
                  } else {
                    return Promise.reject('Wrong format!');
                  }
                },
              };
            },
          ]}
        >
          <Input></Input>
        </Form.Item>
      </Input.Group>
    );
  }

  handleSubmit(values: Store) {
    const newSubmmision = {
      submitted_by: this.context.user._id,
      status: 'Pending',
      pointType: 'New',
      point: {
        type: 'Feature',
        properties: {
          tcsnumber: values.tcsnumber,
          name: values.name,
          length: values.length,
          depth: values.depth,
          pdep: values.pdepth,
          ps: values.ps,
          co_name: values.co_name,
          topo_name: values.topo_name,
          topo_indi: values.topo_indi,
          elev: values.elev,
          ownership: values.ownership.join(' '),
          gear: values.gear,
          ent_type: values.ent_description[values.ent_description.length - 1],
          field_indi: values.field_indi,
          map_status: values.map_status,
          geology: values.geology,
          geo_age: values.geo_age,
          phys_prov: values.phys_prov,
          narr: values.narr,
        },
        geometry: {
          type: 'Point',
          coordinates: [values.long, values.lat],
        },
      },
    } as SubmittedPoint;

    addSubmittedPoint(newSubmmision).then(() => {
      message.success(values.name + ' submitted successfully.');
      this.props.history.push('/dashboard');
    });
  }

  doesCaveQualify() {
    console.log('QUALIFY');
  }

  render() {
    const narrPlaceholderArr = [];
    narrPlaceholderArr.push(
      '1. Photocopy portion of topographic map and mark cave location on it.'
    );
    narrPlaceholderArr.push(
      '2. Specific directions to cave including prominent field and topographic landmarks. Include Distances, compass angles, and sketch map.'
    );
    narrPlaceholderArr.push(
      '3. Complete narrative description of the cave including interesting scientific and historical information. Describe how the entrance appears in the field, dimmentions of entrance.'
    );

    let narrPlaceholder = '';
    for (let i = 0; i < narrPlaceholderArr.length; i++) {
      narrPlaceholder += narrPlaceholderArr[i];
      if (i < narrPlaceholderArr.length - 1) {
        narrPlaceholder += '\n';
      }
    }
    return (
      <div className="site-layout-content">
        <Helmet>
          <title>Add Cave</title>
        </Helmet>
        <Card title="Add a New Cave">
          <Form
            // labelCol={{ span: 8 }}
            // wrapperCol={{ span: 14 }}
            layout="vertical"
            onFinish={this.handleSubmit}
            scrollToFirstError={true}
            // onFinishFailed={(errorInfo)=>{
            //   for (let i = 0; i<errorInfo.errorFields.length; i++){
            //     message.error(errorInfo.errorFields[i].errors)
            //   }
            // }}
            initialValues={{remember: true}}
            ref={this.formRef}
          >
            <Form.Item
              label="Cave Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: 'Cave name required!',
                  whitespace: true,
                  type: 'string',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Row>
              <Space>
                <Form.Item
                  label="Length (ft)"
                  name="length"
                  rules={[
                    {
                      required: true,
                      message: 'Length required!',
                      whitespace: true,
                      type: 'number',
                    },
                    ({getFieldValue}) => {
                      return {
                        validator(rule, value) {
                          if (
                            value < 50 &&
                            getFieldValue('pdepth') < 30 &&
                            getFieldValue('depth') < 40
                          ) {
                            return Promise.reject('The cave does not qualify!');
                          } else {
                            return Promise.resolve();
                          }
                        },
                      };
                    },
                  ]}
                >
                  <InputNumber
                    defaultValue={0}
                    min={0}
                    // forces check if cave qualifies
                    onBlur={() => {
                      this.formRef.current.validateFields([
                        'pdepth',
                        'length',
                        'depth',
                      ]);
                    }}
                  ></InputNumber>
                </Form.Item>
                <Form.Item
                  label="Vertical Extent (ft)"
                  name="depth"
                  rules={[
                    {
                      required: true,
                      message: 'Vertical Extent required!',
                      whitespace: true,
                      type: 'number',
                    },
                    ({getFieldValue}) => {
                      return {
                        validator(rule, value) {
                          if (
                            value < 40 &&
                            getFieldValue('length') < 50 &&
                            getFieldValue('pdepth') < 30
                          ) {
                            return Promise.reject('The cave does not qualify!');
                          } else {
                            return Promise.resolve();
                          }
                        },
                      };
                    },
                  ]}
                >
                  <InputNumber
                    defaultValue={0}
                    min={0}
                    // forces check if cave qualifies
                    onBlur={() => {
                      this.formRef.current.validateFields([
                        'pdepth',
                        'length',
                        'depth',
                      ]);
                    }}
                  ></InputNumber>
                </Form.Item>
                <Form.Item
                  label="Pit Depth (ft)"
                  name="pdepth"
                  rules={[
                    {
                      required: true,
                      message: 'Pit depth required!',
                      whitespace: true,
                      type: 'number',
                    },
                    ({getFieldValue}) => {
                      return {
                        validator(rule, value) {
                          if (
                            value < 30 &&
                            getFieldValue('length') < 50 &&
                            getFieldValue('depth') < 40
                          ) {
                            return Promise.reject('The cave does not qualify!');
                          } else {
                            return Promise.resolve();
                          }
                        },
                      };
                    },
                  ]}
                  validateTrigger="onChange"
                >
                  <InputNumber
                    defaultValue={0}
                    min={0}
                    // forces check if cave qualifies
                    onBlur={() => {
                      this.formRef.current.validateFields([
                        'pdepth',
                        'length',
                        'depth',
                      ]);
                    }}
                  ></InputNumber>
                </Form.Item>
                <Form.Item
                  label="Number of Pits"
                  name="ps"
                  rules={[
                    {
                      required: true,
                      message: 'Number of pits required!',
                      whitespace: true,
                      type: 'number',
                    },
                  ]}
                >
                  <InputNumber defaultValue={0} min={0}></InputNumber>
                </Form.Item>
                <Form.Item
                  label="Elevation (ft)"
                  name="elev"
                  rules={[
                    {
                      required: true,
                      message: 'Elevation required!',
                      whitespace: true,
                      type: 'number',
                    },
                  ]}
                >
                  <InputNumber defaultValue={0} min={0}></InputNumber>
                </Form.Item>
              </Space>
            </Row>
            <Row>
              <Space>
                <Form.Item
                  label="County"
                  name="co_name"
                  style={{minWidth: '110px'}}
                  rules={[
                    {
                      required: true,
                      message: 'County required!',
                      whitespace: true,
                    },
                  ]}
                >
                  <Select
                    showSearch
                    onFocus={() => {
                      document
                        .querySelectorAll('.ant-select-selector input')
                        .forEach(e => {
                          e.setAttribute(
                            'autocomplete',
                            'stopDamnAutocomplete'
                          );
                          //you can put any value but NOT "off" or "false" because they DO NOT work
                        });
                    }}
                    autoFocus={false}
                    placeholder="Select"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {tn_counties.map(county => (
                      <Select.Option value={county}>{county}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Entrance Number"
                  name="ent_num"
                  rules={[
                    {
                      required: true,
                      message: 'Entrance number required!',
                      whitespace: true,
                    },
                  ]}
                >
                  <Input defaultValue={1} min={1} />
                </Form.Item>
                <Form.Item
                  label="Number of Entrances"
                  name="num_of_ent"
                  rules={[
                    {
                      required: true,
                      message: 'Number of entrances required!',
                      whitespace: true,
                      type: 'number',
                    },
                  ]}
                >
                  <Input defaultValue={1} min={1} />
                </Form.Item>
                <Form.Item
                  label="TCS#"
                  name="tcsnumber"
                  rules={[
                    {
                      required: true,
                      message: 'Entrance number required!',
                      whitespace: true,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Space>
            </Row>
            {this.renderCoordinateForm()}
            <Row>
              <Space>
                <Form.Item
                  label="Ownership"
                  name="ownership"
                  rules={[
                    {
                      required: true,
                      message: 'Ownership number required!',
                      whitespace: true,
                    },
                  ]}
                >
                  <Cascader
                    options={[
                      {
                        value: 'Government',
                        label: 'Government',
                        children: [
                          {
                            value: 'Owned',
                            label: 'Owned',
                          },
                          {
                            value: 'Leased',
                            label: 'Leased',
                          },
                          {
                            value: 'Park',
                            label: 'Park',
                          },
                        ],
                      },
                      {
                        value: 'NSS',
                        label: 'NSS',
                        children: [
                          {
                            value: 'Owned Or Leased',
                            label: 'Owned or Leased',
                          },
                        ],
                      },
                      {
                        value: 'Private Property',
                        label: 'Private Property',
                      },
                      {
                        value: 'Commercial Cave',
                        label: 'Commercial',
                      },
                      {
                        value: 'Locked/Gated',
                        label: 'Locked/Gated',
                      },
                      {
                        value: 'Entry Forbidden',
                        label: 'Entry Forbidden',
                      },
                      {
                        value: 'Destroyed or Blocked',
                        label: 'Destroyed or Blocked',
                      },
                    ]}
                  />
                </Form.Item>
                <Form.Item
                  label="Gear Needed"
                  name="gear"
                  rules={[
                    {
                      required: true,
                      message: 'Gear required!',
                      whitespace: true,
                    },
                  ]}
                >
                  <Select placeholder="Please select">
                    <Select.Option value="Normal Gear">
                      Normal Gear
                    </Select.Option>
                    <Select.Option value="Handline">Handline</Select.Option>
                    <Select.Option value="Wading">Wading</Select.Option>
                    <Select.Option value="Boat/Swimming">
                      Boat/Swimming
                    </Select.Option>
                    <Select.Option value="Rappel/Prusik">
                      Rappel/Prusik
                    </Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Entrance Description"
                  name="ent_description"
                  rules={[
                    {
                      required: true,
                      message: 'Entrance description required!',
                      whitespace: true,
                    },
                  ]}
                >
                  <Cascader
                    options={[
                      {
                        value: 'horizontal',
                        label: 'Horizontal',
                        children: [
                          {
                            value: 'Extremely Big',
                            label: 'Extremely Big',
                          },
                          {
                            value: 'Walk In',
                            label: 'Walk In',
                          },
                          {
                            value: 'Large, walk-in',
                            label: 'Large, walk-in',
                          },
                          {
                            value: 'Extremely Big',
                            label: 'Extremely Big',
                          },
                          {
                            value: 'Stoop',
                            label: 'Stoop',
                          },
                          {
                            value: 'Crawl',
                            label: 'Crawl',
                          },
                          {
                            value: 'Artificial Shaft',
                            label: 'Artificial Shaft',
                          },
                          {
                            value: 'Artificial Tunnel',
                            label: 'Artificial Tunnel',
                          },
                        ],
                      },
                      {
                        value: 'Vertical',
                        label: 'Vertical',
                        children: [
                          {
                            value: 'Pit Bells Out',
                            label: 'Pit Bells Out',
                          },
                          {
                            value: 'Pit',
                            label: 'Pit',
                          },
                          {
                            value: 'Very Wide Pit',
                            label: 'Very Wide Pit',
                          },
                          {
                            value: 'Chimney/Climb',
                            label: 'Chinmey/Climb',
                          },
                          {
                            value: 'Artificial',
                            label: 'Artificial',
                          },
                        ],
                      },
                    ]}
                  />
                </Form.Item>
                <Form.Item
                  label="Field Indication"
                  name="field_indi"
                  rules={[
                    {
                      required: true,
                      message: 'Field indication required!',
                      whitespace: true,
                    },
                  ]}
                >
                  <Select placeholder="Please select">
                    <Select.Option value="Hillside">Hillside</Select.Option>
                    <Select.Option value="Sink">Sink</Select.Option>
                    <Select.Option value="Spring">Spring</Select.Option>
                    <Select.Option value="Inflowing Stream">
                      Inflowing Stream
                    </Select.Option>
                    <Select.Option value="Bluff or Outcrop">
                      Bluff or Outcrop
                    </Select.Option>
                    <Select.Option value="Roadcut">Roadcut</Select.Option>
                    <Select.Option value="Level Ground">
                      Level Ground
                    </Select.Option>
                    <Select.Option value="Quarry">Quarry</Select.Option>
                    <Select.Option value="Underwater">Underwater</Select.Option>
                    <Select.Option value="Wet-Weather Streambed">
                      Wet-Weather Streambed
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Space>
            </Row>
            <Row>
              <Space>
                <Form.Item
                  label="Topo Indication"
                  name="topo_indi"
                  rules={[
                    {
                      required: true,
                      message: 'Topo indication required!',
                      whitespace: true,
                    },
                  ]}
                >
                  <Select placeholder="Please select">
                    <Select.Option value="None">None</Select.Option>
                    <Select.Option value="Sink">Sink</Select.Option>
                    <Select.Option value="Contour Distortion">
                      Contour Distortion
                    </Select.Option>
                    <Select.Option value="Inflowing Stream">
                      Inflowing Stream
                    </Select.Option>
                    <Select.Option value="Spring">Spring</Select.Option>
                    <Select.Option value="Quarry">Quarry</Select.Option>
                    <Select.Option value="Marked as Cave">
                      Marked as Cave
                    </Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Topo Name"
                  name="topo_name"
                  rules={[
                    {
                      required: true,
                      message: 'Topo name required!',
                      whitespace: true,
                    },
                  ]}
                >
                  <Input></Input>
                </Form.Item>
                <Form.Item
                  label="Geologic Formation"
                  name="geology"
                  rules={[
                    {
                      required: true,
                      message: 'Geologic formation required!',
                      whitespace: true,
                    },
                  ]}
                >
                  <Input></Input>
                </Form.Item>
                <Form.Item
                  label="Geology Age"
                  name="geo_age"
                  rules={[
                    {
                      required: true,
                      message: 'Geology age required!',
                      whitespace: true,
                    },
                  ]}
                >
                  <Input></Input>
                </Form.Item>
                <Form.Item
                  label="Physiographic Province"
                  name="phys_prov"
                  rules={[
                    {
                      required: true,
                      message: 'Physiographic province required!',
                      whitespace: true,
                    },
                  ]}
                >
                  <Input></Input>
                </Form.Item>
              </Space>
            </Row>
            <Form.Item
              label="Map Status"
              name="map_status"
              rules={[
                {
                  required: true,
                  message: 'Map status required!',
                  whitespace: true,
                },
              ]}
            >
              <Select placeholder="Please select">
                <Select.Option value="Mapped">Mapped</Select.Option>
                <Select.Option value="Unmapped">Unmapped</Select.Option>
                <Select.Option value="Sketch">Sketch</Select.Option>
                <Select.Option value={'Pace & Compass'}>
                  {'Pace & Compass'}
                </Select.Option>
                <Select.Option value={'Tape & Compass'}>
                  {'Tape & Compass'}
                </Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Narrative"
              name="narr"
              rules={[
                {
                  required: true,
                  message: 'Narrative required!',
                  whitespace: true,
                },
              ]}
            >
              <Input.TextArea
                style={{height: '300px'}}
                placeholder={narrPlaceholder}
              ></Input.TextArea>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    );
  }
}

AddCave.contextType = userContext;
export {AddCave};
