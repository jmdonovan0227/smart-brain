import React, { Component } from 'react';
import { Outlet, Link } from 'react-router-dom';
import './SignIn.css';

const initialState = {
    signInEmail: '',
    signInPassword: '',
    errorState: false,
    showPassword: false
}

class SignIn extends Component {
    // if you want a smart component (has state) to use props, we have to pass to constructor
    constructor(props) {
        super(props);
        this.state = initialState;
    }

    // we need state somewhere to manage when to show a message for a failed sign in attempt

    onEmailChange = (event) => {
        this.setState({signInEmail: event.target.value});
    }

    onPasswordChange = (event) => {
        this.setState({signInPassword: event.target.value});
    }

    setErrorStatus = () => this.setState({errorState: true});

    onPasswordButtonClick = () => {
        if(this.state.showPassword) {
            this.setState({showPassword: false});
        }
        else {
            this.setState({showPassword: true});
        }
    }

    onSubmitSignIn = () => {
        fetch('https://smart-brain-7iex.onrender.com/api/signin', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: this.state.signInEmail,
                password: this.state.signInPassword
            })
        }).then(response => response.json())
        .then(user => {
            if(user.id) { // does user exist?
                this.props.loadUser(user);
                this.props.onRouteChange('home');
            }
            else {
                this.setErrorStatus();
            }
        });
    }

    render() {
        return (
            <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
                <main className='w-75 pa4 black-80'>
                    <div className="measure">
                        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                            <legend className="f1 fw6 ph0 mh0 text-center">Sign In</legend>
                            <div className="mt3">
                                <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                                <input onChange={this.onEmailChange} className="pa2 input-reset ba bg-transparent hover-bg-black  hover-white w-100 style-input" type="email" name="email-address"  id="email-address" />
                            </div>
                            <div className="mv3">
                                <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                                <input onChange={this.onPasswordChange} className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100 style-input" type={this.state.showPassword ? 'text' : 'password'} name="password"  id="password" />
                            </div>
                        </fieldset>
                        <div className="center">
                            <button onClick={this.onPasswordButtonClick} className='b ph3 pv2 input-reset ba b--black bg-transparent pointer f6 dib mr3 style-buttons'>{this.state.showPassword ? 'Hide Password' : 'Show Password'}</button>
                            <input onClick={this.onSubmitSignIn} className="b ph3 pv2 input-reset ba b--black bg-transparent pointer f6 dib style-buttons" type="submit" value="Sign in" />
                        </div>
                        <div className='lh-copy mt4 center'>
                            <Link to='forgot_password' style={{textDecoration: 'none'}}><p className="f5 link dim black db pointer">Forgot Password</p></Link>
                        </div>
                        <div className="lh-copy mt1 center">
                            <Link to="/"><p onClick={() => this.props.onRouteChange('register')} className="f5 link dim black db pointer">Register</p></Link>
                        </div>
                    </div>
                    <div className='error-text'>
                            { this.state.errorState ? <div className='text-danger fs-italic'><p>Invalid Email or Password</p></div> : <div className=''></div>}
                    </div>
                </main>
                <Outlet />
            </article>
        );
    }
}

export default SignIn;