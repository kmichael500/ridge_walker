import React, {Component} from 'react';
import {Button} from 'antd';
import {DownloadOutlined} from '@ant-design/icons';
import {serverBaseURL} from '../../config/urlConfig';
import {downloadMasterPoints} from '../../dataservice/getPoints'

class DownloadCSVButton extends Component {
  render() {
    return (
      <div>
          <Button
            type="primary"
            shape="round"
            icon={<DownloadOutlined />}
            size="large"
            onClick={()=>{
              downloadMasterPoints("csv")
            }}
          >
            Download CSV
          </Button>
      </div>
    );
  }
}

class DownloadGPXButton extends Component {
  render() {
    return (
      <div>
          <Button
            type="primary"
            shape="round"
            icon={<DownloadOutlined />}
            size="large"
            onClick={()=>{
              downloadMasterPoints("gpx")
            }}
          >
            Download GPX
          </Button>
      </div>
    );
  }
}

export {DownloadCSVButton, DownloadGPXButton};
