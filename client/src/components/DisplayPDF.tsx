import React, { Component } from 'react';
import { Document, Page, StyleSheet } from 'react-pdf/dist/entry.webpack';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { Modal, Button } from 'antd';



const options = {
    cMapUrl: 'cmaps/',
    cMapPacked: true,
  };

interface Props{
    tcsnumber: string,
    onClick?: ()=>void
}

export default class DisplayMap extends Component<Props, any> {

    static defaultProps:Props = {
        onClick: ()=>{}
    }
    constructor(Props: Props){
        super(Props);

        this.state = {
        file: 'http://localhost:5000/api/maps/'+this.props.tcsnumber,
        numPages: null,
        visible: true
        }

    // modal stuff
    this.showModal = this.showModal.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);

    // pdf stuff
    this.onFileChange = this.onFileChange.bind(this);
    this.onDocumentLoadSuccess = this.onDocumentLoadSuccess.bind(this);

    }

    // modal stuff
    showModal = () => {
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


    // pdf stuff
    onFileChange = (event) => {
        this.setState({
            file: event.target.files[0],
        });
    }
    onDocumentLoadSuccess = ({ numPages }) => {
        this.setState({ numPages });
    }

    render() {
    const { file, numPages } = this.state;
    const { visible, loading } = this.state;
    return (
    <Modal
        width="90vw"
        bodyStyle={{height:"80vh", overflow: "scroll"}}
        centered          
        visible={this.state.visible}
        onOk={this.handleOk}
        okText="Close"
        cancelButtonProps={{ style: { display: 'none' } }}
        onCancel={this.handleCancel}

        footer={[
            <Button key="back" onClick={this.handleCancel}>
              Download
            </Button>,
            <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
              Close
            </Button>,
        ]}
        
        >
            
        <Document
            file={file}
            onLoadSuccess={this.onDocumentLoadSuccess}
            options={options}
        >
        
            {
            Array.from(
                new Array(numPages),
                (el, index) => (
                <Page
                    height={800}
                //   width="500px"
                    // width={800}
                    key={`page_${index + 1}`}
                    pageNumber={index + 1}
                />
                ),
            )
            }
        </Document>
        </Modal>
    );
    }

}