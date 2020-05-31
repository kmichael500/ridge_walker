import React, { Component } from "react";
import { Feature, Points } from '../interfaces/geoJsonInterface'
import { DeadLeadsTable } from '../components/DeadLeadsTable'
import { getAllLeadPoints } from '../dataservice/leadPoints'
import { LeadFeature, LeadPointInterface } from "../interfaces/LeadPointInterface";

interface State {
    points: LeadPointInterface[]
}

interface Props {

}



class DeadLeads extends Component<Props, State>{  
    
    constructor(Props){
        super(Props);
        this.state = {
            points: undefined
        }
    }

    componentDidMount(){
        getAllLeadPoints().then((requstedLeads)=>{
            // console.log(requstedPoints);
            console.log(requstedLeads);
            this.setState({points: requstedLeads})
        })
    }

    render(){
        return(
            <div className="site-layout-content">
                <DeadLeadsTable points={this.state.points}></DeadLeadsTable>
            </div>
        )
    }
}
export { DeadLeads };