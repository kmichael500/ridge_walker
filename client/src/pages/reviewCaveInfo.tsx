import { CaveInfo } from './CaveInfo'
import React, { Component } from "react";

class ReviewCaveInfo extends Component{

    componentDidMount(){
        console.log(this.props.location.state)
    }
    render(){
        return(
            <CaveInfo submittedPoint={this.props.match.params.id} action={this.props.location === undefined ? "View" : this.props.location.state.action}></CaveInfo>
        )
    }
}

export { ReviewCaveInfo };