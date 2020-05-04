import React from 'react';
import { Modal, Row, Space, Col, Typography } from 'antd';
import { CaveInfo } from '../pages/CaveInfo'
import { Feature } from '../pages/geoJsonInterface';

const { Title, Text } = Typography;

interface Props {
    point: Feature
    onClick: ()=> void
}

class PointInfoPopup extends React.Component<Props,any> {
//   state = { visible: true };

  constructor(Props){
      super(Props);

      this.state = {
        visible: true
    }
    this.showModal = this.showModal.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }


  showModal = () => {
    console.log("Clicked", this.props.point.properties.tcsnumber)
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
    this.props.onClick();
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
    this.props.onClick();
  };

  renderTitle = ()=>{
    return(
        <div>
            <Row justify="start">
                <Space align="baseline">
                <Col>
                    <Title level={3}>{this.props.point.properties.name}</Title>
                </Col>
                <Col>
                    <Text type="secondary">{this.props.point.properties.tcsnumber}</Text>
                </Col>
                </Space>      
            </Row>
            <Row justify="start">
                <Text type="secondary">{this.props.point.properties.co_name + " County"}</Text>
            </Row>
        </div>
    )
  }

  render() {
    return (
        <Modal
          width="65vw"
          bodyStyle={{height:"65vh", overflow: "scroll"}}
          centered          
          visible={this.state.visible}
          onOk={this.handleOk}
          okText="Close"
          cancelButtonProps={{ style: { display: 'none' } }}
          onCancel={this.handleCancel}
          title={this.renderTitle()}
          
        >
        <CaveInfo
            id={this.props.point.properties.tcsnumber}
            showMap={false}
            renderTitle={false}
        ></CaveInfo>
        </Modal>
    );
  }
}

export {PointInfoPopup}