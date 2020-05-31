import React, { Component } from 'react'
import { RegisterUserInterface, UserInterface } from '../interfaces/UserInterface';
import { getUserProfile } from '../dataservice/authentication';
import { message } from 'antd';

export interface UserContextInterface{
    user: UserInterface,
    // logoutUser: ()=>{},
    isAuthenticated: boolean,
    setAuthenticated: (isAuthenticated: boolean, callback: ()=> void ) => void,
    setUser: (user: UserInterface) => void
}

const userContext = React.createContext(
    {
        user: {} as UserInterface,
        // logoutUser: ()=>{},
        isAuthenticated: false,
        setAuthenticated: (isAuthenticated: boolean, callback = ()=>{} ) => {},
        setUser: (user: UserInterface) => {}
    }
); // Create a context object

interface State{
    user: UserInterface,
    isAuthenticated: boolean
    loading: boolean
}
interface Props{

}

class UserContextProvider extends Component<Props, State>{
    constructor(Props: Props){
        super(Props);
        this.state = {
            user: {} as UserInterface,
            isAuthenticated: false,
            loading: true
        }
        this.setAuthenticated = this.setAuthenticated.bind(this);
        this.setUser = this.setUser.bind(this);
    }

    setAuthenticated(isAuthenticated: boolean, callback = ()=>{}){
        this.setState({isAuthenticated}, callback);
    }

    setUser(user: UserInterface){
        this.setState({user});
    }
    

    componentDidMount(){
        
        getUserProfile().then((user)=>{
            this.setState({user, isAuthenticated: true, loading: false});
        }).catch((error)=>{
            this.setState({loading: false, isAuthenticated: false});
        })
    }

    render(){
        const value = {
            isAuthenticated: this.state.isAuthenticated,
            setAuthenticated: this.setAuthenticated,
            setUser: this.setUser,
            user: this.state.user
        }
        return(
            <userContext.Provider value={value}>
                {!this.state.loading ?
                    <div>
                        {this.props.children}
                    </div>
                    :
                    null
                    
                }
            </userContext.Provider>
        );
    }
}

export {userContext, UserContextProvider}