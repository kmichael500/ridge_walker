import React, { Component } from "react";
import { Feature } from '../interfaces/geoJsonInterface'
import { PointsTable } from '../components/PointsTable'
import { getAllMasterPoints } from '../dataservice/getPoints'

interface State {
    points: Feature[]
}

interface Props {

}



class CavePointTable extends Component<Props, State>{  
    
    constructor(Props){
        super(Props);
        this.state = {
            points: undefined
        }
    }

    componentDidMount(){
        getAllMasterPoints().then((requstedPoints)=>{
            // console.log(requstedPoints);
            this.setState({points: requstedPoints})
        })
    }

    render(){
        return(
            <div className="site-layout-content">
                <PointsTable points={this.state.points}></PointsTable>
            </div>
        )
    }
}
export { CavePointTable };