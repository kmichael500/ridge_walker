import React, { Component } from "react";

import {
    Layout,
    Typography,
    Row,
    Card,
    PageHeader,
  } from 'antd';
import { ReviewPoint } from "./ReviewPoint";

const { Content } = Layout
const { Paragraph, Title, Text } = Typography;
interface State {
}
class ReviewPage extends Component<any, State>{ 

    render(){
      return(
          <div className="site-layout-content">
            <Card bordered={false} style={{minWidth:"100%"}} title={<h1>Review Submissions</h1>}
            >
                <ReviewPoint></ReviewPoint>
            </Card>   
          </div>
      )
    }
}


export { ReviewPage };