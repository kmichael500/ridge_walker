import React, { Component } from "react";
import { Button } from "antd";
import { serverBaseURL } from "../../config/urlConfig";

class DownloadCSVButton extends Component{
    
    render(){
        return(
            <Button
                shape="round"
                size="large"
            >
            <a
                href={serverBaseURL+'api/points/master/download/csv'}
                download
            >
                Download CSV
            </a
            ></Button>
        )
    }
}

class DownloadGPXButton extends Component{
    render(){
        return(
            <Button
                shape="round"
                size="large"
            >
            <a
                href={serverBaseURL+'api/points/master/download/gpx'}
                download
            >
                Download GPX
            </a
            ></Button>
        )
    }
}

export { DownloadCSVButton, DownloadGPXButton}