import React, {Component} from 'react';
import {Points} from '../interfaces/geoJsonInterface';
import {Upload, message} from 'antd';
import {InboxOutlined} from '@ant-design/icons';
import {serverBaseURL} from '../config/urlConfig';
import {LeadPoints} from '../interfaces/LeadPointInterface';
const {Dragger} = Upload;

// const axiosInstance = axios.create({
//     baseURL: "http://localhost:5000"
// });

// const customRequest = async option => {
//     const { onSuccess, onError, file, action, onProgress } = option;
//     const url = "http://localhost:5000/api/points/master/upload";

//     // const { image } = this.state; // from onChange function above
//     const type = 'text/plain';
//     axios
//       .post(url, file, {
//         onUploadProgress: e => {
//           onProgress({ percent: (e.loaded / e.total) * 100 });
//         },
//         headers: {
//           'Content-Type': type,
//         },
//       })
//       .then(respones => {
//         /*......*/
//         onSuccess(respones.data);
//       })
//       .catch(err => {
//         /*......*/
//         onError(err);
//       });
//   };

interface State {
  points: Points;
}

interface Props {
  onUploaded: (point: LeadPoints | Points) => void;
  uploadPath: string;
  lat: string;
  long: string;
}

class UploadCSV extends Component<Props, State> {
  handleChange = info => {
    const {status} = info.file;
    if (status !== 'uploading') {
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
      this.props.onUploaded(info.file.response);
    } else if (status === 'error') {
      message.error(`${info.file.response}`);
    }
  };

  render() {
    const props = {
      name: 'csv',
      action:
        serverBaseURL +
        this.props.uploadPath +
        '?secret_token=' +
        localStorage.getItem('JWT'),
      onChange: this.handleChange,
      multiple: false,
    };
    return (
      <Dragger {...props} data={{lat: this.props.lat, long: this.props.long}}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
        <p className="ant-upload-hint">You can upload one file at a time</p>
      </Dragger>
    );
  }
}
export {UploadCSV};
