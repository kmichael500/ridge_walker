import React, {Component} from 'react';
import {Helmet} from 'react-helmet';
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
} from 'antd';
import {getMasterPoint} from '../dataservice/getPoints';
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
import {withRouter} from 'react-router-dom';

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
}

const {Meta} = Card;

class CaveInfo extends Component<Props, State> {
  static defaultProps = {
    showMap: true,
    renderTitle: true,
    action: 'View',
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
          return <Paragraph key={i}>{item}</Paragraph>;
        });
    } else if (this.props.action === 'Review') {
      narrative = this.state.newNarrative.split('\n').map((item, i) => {
        return <Paragraph key={i}>{item}</Paragraph>;
      });
    }

    return (
      <div>
        <Descriptions
          bordered
          column={{xxl: 1, xl: 3, lg: 2, md: 3, sm: 2, xs: 1}}
        >
          <Descriptions.Item label="Coordinates">
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
          <Descriptions.Item label="Pits">
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
        <Divider orientation="left">Narrative</Divider>

        {this.props.action === 'View' && (
          <div>
            <Paragraph>{narrative}</Paragraph>
            {this.state.proposedChanges && (
              <TextArea
                placeholder="Add to the narrative."
                autoSize={{minRows: 4}}
                onChange={newNarrative => {
                  this.setState({newNarrative: newNarrative.target.value});
                }}
              >
                {this.state.newNarrative}
              </TextArea>
            )}
          </div>
        )}

        {this.props.action === 'Review' && (
          <div>
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
          </div>
        )}
      </div>
    );
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
              console.log(rejectMessage);
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
          <title>{tcsnumber + " " + name}</title> 
        </Helmet>
        <Card
          bordered={false}
          loading={this.state.isLoading}
          actions={
            [
              // <SettingOutlined key="setting" />,
              // <EditOutlined key="edit" />,
              // <EllipsisOutlined key="ellipsis" />,
            ]
          }
        >
          {this.props.renderTitle && (
            <div>
              {this.renderTitle()}
              <Divider orientation="left"></Divider>
            </div>
          )}
          <Meta description={this.renderDescription()}></Meta>

          <Divider orientation="left">Maps</Divider>
          <DisplayAllMaps
            tcsnumber={this.state.point.properties.tcsnumber}
          ></DisplayAllMaps>

          {this.props.showMap && (
            <div>
              <Divider orientation="left">Location</Divider>

              <div style={{height: '400px'}}>
                <MapView
                  center={this.state.point.geometry.coordinates
                    .slice()
                    .reverse()}
                  zoom={15}
                  showFullScreen={true}
                />
              </div>
            </div>
          )}
        </Card>
      </div>
    );
  }
}

CaveInfo.contextType = userContext;

const caveInfo = withRouter(CaveInfo);
export {caveInfo as CaveInfo};
