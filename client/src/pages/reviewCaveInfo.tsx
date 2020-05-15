import { CaveInfo } from './CaveInfo'
import React, { Component } from "react";

class ReviewCaveInfo extends Component{

    render(){
        return(
            <CaveInfo submittedPoint={this.props.match.params.id} role="Admin"></CaveInfo>
        )
    }
}

export { ReviewCaveInfo };