import React, {Component, useState, Fragment} from 'react';
import {UserInterface} from '../../interfaces/UserInterface';
import {getAllMasterPoints} from '../../dataservice/getPoints';
import {AdvancedPointsSearch} from './AdvancedPointsSearch';
import {Helmet} from 'react-helmet';
import {
  List,
  Card,
  Row,
  Col,
  Typography,
  Space,
  Tag,
  Divider,
  Descriptions,
  Collapse,
  Button,
} from 'antd';
import {EyeOutlined} from '@ant-design/icons';
// import {AdvancedUserSearch} from './AdvancedUserSerach';
import {userContext, UserContextInterface} from '../../context/userContext';
import {Feature} from '../../interfaces/geoJsonInterface';

const {Paragraph, Title} = Typography;
const {Panel} = Collapse;

interface UserStatusTagProps {
  status: string;
}
export const UserStatusTag: React.FunctionComponent<UserStatusTagProps> = props => {
  if (props.status === 'Pending') {
    return <Tag color="geekblue">{props.status}</Tag>;
  } else if (props.status === 'Approved') {
    return <Tag color="green">{props.status}</Tag>;
  } else if (props.status === 'Rejected') {
    return <Tag color="volcano">{props.status}</Tag>;
  } else {
    return <Tag>{props.status}</Tag>;
  }
};

export const UserRoleTag: React.FunctionComponent<{role: string}> = props => {
  if (props.role === 'Admin') {
    return <Tag color="green">{props.role}</Tag>;
  } else if (props.role === 'User') {
    return <Tag color="default">{props.role}</Tag>;
  } else {
    return null;
  }
};

// helper functinos
const DescriptionItem = ({title, content}) => (
  <Row>
    <Space>
      <Col>
        <h4>{title + ''}</h4>
        <Paragraph ellipsis={{rows: 2, expandable: true}}>{content}</Paragraph>
      </Col>
    </Space>
  </Row>
);

// End helper functions

interface State {
  pointsList: Feature[];
  listData: Feature[];
  renderedFeatures: {
    length: boolean;
    pdep: boolean;
    depth: boolean;
    elev: boolean;
    ps: boolean;
    co_name: boolean;
    ownership: boolean;
    topo_name: boolean;
    topo_indi: boolean;
    gear: boolean;
    ent_type: boolean;
    field_indi: boolean;
    map_status: boolean;
    geology: boolean;
    geo_age: boolean;
    phys_prov: boolean;
  };
  loading: boolean;
}

interface Props {}

class listPoints extends Component<Props, State> {
  constructor(Props) {
    super(Props);
    this.state = {
      pointsList: [],
      listData: [],
      loading: true,
      renderedFeatures: {
        length: true,
        pdep: true,
        depth: true,
        elev: false,
        ps: false,
        co_name: true,
        ownership: true,
        topo_name: false,
        topo_indi: false,
        gear: true,
        ent_type: true,
        field_indi: true,
        map_status: true,
        geology: true,
        geo_age: false,
        phys_prov: false,
      },
    };
    this.renderDescription = this.renderDescription.bind(this);
  }
  componentDidMount() {
    getAllMasterPoints().then(requestedPoints => {
      this.setState({
        pointsList: requestedPoints,
        listData: requestedPoints,
        loading: false,
      });
    });
  }

  renderDescription(point: Feature) {
    const renderedItems = [];
    for (const key in this.state.renderedFeatures) {
      if (key === 'length' && this.state.renderedFeatures[key]) {
        renderedItems.push(
          <Descriptions.Item label="Length">
            {point.properties.length}
          </Descriptions.Item>
        );
      }
      if (key === 'pdep' && this.state.renderedFeatures[key]) {
        renderedItems.push(
          <Descriptions.Item label="Pit Depth">
            {point.properties.pdep}
          </Descriptions.Item>
        );
      }
      if (key === 'depth' && this.state.renderedFeatures[key]) {
        renderedItems.push(
          <Descriptions.Item label="Vertical Extent">
            {point.properties.depth}
          </Descriptions.Item>
        );
      }
      if (key === 'elev' && this.state.renderedFeatures[key]) {
        renderedItems.push(
          <Descriptions.Item label="Elevation">
            {point.properties.elev}
          </Descriptions.Item>
        );
      }
      if (key === 'ps' && this.state.renderedFeatures[key]) {
        renderedItems.push(
          <Descriptions.Item label="Number of Pits">
            {point.properties.ps}
          </Descriptions.Item>
        );
      }
      if (key === 'co_name' && this.state.renderedFeatures[key]) {
        renderedItems.push(
          <Descriptions.Item label="County">
            {point.properties.co_name}
          </Descriptions.Item>
        );
      }
      if (key === 'ownership' && this.state.renderedFeatures[key]) {
        renderedItems.push(
          <Descriptions.Item label="Ownership">
            {point.properties.ownership}
          </Descriptions.Item>
        );
      }
      if (key === 'topo_name' && this.state.renderedFeatures[key]) {
        renderedItems.push(
          <Descriptions.Item label="Topo">
            {point.properties.topo_name}
          </Descriptions.Item>
        );
      }
      if (key === 'topo_indi' && this.state.renderedFeatures[key]) {
        renderedItems.push(
          <Descriptions.Item label="Topo Indication">
            {point.properties.topo_indi}
          </Descriptions.Item>
        );
      }
      if (key === 'gear' && this.state.renderedFeatures[key]) {
        renderedItems.push(
          <Descriptions.Item label="Gear">
            {point.properties.gear}
          </Descriptions.Item>
        );
      }
      if (key === 'ent_type' && this.state.renderedFeatures[key]) {
        renderedItems.push(
          <Descriptions.Item label="Enterance Type">
            {point.properties.ent_type}
          </Descriptions.Item>
        );
      }
      if (key === 'field_indi' && this.state.renderedFeatures[key]) {
        renderedItems.push(
          <Descriptions.Item label="Field Indication">
            {point.properties.field_indi}
          </Descriptions.Item>
        );
      }
      if (key === 'map_status' && this.state.renderedFeatures[key]) {
        renderedItems.push(
          <Descriptions.Item label="Map Status">
            {point.properties.map_status}
          </Descriptions.Item>
        );
      }
      if (key === 'geology' && this.state.renderedFeatures[key]) {
        renderedItems.push(
          <Descriptions.Item label="Geology">
            {point.properties.geology}
          </Descriptions.Item>
        );
      }
      if (key === 'geo_age' && this.state.renderedFeatures[key]) {
        renderedItems.push(
          <Descriptions.Item label="Geology Age">
            {point.properties.geo_age}
          </Descriptions.Item>
        );
      }
      if (key === 'phys_prov' && this.state.renderedFeatures[key]) {
        renderedItems.push(
          <Descriptions.Item label="Physiographic Province">
            {point.properties.phys_prov}
          </Descriptions.Item>
        );
      }
    }
    return (
      <Descriptions
        size="small"
        column={{xxl: 2, xl: 1, lg: 1, md: 2, sm: 3, xs: 2}}
      >
        {renderedItems}
      </Descriptions>
    );
  }

  render() {
    const currentUser = this.context as UserContextInterface;
    return (
      <div>
        <Helmet>
          <title>Points</title>
        </Helmet>
        <Card>
          <AdvancedPointsSearch
            pointList={this.state.pointsList}
            onSearch={results => {
              this.setState({listData: results});
            }}
          ></AdvancedPointsSearch>
          <Divider></Divider>
          <List
            pagination={{
              onChange: page => {},
              pageSize: 8,
              position: 'bottom',
            }}
            grid={{
              gutter: 16,
              xs: 1,
              sm: 1,
              md: 2,
              lg: 3,
              xl: 4,
              xxl: 5,
            }}
            dataSource={this.state.listData}
            loading={this.state.loading}
            renderItem={point => (
              <List.Item>
                <Card
                  title={
                    point.properties.name + ' ' + point.properties.tcsnumber
                  }
                  key={point.properties.tcsnumber}
                  actions={[
                    <Button
                      type="primary"
                      icon={<EyeOutlined />}
                      onClick={() => {
                        this.props.history.push(
                          '/points/' + point.properties.tcsnumber
                        );
                      }}
                    >
                      More Info
                    </Button>,
                  ]}
                >
                  {this.renderDescription(point)}
                </Card>
              </List.Item>
            )}
          />
        </Card>
      </div>
    );
  }
}

listPoints.contextType = userContext;

export {listPoints};
