import React, {Component} from 'react';
import {Helmet} from 'react-helmet';
import {FaDirections} from 'react-icons/fa';
import {
  Card,
  Descriptions,
  Space,
  Col,
  Row,
  Typography,
  Divider,
  message,
  Button,
  Input,
  Popconfirm,
  Tooltip,
} from 'antd';
import {EyeOutlined} from '@ant-design/icons';
import {getMasterPoint} from '../dataservice/getPoints';
import {getParcelByCoordinates} from '../dataservice/parcelData';
import {
  addSubmittedPoint,
  getSubmittedPoint,
  updateOneSubmittedPointByID,
} from '../dataservice/submittedPoints';
import {SubmittedPoint} from '../interfaces/submittedPointInterface';
import deepEqual from 'deep-equal';

import {MapView} from '../components/MapView';
import DisplayAllMaps from '../components/DisplayAllMaps';
import {Feature} from '../interfaces/geoJsonInterface';
import {userContext} from '../context/userContext';
import {withRouter, Link} from 'react-router-dom';
import {Breakpoint} from 'antd/lib/_util/responsiveObserve';
import {ParcelResponseInterface} from '../interfaces/parcelResponseInterface';

const {Paragraph, Title, Text} = Typography;
const {TextArea} = Input;

interface State {
  point: Feature;
  pointCopy: Feature;
  isLoading: boolean;
  proposedChanges: boolean;
  newNarrative: string;
  role: string;
  submittedPoint?: SubmittedPoint;
  loadingButtons: any;
  parcelData: ParcelResponseInterface;
}

interface Props {
  match?: {
    params: {
      id: string;
    };
  };
  id: string;
  showMap?: boolean;
  renderTitle?: boolean;
  submittedPoint?: string;
  action?: string;
  descriptionColProps?: Partial<Record<Breakpoint, number>>;
}

const {Meta} = Card;

class CaveInfo extends Component<Props, State> {
  static defaultProps = {
    showMap: true,
    renderTitle: true,
    action: 'View',
    descriptionColProps: {
      xxl: 5,
      xl: 4,
      lg: 3,
      md: 2,
      sm: 1,
      xs: 1,
    },
  } as Props;

  constructor(Props) {
    super(Props);
    this.state = {
      isLoading: true,
      proposedChanges: false,
      newNarrative: '',
      pointCopy: undefined,
      role: this.props.action,
      loadingButtons: {approveloading: false, rejectloading: false},
      parcelData: {} as ParcelResponseInterface,
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
        submittedPoint: undefined,
      } as Feature,
    };

    this.renderDescription = this.renderDescription.bind(this);
    this.renderTitle = this.renderTitle.bind(this);
    this.proposeChangesBar = this.proposeChangesBar.bind(this);
    this.renderParcelData = this.renderParcelData.bind(this);
  }

  componentDidMount() {
    if (this.props.submittedPoint === undefined) {
      let tcsnumber = '';
      if (this.props.match === undefined) {
        tcsnumber = this.props.id;
      } else if (this.props.match.params.id === undefined) {
        tcsnumber = this.props.id;
      } else {
        tcsnumber = this.props.match.params.id;
      }
      getMasterPoint(tcsnumber).then(requestedPoint => {
        const pointCopy = JSON.parse(JSON.stringify(requestedPoint));
        this.setState({point: requestedPoint, pointCopy, isLoading: false});
        getParcelByCoordinates(requestedPoint.geometry).then(parcelData => {
          this.setState({parcelData});
        });
      });
    } else {
      getSubmittedPoint(this.props.submittedPoint).then(requestedPoint => {
        const newNarrative = requestedPoint.point.properties.narr;
        const pointCopy = JSON.parse(JSON.stringify(requestedPoint.point));
        this.setState({
          point: requestedPoint.point,
          pointCopy,
          isLoading: false,
          newNarrative,
          submittedPoint: requestedPoint,
        });
      });
    }
  }

  renderDescription() {
    let narrative;
    if (this.props.action === 'View') {
      narrative = this.state.point.properties.narr
        .split('\n')
        .map((item, i) => {
          return (
            <Paragraph style={{color: 'black', textAlign: 'left'}} key={i}>
              {item}
            </Paragraph>
          );
        });
    } else if (this.props.action === 'Review') {
      narrative = this.state.newNarrative.split('\n').map((item, i) => {
        return (
          <Paragraph style={{color: 'black', textAlign: 'justify'}} key={i}>
            {item}
          </Paragraph>
        );
      });
    }
    return (
      <div>
        <Descriptions bordered column={this.props.descriptionColProps}>
          <Descriptions.Item
            label={
              <Space>
                Coordinates
                <a
                  href={
                    'https://www.google.com/maps/dir/?api=1&destination=' +
                    this.state.point.geometry.coordinates[1] +
                    ',' +
                    this.state.point.geometry.coordinates[0] +
                    '&travelmode=car'
                  }
                  target="_blank"
                >
                  <Tooltip title="Directions">
                    <FaDirections size="15" />
                  </Tooltip>
                </a>
              </Space>
            }
          >
            <Text
              editable={
                this.state.proposedChanges && {
                  onChange: val => {
                    if (!isNaN(Number(val))) {
                      const point = this.state.point;
                      point.geometry.coordinates[1] = Number(val);
                      this.setState({point});
                    } else {
                      message.warn('Latitude must be a number');
                    }
                  },
                }
              }
            >
              {this.state.point.geometry.coordinates[1] + ''}
            </Text>
            {','}
            <Text
              editable={
                this.state.proposedChanges && {
                  onChange: val => {
                    if (!isNaN(Number(val))) {
                      const point = this.state.point;
                      point.geometry.coordinates[0] = Number(val);
                      this.setState({point});
                    } else {
                      message.warn('Longitude must be a number');
                    }
                  },
                }
              }
            >
              {this.state.point.geometry.coordinates[0] + ''}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="Length">
            <Text
              editable={
                this.state.proposedChanges && {
                  onChange: val => {
                    if (!isNaN(Number(val))) {
                      const point = this.state.point;
                      point.properties.length = Number(val);
                      this.setState({point});
                    } else {
                      message.warn('Length must be a number');
                    }
                  },
                }
              }
            >
              {this.state.point.properties.length + ''}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="Pit Depth">
            <Text
              editable={
                this.state.proposedChanges && {
                  onChange: val => {
                    if (!isNaN(Number(val))) {
                      const point = this.state.point;
                      point.properties.pdep = Number(val);
                      this.setState({point});
                    } else {
                      message.warn('Pit depth must be a number');
                    }
                  },
                }
              }
            >
              {this.state.point.properties.pdep + ''}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="Vertical Extent">
            <Text
              editable={
                this.state.proposedChanges && {
                  onChange: val => {
                    if (!isNaN(Number(val))) {
                      const point = this.state.point;
                      point.properties.depth = Number(val);
                      this.setState({point});
                    } else {
                      message.warn('Vertical extent must be a number.');
                    }
                  },
                }
              }
            >
              {this.state.point.properties.depth + ''}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="Elevation">
            <Text
              editable={
                this.state.proposedChanges && {
                  onChange: val => {
                    if (!isNaN(Number(val))) {
                      const point = this.state.point;
                      point.properties.elev = Number(val);
                      this.setState({point});
                    } else {
                      message.warn('Elevation must be a number.');
                    }
                  },
                }
              }
            >
              {this.state.point.properties.elev + ''}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="Number of Pits">
            <Text
              editable={
                this.state.proposedChanges && {
                  onChange: val => {
                    if (!isNaN(Number(val))) {
                      const point = this.state.point;
                      point.properties.ps = Number(val);
                      this.setState({point});
                    } else {
                      message.warn('PS must be a number.');
                    }
                  },
                }
              }
            >
              {this.state.point.properties.ps + ''}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="County">
            <Text
              editable={
                this.state.proposedChanges && {
                  onChange: val => {
                    if (val.length !== 0) {
                      const point = this.state.point;
                      point.properties.co_name = val;
                      this.setState({point});
                    } else {
                      message.warn("County can't be blank.");
                    }
                  },
                }
              }
            >
              {this.state.point.properties.co_name + ''}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="Ownership">
            <Text
              editable={
                this.state.proposedChanges && {
                  onChange: val => {
                    if (val.length !== 0) {
                      const point = this.state.point;
                      point.properties.ownership = val;
                      this.setState({point});
                    } else {
                      message.warn("Ownership can't be blank.");
                    }
                  },
                }
              }
            >
              {this.state.point.properties.ownership + ''}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="Topo">
            <Text
              editable={
                this.state.proposedChanges && {
                  onChange: val => {
                    if (val.length !== 0) {
                      const point = this.state.point;
                      point.properties.topo_name = val;
                      this.setState({point});
                    } else {
                      message.warn("Topo can't be blank.");
                    }
                  },
                }
              }
            >
              {this.state.point.properties.topo_name + ''}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="Topo Indication">
            <Text
              editable={
                this.state.proposedChanges && {
                  onChange: val => {
                    if (val.length !== 0) {
                      const point = this.state.point;
                      point.properties.topo_indi = val;
                      this.setState({point});
                    } else {
                      message.warn("Topo Indication can't be blank.");
                    }
                  },
                }
              }
            >
              {this.state.point.properties.topo_indi + ''}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="Gear">
            <Text
              editable={
                this.state.proposedChanges && {
                  onChange: val => {
                    if (val.length !== 0) {
                      const point = this.state.point;
                      point.properties.gear = val;
                      this.setState({point});
                    } else {
                      message.warn("Gear can't be blank.");
                    }
                  },
                }
              }
            >
              {this.state.point.properties.gear + ''}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="Enterance Type">
            <Text
              editable={
                this.state.proposedChanges && {
                  onChange: val => {
                    if (val.length !== 0) {
                      const point = this.state.point;
                      point.properties.ent_type = val;
                      this.setState({point});
                    } else {
                      message.warn("Enterance type can't be blank.");
                    }
                  },
                }
              }
            >
              {this.state.point.properties.ent_type + ''}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="Field Indication">
            <Text
              editable={
                this.state.proposedChanges && {
                  onChange: val => {
                    if (val.length !== 0) {
                      const point = this.state.point;
                      point.properties.field_indi = val;
                      this.setState({point});
                    } else {
                      message.warn("Field indication can't be blank.");
                    }
                  },
                }
              }
            >
              {this.state.point.properties.field_indi + ''}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="Map Status">
            <Text
              editable={
                this.state.proposedChanges && {
                  onChange: val => {
                    if (val.length !== 0) {
                      const point = this.state.point;
                      point.properties.map_status = val;
                      this.setState({point});
                    } else {
                      message.warn("Map status can't be blank.");
                    }
                  },
                }
              }
            >
              {this.state.point.properties.map_status + ''}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="Geology">
            <Text
              editable={
                this.state.proposedChanges && {
                  onChange: val => {
                    if (val.length !== 0) {
                      const point = this.state.point;
                      point.properties.geology = val;
                      this.setState({point});
                    } else {
                      message.warn("Geology can't be blank.");
                    }
                  },
                }
              }
            >
              {this.state.point.properties.geology + ''}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="Geology Age">
            <Text
              editable={
                this.state.proposedChanges && {
                  onChange: val => {
                    if (val.length !== 0) {
                      const point = this.state.point;
                      point.properties.geo_age = val;
                      this.setState({point});
                    } else {
                      message.warn("Geology age can't be blank.");
                    }
                  },
                }
              }
            >
              {this.state.point.properties.geo_age + ''}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="Physiographic Province">
            <Text
              editable={
                this.state.proposedChanges && {
                  onChange: val => {
                    if (val.length !== 0) {
                      const point = this.state.point;
                      point.properties.phys_prov = val;
                      this.setState({point});
                    } else {
                      message.warn("Physiographic Province can't be blank.");
                    }
                  },
                }
              }
            >
              {this.state.point.properties.phys_prov + ''}
            </Text>
          </Descriptions.Item>
        </Descriptions>
        {this.props.action === 'View' && (
          <div>
            <Row>
              <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                <Divider orientation="left">Narrative</Divider>
                <Paragraph>{narrative}</Paragraph>
                {this.state.proposedChanges && (
                  <TextArea
                    placeholder="Add to the narrative."
                    autoSize={{minRows: 4}}
                    style={{textAlign: 'justify'}}
                    onChange={newNarrative => {
                      this.setState({newNarrative: newNarrative.target.value});
                    }}
                  >
                    {this.state.newNarrative}
                  </TextArea>
                )}
              </Col>
              {/* <Col xs={1} sm={1} md={1} lg={1} xl={1}></Col> */}
              <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                <Divider orientation="left">Maps</Divider>
                <DisplayAllMaps
                  tcsnumber={this.state.point.properties.tcsnumber}
                ></DisplayAllMaps>
              </Col>
              <Col span={1}></Col>
            </Row>
          </div>
        )}

        {this.props.action === 'Review' && (
          <div>
            <Row>
              <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                <Divider orientation="left">Narrative</Divider>
                {this.state.proposedChanges ? (
                  <TextArea
                    value={this.state.newNarrative}
                    autoSize={{minRows: 4}}
                    onChange={newNarrative => {
                      this.setState({newNarrative: newNarrative.target.value});
                    }}
                  >
                    {this.state.newNarrative}
                  </TextArea>
                ) : (
                  <Paragraph>{narrative}</Paragraph>
                )}
              </Col>
              <Col xs={1} sm={1} md={1} lg={1} xl={1}></Col>
              <Col xs={22} sm={22} md={22} lg={6} xl={6}>
                <Divider orientation="left">Maps</Divider>
                <DisplayAllMaps
                  tcsnumber={this.state.point.properties.tcsnumber}
                ></DisplayAllMaps>
              </Col>
              <Col span={1}></Col>
            </Row>
          </div>
        )}
      </div>
    );
  }

  renderParcelData() {
    if (this.state.parcelData.fields !== undefined) {
      return (
        <div>
          Please note, this data might not be up to date.
          <Space direction="vertical">
            {this.state.parcelData.fields.owner !== null && (
              <Descriptions bordered column={this.props.descriptionColProps}>
                <Descriptions.Item label="Owner 1">
                  {this.state.parcelData.fields.owner}
                </Descriptions.Item>
                {this.state.parcelData.fields.owner2 !== null && (
                  <Descriptions.Item label="Owner 2">
                    {this.state.parcelData.fields.owner2}
                  </Descriptions.Item>
                )}
                <Descriptions.Item label="Address">
                  {this.state.parcelData.fields.address}
                </Descriptions.Item>
                <Descriptions.Item label="City">
                  {this.state.parcelData.fields.scity}
                </Descriptions.Item>
                <Descriptions.Item label="Zip">
                  {this.state.parcelData.fields.szip}
                </Descriptions.Item>
                <Descriptions.Item label="Acreage">
                  {this.state.parcelData.fields.gisacre}
                </Descriptions.Item>
                <Descriptions.Item label="Use Description">
                  {this.state.parcelData.fields.usedesc}
                </Descriptions.Item>
                <Descriptions.Item label="Mailing Address">
                  {this.state.parcelData.fields.mailadd}
                </Descriptions.Item>
                <Descriptions.Item label="Mailing City">
                  {this.state.parcelData.fields.mailadd}
                </Descriptions.Item>
                <Descriptions.Item label="Mailing City">
                  {this.state.parcelData.fields.mail_city}
                </Descriptions.Item>
                <Descriptions.Item label="Mailing State">
                  {this.state.parcelData.fields.mail_state2}
                </Descriptions.Item>
                <Descriptions.Item label="Mailing Zip">
                  {this.state.parcelData.fields.mail_zip}
                </Descriptions.Item>
                <Descriptions.Item label="Last Sale Date">
                  {this.state.parcelData.fields.saledate}
                </Descriptions.Item>
                <Descriptions.Item label="More Info">
                  <a
                    target="_blank"
                    href={'https://landgrid.com' + this.state.parcelData.path}
                  >
                    Landgrid
                  </a>
                </Descriptions.Item>
              </Descriptions>
            )}
          </Space>
          <pre>
            {/* {JSON.stringify(this.state.parcelData.geometry, null, 2)} */}
          </pre>
        </div>
      );
    } else {
      return null;
    }
  }

  renderTitle = () => {
    return (
      <div>
        <Row justify="start">
          <Space align="baseline">
            <Col>
              <Title level={3}>{this.state.point.properties.name}</Title>
            </Col>
            <Col>
              <Text type="secondary">
                {this.state.point.properties.tcsnumber}
              </Text>
            </Col>
          </Space>
          <div style={{marginLeft: 'auto'}}>{this.proposeChangesBar()}</div>
        </Row>
        <Row justify="start">
          <Text type="secondary">
            {this.state.point.properties.co_name + ' County'}
          </Text>
        </Row>
      </div>
    );
  };

  proposeChangesBar() {
    if (this.props.action === 'View') {
      if (!this.state.proposedChanges) {
        return (
          <Button
            className="NoPrint"
            type="primary"
            onClick={() => {
              this.setState({proposedChanges: !this.state.proposedChanges});
            }}
          >
            {'Propose Changes'}
          </Button>
        );
      } else {
        return (
          <Space>
            <Button
              danger
              onClick={() => {
                const revertPoint = JSON.parse(
                  JSON.stringify(this.state.pointCopy)
                );
                if (this.props.action === 'View') {
                  this.setState({
                    proposedChanges: !this.state.proposedChanges,
                    point: revertPoint,
                  });
                }
              }}
            >
              {'Cancel'}
            </Button>
            <Button
              type="primary"
              onClick={() => {
                const point = JSON.parse(
                  JSON.stringify(this.state.point)
                ) as Feature;
                point.properties.narr += '\n\n' + this.state.newNarrative;
                const newSubmission = {
                  submitted_by: this.context.user._id,
                  point: point,
                  status: 'Pending',
                  pointType: 'Existing',
                } as SubmittedPoint;

                if (
                  !deepEqual(this.state.point, this.state.pointCopy) ||
                  this.state.newNarrative !== ''
                ) {
                  addSubmittedPoint(newSubmission).then(() => {
                    message.success(
                      'Your changes to ' +
                        point.properties.tcsnumber +
                        ' are under review.'
                    );
                  });
                } else {
                  message.warn("You didn't make any changes.");
                }

                this.setState({
                  proposedChanges: !this.state.proposedChanges,
                  point,
                });
              }}
            >
              {'Submit'}
            </Button>
          </Space>
        );
      }
    }

    if (this.props.action === 'Review') {
      let rejectMessage = '';
      return (
        <Space>
          <Button
            danger
            onClick={() => {
              if (this.state.proposedChanges) {
                const revertPoint = JSON.parse(
                  JSON.stringify(this.state.pointCopy)
                );
                this.setState({
                  proposedChanges: !this.state.proposedChanges,
                  point: revertPoint,
                });
              } else {
                this.setState({
                  proposedChanges: !this.state.proposedChanges,
                });
              }
            }}
          >
            {this.state.proposedChanges ? 'Revert' : 'Edit'}
          </Button>
          <Popconfirm
            title={
              <div>
                <Text>Add a Reason</Text>
                <TextArea
                  onChange={e => {
                    rejectMessage = e.target.value;
                  }}
                ></TextArea>
              </div>
            }
            onConfirm={() => {
              this.setState({loadingButtons: {rejectloading: true}});
              const updateSubmission = {
                status: 'Rejected',
                message:
                  'Rejected on ' +
                  new Date().toDateString() +
                  '\nRejected by ' +
                  this.context.user.firstName +
                  ' ' +
                  this.context.user.lastName +
                  '\nReason for Rejection:\n' +
                  rejectMessage,
              } as SubmittedPoint;
              updateOneSubmittedPointByID(
                this.state.submittedPoint._id,
                updateSubmission
              ).then(() => {
                message.error(
                  this.state.point.properties.tcsnumber + ' has been rejected.'
                );
                this.props.history.goBack();
              });
            }}
          >
            <Button
              type="primary"
              loading={this.state.loadingButtons.rejectloading}
              danger
            >
              {'Reject'}
            </Button>
          </Popconfirm>
          <Button
            type="primary"
            loading={this.state.loadingButtons.approveloading}
            onClick={() => {
              this.setState({loadingButtons: {approveloading: true}});
              const updateSubmission = {
                point: this.state.point,
                status: 'Approved',
                message:
                  'Approved on ' +
                  new Date().toDateString() +
                  '\nApproved by: ' +
                  this.context.user.firstName +
                  ' ' +
                  this.context.user.lastName,
              } as SubmittedPoint;
              updateOneSubmittedPointByID(
                this.state.submittedPoint._id,
                updateSubmission
              ).then(() => {
                message.success(
                  this.state.point.properties.tcsnumber + ' has been approved.'
                );
                this.props.history.goBack();
              });
            }}
          >
            {'Approve'}
          </Button>
        </Space>
      );
    }
    if (this.props.action === 'Edit') {
      // let rejectMessage = '';
      return (
        <Space>
          <Button
            danger
            onClick={() => {
              if (this.state.proposedChanges) {
                const revertPoint = JSON.parse(
                  JSON.stringify(this.state.pointCopy)
                );
                this.setState({
                  proposedChanges: !this.state.proposedChanges,
                  point: revertPoint,
                });
              } else {
                this.setState({
                  proposedChanges: !this.state.proposedChanges,
                });
              }
            }}
          >
            {this.state.proposedChanges ? 'Revert' : 'Edit'}
          </Button>
          <Button
            type="primary"
            loading={this.state.loadingButtons.approveloading}
            onClick={() => {
              if (!deepEqual(this.state.point, this.state.pointCopy)) {
                this.setState({loadingButtons: {approveloading: true}});
                const updateSubmission = {
                  point: this.state.point,
                  status: 'Pending',
                  date: new Date(),
                  message: '',
                } as SubmittedPoint;
                updateOneSubmittedPointByID(
                  this.state.submittedPoint._id,
                  updateSubmission
                ).then(() => {
                  message.success(
                    'Your changes to ' +
                      this.state.point.properties.tcsnumber +
                      ' are under review.'
                  );
                  this.props.history.push('/dashboard');
                });
              } else {
                this.setState({
                  // proposedChanges: !this.state.proposedChanges,
                  // point
                });
                message.warn("You didn't make any changes.");
              }
            }}
          >
            {'Update'}
          </Button>
        </Space>
      );
    }
  }

  render() {
    const {tcsnumber, name} = this.state.point.properties;
    return (
      <div className="site-layout-content">
        <Helmet>
          <title>{tcsnumber + ' ' + name}</title>
        </Helmet>
        <Card bordered={false} loading={this.state.isLoading}>
          <div className="noPrintMargins">
            {this.props.renderTitle && (
              <div>
                {this.renderTitle()}
                <Divider orientation="left"></Divider>
              </div>
            )}
            <Meta description={this.renderDescription()}></Meta>
            <Divider orientation="left">Parcel Data</Divider>
            {this.renderParcelData()}
            {this.props.showMap && (
              <div>
                <Divider orientation="left">Location</Divider>

                <div style={{height: '500px'}}>
                  <MapView
                    center={this.state.point.geometry.coordinates
                      .slice()
                      .reverse()}
                    zoom={15}
                    singlePoint={this.state.point}
                    showFullScreen={true}
                  />
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  }
}

CaveInfo.contextType = userContext;

const caveInfo = withRouter(CaveInfo);
export {caveInfo as CaveInfo};
