import React, { Component } from 'react';
import { useState } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBInput } from 'mdbreact';
import './Signin.css';
import axios from "axios";
import { useHistory } from "react-router-dom";
const api = 'http://localhost:3001';

const Signin = (props) =>{
    const history = useHistory();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [invalidEmail, setInvalidEmail] = useState(false);
    const [emptyPassword, setEmptyPassword] = useState(false);
    const [signupFailed, setSignupFailed] = useState(false);
    const [errMessage, setErrMessage] = useState("");

    const handleEmailInput = (e) => {
        setEmail(e.target.value);
        setInvalidEmail(false);
    }

    const handlePasswordInput = (e) => {
        setPassword(e.target.value);
        setEmptyPassword(false);
    }
                // fetch(api + "/user/login", {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json" 
            //     },
            //     body: JSON.stringify({
            //         email: email,
            //         password: password
            //     })
            // })
    const handleSubmit = async ()  => {
        if(email == "" || password == "")
        {
            alert("Fill all the fields first");
        }
        else{
            axios.post(api + "/user/login",
            {
                email: email,
                password: password
            })
            .then(response => {
                    if(response.data.user.isEnabled === false)
                    {
                        alert("Can not log in... Your account is disabled");
                    }
                    else
                    {
                        localStorage.setItem("token",response.data.token);
                        localStorage.setItem("userId",response.data.user._id);
                        if(response.data.user.userRole === 1)
                        {
                            history.push('/adminhome');
                        }
                        else
                        {
                            history.push('/home');
                        }
                    }

            }).catch(error => {
                console.log(error);
                if(error.response.status === 401 || error.response.status === 400)
                {
                    alert(error.response.data.message);
                }
                else {
                    alert("Something went wrong. Please try again later.");
                }
                //console.log('error >>> ', error);
            });
        }

        

    }
        return(
            <MDBContainer className="login-todo-main">
                <MDBRow className="align-center">
                    <MDBCol md="6">
                        <p className="h5 text-center signup-heading">Sign In</p>
                        <div className="grey-text">
                        <MDBInput
                                label="Your email"
                                icon="envelope"
                                group
                                type="email"
                                validate
                                error="wrong"
                                success="right"
                                value={email}
                                onChange={handleEmailInput}
                                size={(invalidEmail) ? "lg inputErrorDiv" : "lg"}
                                className={(invalidEmail) ? "inputError" : ""}
                            />
                            {
                                (invalidEmail) && <span className="signup-error-text"> Please type valid email address.</span>
                            }
                            <MDBInput
                                label="Your password"
                                icon="lock"
                                group
                                type="password"
                                validate
                                value={password}
                                onChange={handlePasswordInput}
                                size={(emptyPassword) ? "lg inputErrorDiv" : "lg"}
                                className={(emptyPassword) ? "inputError" : ""}
                            />
                            {
                                (emptyPassword) && <span className="signup-error-text">Password cannot be blank.</span>
                            }
                            {
                                (signupFailed) && <span className="signup-error-text signin-bad-response"> Error: {errMessage}, please try again.</span>
                            }
                        </div>
                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => { handleSubmit() }}
                                className="btn Ripple-parent btn btn-outline-info-modified Ripple-parent waves-effect">
                                Sign-In
                            </button>
                            <div>
                                <button className="login-link" onClick={() => { history.push("/signup") }}>Sign-up</button>
                            </div>
                        </div>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        );
}

export default Signin