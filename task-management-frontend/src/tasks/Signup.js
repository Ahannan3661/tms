import React, { Component } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBInput } from 'mdbreact';
import './Signup.css'
const api = 'http://localhost:3001';
class Signup extends Component{
   
    state = {
        email: '',
        password: '',
        invalidEmail: false,
        emptyPassword: false,
        signupFailed: false,
        errMessage: ''

    }

    handleEmailInput = (e) => {
        this.setState({
            email: e.target.value,
            invalidEmail: false
        })
    }

    handlePasswordInput = (e) => {
        this.setState({
            password: e.target.value,
            emptyPassword: false
            
        })
    }

    handleSubmit = async ()  => {
        if(this.state.email == "" || this.state.password == "")
        {
            alert("Fill all the fields first");
        }
        else
        {
            const data = await fetch(api + "/user/new", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json" 
                },
                body: JSON.stringify({
                    email: this.state.email,
                    password: this.state.password
                })
            })
            .then(res => res.json())
        }
        alert("User Created");
        this.props.history.push("/")
    }

    render() {
        const { backToLogin } = this.props

        return(
            <MDBContainer className="login-todo-main">
                <MDBRow className="align-center">
                    <MDBCol md="6">
                        <p className="h5 text-center signup-heading">Sign up</p>
                        <div className="grey-text">
                        <MDBInput
                                label="Your email"
                                icon="envelope"
                                group
                                type="email"
                                validate
                                error="wrong"
                                success="right"
                                value={this.state.email}
                                onChange={this.handleEmailInput}
                                size={(this.state.invalidEmail) ? "lg inputErrorDiv" : "lg"}
                                className={(this.state.invalidEmail) ? "inputError" : ""}
                            />
                            {
                                (this.state.invalidEmail) && <span className="signup-error-text"> Please type valid email address.</span>
                            }
                            <MDBInput
                                label="Your password"
                                icon="lock"
                                group
                                type="password"
                                validate
                                value={this.state.password}
                                onChange={this.handlePasswordInput}
                                size={(this.state.emptyPassword) ? "lg inputErrorDiv" : "lg"}
                                className={(this.state.emptyPassword) ? "inputError" : ""}
                            />
                            {
                                (this.state.emptyPassword) && <span className="signup-error-text">Password cannot be blank.</span>
                            }
                            {
                                (this.state.signupFailed) && <span className="signup-error-text signin-bad-response"> Error: {this.state.errMessage}, please try again.</span>
                            }
                        </div>
                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => { this.handleSubmit() }}
                                className="btn Ripple-parent btn btn-outline-info-modified Ripple-parent waves-effect">
                                Create User
                            </button>
                            <div>
                                <button className="login-link" onClick={() => { this.props.history.push("/") }}>Sign-in</button>
                            </div>
                        </div>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>

        )
    }
}

export default Signup;