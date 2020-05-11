import React, { Component } from "react";
import { SubmittedPoint } from '../interfaces/submittedPointInterface'
import { Feature } from '../interfaces/geoJsonInterface'
import { PointsTable } from '../components/PointsTable'
import { getAllSubmittedPoints } from '../dataservice/submittedPoints'
import { List, Card, Skeleton, Button } from 'antd'

interface State {
    submittedPoints: SubmittedPoint[]
    points: Feature[],
}

interface Props {

}



class ReviewPoint extends Component<Props, State>{  
    
    constructor(Props){
        super(Props);
        this.state = {
            submittedPoints: undefined,
            points: undefined,
        }
    }

    componentDidMount(){
        getAllSubmittedPoints().then((requstedSubmissions)=>{
            // console.log(requstedPoints);
            let points = [];
            requstedSubmissions.map((submission)=>{
                points.push(submission.point)
            })

            console.log(points);
            this.setState({submittedPoints: requstedSubmissions, points})
        })
    }

    

    

    render(){
        return(
            <div className="site-layout-content">
                <Card>
                <List
                    itemLayout="horizontal"
                    dataSource={this.state.points}
                    renderItem={item => (
                        <List.Item
                            actions={[<Button>Edit</Button>]}
                        >
                            {/* <Skeleton avatar title={false} active> */}
                            <List.Item.Meta
                                
                                title={<a href="https://ant.design">{item.properties.name}</a>}
                                description={item.properties.narr}
                            />
                            {/* </Skeleton> */}
                        </List.Item>
                        )}
                />
                </Card>
            </div>
        )
    }
}
export { ReviewPoint };