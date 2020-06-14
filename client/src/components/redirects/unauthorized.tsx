import React, {Component} from 'react';
import {Helmet} from 'react-helmet'
import {Typography, Row, Col, Card, Space} from 'antd';
import {ClockCircleOutlined} from '@ant-design/icons'
import ContainerDimensions from 'react-container-dimensions';

const {Title, Paragraph} = Typography;

class Unauthorized extends Component<any, any> {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div style={{height:"100%"}}>
        <Helmet>
          <title>Unauthorized</title>
        </Helmet>
        
        <ContainerDimensions>
            {({width, height})=>(
            <Row style={{background:"", height}} align="middle" justify="center">
                <Card>
                <Col span={24}>
                    <Col span={24}>
                        <Title style={{textAlign:"center"}}>Account Status</Title>
                    </Col>

                    <Paragraph style={{textAlign:"center", backgroundColor:""}}>Your account is pending.</Paragraph>

                </Col>
                </Card>
            </Row>
            )}
        </ContainerDimensions>

        
      </div>
    );
  }
}


export {Unauthorized};
