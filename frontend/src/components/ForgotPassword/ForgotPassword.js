import React, { Component } from 'react';
import './ForgotPassword.css';

const initialState = {
    signInEmail: '',
    errorState: false,
    successfulRequest: false
}

class ForgotPassword extends Component {
    // if you want a smart component (has state) to use props, we have to pass to constructor
    constructor(props) {
        super(props);
        this.state = initialState;
    }

    // we need state somewhere to manage when to show a message for a failed sign in attempt

    onEmailChange = (event) => {
        this.setState({signInEmail: event.target.value});
    }

    setErrorStatus = () => this.setState({errorState: true});

    setSuccessStatus = () => this.setState({successfulRequest: true});

    onSubmitSendPasswordResetRequest = () => {
        fetch('https://smart-brain-backend-zha7.onrender.com/api/forgot_password', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: this.state.signInEmail
            })
        }).then(response => {
            if(response.ok) {
                return response.json();
            }
        })
        .then(data => {
            if(data) { // does user exist?
                this.setSuccessStatus();
            }
            else {
                this.setErrorStatus();
            }
        });
    }

    render() {
        return (
            <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
                <main className='w-100 pa4 black-80'>
                    <div className="measure">
                        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                            <legend className="f1 fw6 ph0 mh0 center">Forgot Password</legend>
                            <div className="mt2">
                                <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                                <input onChange={this.onEmailChange} className="pa2 input-reset ba bg-transparent hover-bg-black  hover-white w-100 style-input" type="email" name="email-address"  id="email-address" />
                            </div>
                        </fieldset>
                        <div className="mt4 center">
                            <input onClick={this.onSubmitSendPasswordResetRequest} disabled={this.state.successfulRequest} className="b ph3 pv2 input-reset ba b--black bg-transparent pointer f6 dib style-buttons" type="submit" value="Send Request" />
                        </div>
                    </div>
                    <div className='success-text'>
                        {this.state.successfulRequest ? <div className='success-text'><p>Password Reset Request Sent!</p></div> : null }
                    </div>
                    <div className='error-text'>
                            { this.state.errorState ? <div className='text-danger fs-italic'><p>Invalid Email or Password</p></div> : <div className=''></div>}
                    </div>
                </main>
            </article>
        );
    }
}

export default ForgotPassword;