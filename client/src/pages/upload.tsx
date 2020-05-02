import React, { Component } from "react";
import { Points } from './geoJsonInterface'
import { Upload, message, Button, Empty} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { MapView } from "../components/MapView";


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
    points: Points
}

class UploadCSV extends Component<any, State>{

    state = {
        points: {} as Points
      };
    
      handleChange = info => {
        const { status } = info.file;
        if (status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
            this.setState({points: (info.file.response)})
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
      };
    
      render() {

        const props = {
          name:"csv",
          action: "http://localhost:5000/api/points/master/upload",
          onChange: this.handleChange,
          multiple: false
        };
        return (
            <div>
            {this.state.points.features === undefined ?
            <div>
                <Upload {...props}>
                    <Button>
                    <UploadOutlined /> Click to Upload
                    </Button>
                </Upload>
                <pre>{JSON.stringify(this.state.points, null, 10)}</pre>
                
            </div>
                :
                <MapView data = {this.state.points.features}></MapView>
            }
            </div>
            
            
        );
      }
}
export { UploadCSV };