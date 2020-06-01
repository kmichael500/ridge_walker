import React, {Component} from 'react';
import {Button} from 'antd';
import {DownloadOutlined} from '@ant-design/icons';
import {serverBaseURL} from '../../config/urlConfig';

class DownloadCSVButton extends Component {
  render() {
    return (
      <div>
        <a href={serverBaseURL + 'api/points/master/download/csv'}>
          <Button
            type="primary"
            shape="round"
            icon={<DownloadOutlined />}
            size="large"
          >
            Download CSV
          </Button>
        </a>
      </div>
    );
  }
}

class DownloadGPXButton extends Component {
  render() {
    return (
      <div>
        <a href={serverBaseURL + 'api/points/master/download/gpx'}>
          <Button
            type="primary"
            shape="round"
            icon={<DownloadOutlined />}
            size="large"
          >
            Download GPX
          </Button>
        </a>
      </div>
    );
  }
}

export {DownloadCSVButton, DownloadGPXButton};
