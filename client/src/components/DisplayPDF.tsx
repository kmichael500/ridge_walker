import React, {Component} from 'react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import {Modal, Button, Space} from 'antd';

// const options = {
//     cMapUrl: 'cmaps/',
//     cMapPacked: true,
//   };

interface Props {
  file: string;
  onClick?: () => void;
  visible: boolean;
}

export default class DisplayMap extends Component<Props, any> {
  static defaultProps: {
    onClick: () => {};
    file: '';
  };
  constructor(Props: Props) {
    super(Props);

    this.state = {
      visible: this.props.visible,
      downloadLink: this.props.file
        .replace('image/', '')
        .replace('.png', '.pdf'),
    };

    // modal stuff
    // this.showModal = this.showModal.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentDidUpdate(nextProps: Props) {
    if (this.props.visible !== nextProps.visible) {
    }
  }

  handleOk = e => {
    this.setState({
      visible: false,
    });
    this.props.onClick();
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
    this.props.onClick();
  };

  handleDownload = e => {};

  render() {
    const {loading} = this.state;
    return (
      <Modal
        width="90vw"
        bodyStyle={{height: '80vh', overflow: 'scroll'}}
        centered
        visible={this.props.visible}
        onOk={this.handleOk}
        okText="Close"
        cancelButtonProps={{style: {display: 'none'}}}
        onCancel={this.handleCancel}
        footer={
          <Space>
            <Button key="Download" href={this.state.downloadLink}>
              Download
            </Button>
            <Button
              key="submit"
              type="primary"
              loading={loading}
              onClick={this.handleOk}
            >
              Close
            </Button>
          </Space>
        }
      >
        <img src={this.props.file} alt="?" width="100%"></img>
      </Modal>
    );
  }
}
