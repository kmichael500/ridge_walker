import React, { Component } from 'react';
import { Document, Page, StyleSheet } from 'react-pdf/dist/entry.webpack';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { Card, Row, Col, Spin, Tabs } from 'antd';
import { getMapFileNames } from '../dataservice/getMaps'

const { TabPane } = Tabs;


const options = {
    cMapUrl: 'cmaps/',
    cMapPacked: true,
  };

interface SmallMapProps{
    fileName: string,
}

interface SmallMapState{
    file: string,
    numPages: number,
    loading: boolean
}

export class SmallMap extends Component<SmallMapProps, SmallMapState> {
    constructor(Props: SmallMapProps){
        super(Props);

        this.state = {
            file: this.props.fileName,
            numPages: null,
            loading: true
        }

    // pdf stuff
    this.onFileChange = this.onFileChange.bind(this);
    this.onDocumentLoadSuccess = this.onDocumentLoadSuccess.bind(this);
    }

    componentWillUpdate(nextProps: SmallMapProps){
        if (this.props.fileName !== nextProps.fileName){
            this.setState({file: nextProps.fileName})
            console.log(nextProps.fileName)
        }
    }

    // pdf stuff
    onFileChange = (event) => {
        this.setState({
            file: event.target.files[0],
        });
    }
    onDocumentLoadSuccess = ({ numPages }) => {
        this.setState({ numPages, loading: false });
    }

    render() {
    const { file, numPages } = this.state;
    return (
        // <Card
        //     style={{width:300}}
        //     bordered={false}
        
        // >     
        <Document
            file={file}
            onLoadSuccess={this.onDocumentLoadSuccess}
            options={options}
            loading={<Spin></Spin>}
        >
        
            {
            Array.from(
                new Array(numPages),
                (el, index) => (
                <Page
                    // height={200}
                  width={500}
                    // width={800}
                    key={`page_${index + 1}`}
                    pageNumber={index + 1}
                />
                ),
            )
            }
        </Document>
        // </Card> 
    );
    }
}

interface DisplayAllMapsProps {
    tcsnumber: string
}

interface DisplayAllMapsState{
    fileNames:string[]
}

export default class DisplayAllMaps extends Component<DisplayAllMapsProps, DisplayAllMapsState> {
    
    constructor(Props:DisplayAllMapsProps){
        super(Props);
        this.state = {
            fileNames: [""]
        }
        this.renderMaps = this.renderMaps.bind(this);
    }
    componentDidMount(){
        getMapFileNames(this.props.tcsnumber).then((files)=>{
            this.setState({fileNames: files})
        })
    }

    renderMaps(){
        return(
            <Tabs>
                {this.state.fileNames.map((file, index) => (
                    <TabPane forceRender={true} tab={"Map " + (index+1)} key={index.toString()}>
                        {/* <Space size="small"> */}
                        <SmallMap fileName={file}></SmallMap>
                        {/* </Space> */}
                    </TabPane>
                    


                ))}
            </Tabs>    
        )
    }

    render(){
        const props = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1
          };
        return(
            <div>
                {this.renderMaps()}
            </div>
            
        )
    }

}