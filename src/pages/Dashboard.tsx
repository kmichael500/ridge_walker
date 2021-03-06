import React, {Component} from 'react';
import {UploadLeads} from '../components/Karst Features/UploadLeads';
import {Helmet} from 'react-helmet';

import {Button, Typography, Space, Row, Col, Tabs} from 'antd';
import {SubmittedPoint} from '../interfaces/submittedPointInterface';
import {getCurrentUserSubmissions} from '../dataservice/authentication';
import {
  DownloadCSVButton,
  DownloadGPXButton,
} from '../components/downloadData/DownloadButtons';
import {ReviewTable} from './ReviewPoint';
import {DeadLeads} from './DeadLeads';
import {userContext} from '../context/userContext';

const {Paragraph, Title} = Typography;
const {TabPane} = Tabs;
interface State {
  submittedPoints: SubmittedPoint[];
  newPoints: SubmittedPoint[];
  existingPoints: SubmittedPoint[];
  deadLeadButton: '' | 'View' | 'Upload';
}
class Dashboard extends Component<any, State> {
  constructor(Props) {
    super(Props);
    this.state = {
      submittedPoints: undefined,
      newPoints: undefined,
      existingPoints: undefined,
      deadLeadButton: 'Upload',
    };
    this.leadButtons = this.leadButtons.bind(this);
  }

  componentDidMount() {
    getCurrentUserSubmissions().then(requstedSubmissions => {
      const newPoints = [];
      const existingPoints = [];
      requstedSubmissions.map(submission => {
        if (submission.pointType === 'New') {
          newPoints.push(submission);
        } else if (submission.pointType === 'Existing') {
          existingPoints.push(submission);
        }
        return null;
      });

      this.setState({
        submittedPoints: requstedSubmissions,
        newPoints,
        existingPoints,
      });
    });
  }

  leadButtons() {
    return (
      <Space align="start">
        <Button
          type="primary"
          size="large"
          onClick={() => {
            this.setState({deadLeadButton: 'Upload'});
          }}
        >
          Upload
        </Button>
        <Button
          type="primary"
          size="large"
          onClick={() => {
            this.setState({deadLeadButton: 'View'});
          }}
        >
          View
        </Button>
      </Space>
    );
  }

  render() {
    const newPointsLength =
      this.state.newPoints === undefined
        ? 0
        : this.state.newPoints.filter(value => value.status === 'Pending')
            .length;
    const existingPointLength =
      this.state.existingPoints === undefined
        ? 0
        : this.state.existingPoints.filter(value => value.status === 'Pending')
            .length;
    const padding = '6%';
    return (
      <div className="site-layout-content">
        <Helmet>
          <title>Dashboard</title>
        </Helmet>
        <Row
          justify="start"
          align="middle"
          style={{background: 'white', minHeight: '300px', padding}}
        >
          <Col span={24}>
            <Title>My Submission Status</Title>
          </Col>

          <Col span={24}>
            <Paragraph>
              You can view, edit (if they have not been approved), or delete
              submissions.
            </Paragraph>
          </Col>

          <div style={{minWidth: '100%'}}>
            <Tabs defaultActiveKey="1">
              <TabPane tab={'New Caves (' + newPointsLength + ')'} key="1">
                <ReviewTable
                  points={this.state.newPoints}
                  action="Edit"
                ></ReviewTable>
              </TabPane>
              <TabPane
                tab={'Existing Caves (' + existingPointLength + ')'}
                key="2"
              >
                <ReviewTable
                  points={this.state.existingPoints}
                  action="Edit"
                ></ReviewTable>
              </TabPane>
            </Tabs>
          </div>
        </Row>
        <Row
          justify="center"
          align="middle"
          style={{
            background: '#fbfdfe',
            minHeight: '300px',
            minWidth: '100%',
            padding,
          }}
        >
          {this.state.deadLeadButton === 'View' && (
            <div style={{minWidth: '100%'}}>
              <Row justify="space-between">
                <Col>
                  <Title>My Dead Leads</Title>
                </Col>
                <Col>{this.leadButtons()}</Col>
              </Row>

              <DeadLeads></DeadLeads>
            </div>
          )}
          {this.state.deadLeadButton === 'Upload' && (
            <div style={{minWidth: '100%'}}>
              <Row justify="space-between">
                <Col>
                  <Title style={{textAlign: 'start'}}>Upload Dead Leads</Title>
                </Col>
                <Col>{this.leadButtons()}</Col>
              </Row>
              <UploadLeads></UploadLeads>
            </div>
          )}
        </Row>

        <Row
          justify="center"
          align="middle"
          style={{background: 'white', minHeight: '200px'}}
        >
          <Space>
            <div style={{background: '', flexBasis: 'fit-content'}}>
              <Title style={{textAlign: 'center'}}>Download Points</Title>
              <Space>
                <DownloadCSVButton></DownloadCSVButton>
                <DownloadGPXButton></DownloadGPXButton>
              </Space>
            </div>
          </Space>
        </Row>
      </div>
    );
  }
}

Dashboard.contextType = userContext;

export {Dashboard};
