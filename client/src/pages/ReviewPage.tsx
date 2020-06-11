import React, {Component} from 'react';

import {Card} from 'antd';
import {ReviewPoint} from './ReviewPoint';
import {Helmet} from 'react-helmet';

interface State {}
class ReviewPage extends Component<any, State> {
  render() {
    return (
      <div className="site-layout-content">
        <Helmet>
          <title>Review</title>
        </Helmet>
        <Card
          bordered={false}
          style={{minWidth: '100%'}}
          title={<h1>Review Submissions</h1>}
        >
          <ReviewPoint></ReviewPoint>
        </Card>
      </div>
    );
  }
}

export {ReviewPage};
