import React, { Component } from 'react';
import './Register.css';

const initialState = { 
    email: '',
    password: '',
    name: '',
    errorState: false,
    errorText: '',
    showPassword: false
}

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
    }

    onEmailChange = (event) => {
        this.removeErrorStatus();
        this.setState({email: event.target.value});
    }

    onPasswordChange = (event) => {
        this.removeErrorStatus();
        this.setState({password: event.target.value});
    }

    onNameChange = (event) => {
        this.removeErrorStatus();
        this.setState({name: event.target.value});
    }

    setErrorStatus = () => {
        this.setState({errorState: true});
    }
    
    removeErrorStatus = () => {
        this.setState({errorState: false});
    }

    onPasswordButtonClick = () => {
        if(this.state.showPassword) {
            this.setState({showPassword: false});
        }
        else {
            this.setState({showPassword: true});
        }
    }

    setErrorText = (string) => {
        this.setState({errorText: string});
    }

    onSubmitSignIn = () => {
        // regular expression that starts by matching any number of characters, digits, periods, percentage signs, etc
        // plus sign indicates we will keep matching until we hit a character outside of the scope of the first part of the expression
        // if it is the AT symbol we continue searching until we hit a special character '.' then we match at least 2 occurences of letters with the
        // money symbol marking the end of the string
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/;
        const minLength = 14;
        const hasUpperCase = /[A-Z]/.test(this.state.password);
        const hasLowerCase = /[a-z]/.test(this.state.password);
        const hasNumbers = /[0-9]/.test(this.state.password);
        const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(this.state.password);

        if(!this.state.name || !this.state.email || !this.state.password) {
            this.setErrorText('Please enter a name, email, and password.');
            this.setErrorStatus();
        }
        // check if name is valid
        else if(this.state.name.length === 1) {
            // empty string (pass error text and display it)
            this.setErrorText('Please enter a valid name which is at least 2 characters long.');
            this.setErrorStatus();
        }

        else if (!emailPattern.test(this.state.email)) {
            this.setErrorText('Please enter a valid email address.');
            this.setErrorStatus();
        }

        // check password
        else if(this.state.password.length < minLength || !hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChars) {
            this.setErrorText('Please enter a valid password which has 14 characters and at least 1 uppercase letter, lowercase letter, number, and special character.');
            this.setErrorStatus();
        }

        else {      
            fetch('https://smart-brain-backend-zha7.onrender.com/api/register', {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    email: this.state.email,
                    password: this.state.password,
                    name: this.state.name
                })
            }).then(response => {
                if(response.ok) {
                    return response.json();
                }
            })
            .then(user => {
                if(user) {
                    this.props.loadUser(user);
                    this.props.onRouteChange('home');
                }
                else {
                    this.setErrorText('Invalid registration, please try again.');
                    this.setErrorStatus();
                }
            }).catch(err => {
                this.setErrorText('Invalid registration, please try again.');
                this.setErrorStatus();
            });
        }
    }

    render() {
        return (
            <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
                <main className="w-75 pa4 black-80">
                    <div className="measure">
                        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                            <legend className="f1 fw6 ph0 mh0 center">Register</legend>
                            <div className="mt3">
                                <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
                                <input onChange={this.onNameChange} className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="text" name="name"  id="name" />
                            </div>
                            <div className="mt3">
                                <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                                <input onChange={this.onEmailChange} className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="email" name="email-address"  id="email-address" />
                            </div>
                            <div className="mv3">
                                <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                                <input onChange={this.onPasswordChange} className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type={this.state.showPassword ? 'text' : 'password'} name="password"  id="password" />
                            </div>
                        </fieldset>
                        <div className='center'>
                            <p><strong>Password Length:</strong> {this.state.password.length}</p>
                        </div>
                        <div className="center">
                            <button onClick={this.onPasswordButtonClick} className='b ph3 pv2 input-reset ba b--black bg-transparent pointer f6 dib mr3 style-buttons'>{this.state.showPassword ? 'Hide Password' : 'Show Password'}</button>
                            <input onClick={this.onSubmitSignIn} className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib style-buttons" type="submit" value="Register" />
                        </div>
                        <div className='error-text'>
                            { this.state.errorState ? <div className='text-danger fs-italic'><p>{this.state.errorText}</p></div> : <div className=''></div>}
                        </div>
                    </div>
                </main>
            </article>
        );
    }
}

export default Register;