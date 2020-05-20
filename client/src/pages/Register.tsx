
import React, { Component } from "react";

import { registerUser } from '../dataservice/authentication';
// import '../css/Login.css'


interface State{
    email: string,
    password: string,
    repeat_password: string,
    error: boolean,
    error_msg: string
}

interface Props{
    history: any
}


class Register extends Component<Props,State> {

    constructor(props){
        super(props);
        this.state = {
            email: "",
            password: "",
            repeat_password: "",
            error: false,
            error_msg: ""
        }

        this.handleEmail = this.handleEmail.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.handlePasswordRepeat = this.handlePasswordRepeat.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleEmail(e: React.ChangeEvent<HTMLInputElement>){
        this.setState({email: e.target.value})
    }

    handlePassword(e: React.ChangeEvent<HTMLInputElement>){
        this.setState({password: e.target.value})
    }
    handlePasswordRepeat(e: React.ChangeEvent<HTMLInputElement>){
        this.setState({repeat_password: e.target.value})
    }

    handleSubmit(e: React.FormEvent<HTMLButtonElement>){
        e.preventDefault();

        if (this.state.password !== this.state.repeat_password){
            this.setState({error_msg: "Passwords are not the same.", error: true})
        }
        else if (this.state.email === ""){
            this.setState({error_msg: "Email can't be empty.", error: true})
        }
        else if (this.state.password === ""){
            this.setState({error_msg: "Password can't be empty", error: true})
        }
        else{
            registerUser(this.state.email, this.state.password).then((response)=>{
                this.props.history.push("/admin/login");
            }).catch((error)=>{
                this.setState({error_msg: error, error: true})
            })
        }
        
    }

  render() {
    return(
        <div className="loginContainer">
        <form className="loginForm">
            <div className="loginFormContent">
                <h1>Sign Up</h1>
                <input type="text" placeholder="Email" name="username" onChange={this.handleEmail}></input>
                <input type="password" placeholder="Enter Password" name="psw" onChange={this.handlePassword}></input>
                <input type="password" placeholder="Repeat Password" name="psw" onChange={this.handlePasswordRepeat}></input>
                {this.state.error &&
                    <p>{this.state.error_msg}</p>
                }
                <button className="loginButton" type="submit" onClick = {this.handleSubmit}>Register</button>
            </div>
        </form>
        </div>
    )
  }
}

export { Register }