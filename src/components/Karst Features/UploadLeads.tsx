import React, {Component} from 'react';
import {addLeadPoints} from '../../dataservice/leadPoints';
import {
  CheckedStatusType,
  LeadType,
  LeadPointInterface,
  LeadPoints,
} from '../../interfaces/LeadPointInterface';
import ContainerDimensions from 'react-container-dimensions';
import {UploadCSV} from '../upload';
import {KarstFeaturesTable} from './KarstFeaturesTable';
import {userContext, UserContextInterface} from '../../context/userContext';

import {
  Input,
  Button,
  Typography,
  Divider,
  Space,
  Row,
  message,
  Col,
  Tag,
  Alert,
} from 'antd';

const {Paragraph} = Typography;
interface State {
  data: any;
  columns: any;
  searchText;
  searchedColumn;
  selectedRowKeys: any;
  latField: string;
  longField: string;
  descField: string;
}
class UploadLeads extends Component<any, State> {
  searchInput: any;
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      columns: null,
      searchText: '',
      searchedColumn: '',
      selectedRowKeys: [],
      latField: 'latitude',
      longField: 'longitude',
      descField: 'description',
    };

    this.handleOnUploaded = this.handleOnUploaded.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {}

  handleOnUploaded(points: LeadPoints) {
    const columns = [];
    for (const key in points.features[0].properties) {
      if (key !== this.state.descField) {
        // don't add columns that are entirely blank
        for (let i = 0; i < points.features.length; i++) {
          if (points.features[i].properties[key] === '') {
          } else if (points.features[i].properties[key] !== undefined) {
            columns.push({
              title: key,
              dataIndex: key,
            });
            break;
          }
        }
      }
    }
    columns.push({
      title: 'latitude',
      dataIndex: 'latitude',
    });
    columns.push({
      title: 'longitude',
      dataIndex: 'longitude',
    });
    columns.push({
      title: 'Status',
      dataIndex: 'status',
      render: (val, record) => {
        return <Tag color="volcano">{val}</Tag>;
      },
    });
    columns.push({
      title: 'Description',
      fixed: 'right',
      dataIndex: 'description',
      width: 'auto',
      editable: true,
    });
    const data = points.features.map((feature, index) => {
      let description = 'No description provided!';
      if (points.features[index].properties[this.state.descField] === '') {
      } else if (
        points.features[index].properties[this.state.descField] !== undefined
      ) {
        description = points.features[index].properties['desc'];
      }

      return {
        key: index,
        longitude: points.features[index].geometry.coordinates[0],
        latitude: points.features[index].geometry.coordinates[1],
        status: CheckedStatusType.NOTCAVE,
        lead_type: LeadType.KARSTFEATURE,
        description,
        ...feature.properties,
      };
    });
    this.setState({data: data, columns});
  }

  renderTable() {
    return (
      <div>
        <Space direction="vertical">
          <Alert message="Please ensure the data is correct. Click on a description to edit it." />
          <Alert
            type="warning"
            message="The only columns that will be saved are latitude, longitude, and the description."
          />
        </Space>
        <Divider></Divider>
        <div style={{background: ''}}>
          <KarstFeaturesTable
            columns={this.state.columns}
            dataSource={this.state.data}
            onChange={data => {
              this.setState({data});
            }}
          />
        </div>
        <Button type="primary" onClick={this.handleSubmit}>
          Submit
        </Button>
      </div>
    );
  }

  handleSubmit() {
    const user = this.context as UserContextInterface;

    const newSubmission = this.state.data.map(data => {
      return {
        point: {
          type: 'Feature',
          properties: {
            submitted_by: user.user._id,
            lead_type: data.lead_type,
            checked_status: data.status,
            description: data.description,
          },
          geometry: {
            type: 'Point',
            coordinates: [data.longitude, data.latitude],
          },
        },
      } as LeadPointInterface;
    }) as LeadPointInterface[];
    addLeadPoints(newSubmission)
      .then(res => {
        message.success(res.data);
      })
      .catch(err => {
        message.error('Error!');
      })
      .then(() => {
        this.setState({
          data: null,
          columns: null,
          searchText: '',
          searchedColumn: '',
          selectedRowKeys: [],
          latField: 'latitude',
          longField: 'longitude',
          descField: 'description',
        });
      });
  }

  render() {
    return (
      <div className="site-layout-content" style={{width: '100%'}}>
        <Row justify="center" style={{background: ''}}>
          <Col span={24}>
            {this.state.data === null ? (
              <div>
                <Row justify="start">
                  <Col span={24}>
                    <Paragraph style={{textAlign: 'left'}}>
                      Upload karst features that you have confirmed are not a
                      cave so no one has to check the same place twice!
                    </Paragraph>
                  </Col>
                  <Space direction="horizontal" align="start">
                    <div>
                      <Paragraph>
                        Please specify the names of the latitude and longitude
                        columns.
                      </Paragraph>
                      <Row
                        gutter={[8, {xs: 24, sm: 24, md: 12, lg: 12, xl: 12}]}
                      >
                        <Col>
                          <Input
                            placeholder="Latitude column"
                            // defaultValue={this.state.latField}
                            onChange={e => {
                              this.setState({latField: e.target.value});
                            }}
                          />
                        </Col>
                        <Col span={12}>
                          <Input
                            placeholder="Longitude column"
                            // defaultValue={this.state.longField}
                            onChange={e => {
                              this.setState({longField: e.target.value});
                            }}
                          />
                        </Col>
                      </Row>
                    </div>
                  </Space>
                </Row>
                <Space direction="vertical">
                  <Paragraph>
                    Please specify the names of the description column.
                  </Paragraph>
                  <Input
                    placeholder="Description column"
                    // defaultValue={this.state.descField}
                    onChange={e => {
                      this.setState({descField: e.target.value});
                    }}
                  />
                </Space>
                <Divider></Divider>
                <div>
                  <UploadCSV
                    onUploaded={points => {
                      this.handleOnUploaded(points);
                    }}
                    uploadPath="api/points/leads/upload"
                    lat={this.state.latField}
                    long={this.state.longField}
                  />
                </div>
              </div>
            ) : (
              <ContainerDimensions>
                {({width, height}) => (
                  <div style={{maxWidth: width}}>{this.renderTable()}</div>
                )}
              </ContainerDimensions>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

UploadLeads.contextType = userContext;
export {UploadLeads};
