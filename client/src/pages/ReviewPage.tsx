import React, {Component} from 'react';

import {Card} from 'antd';
import {ReviewPoint} from './ReviewPoint';

interface State {}
class ReviewPage extends Component<any, State> {
  render() {
    return (
      <div className="site-layout-content">
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
