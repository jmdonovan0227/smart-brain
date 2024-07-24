import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './ResetPassword.css';

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

const ResetPassword = () => {
    const [password_first_attempt, setPasswordFirst] = useState('');
    const [password_second_attempt, setPasswordSecond] = useState('');
    const [error_text, setErrorText] = useState('');
    const [errorState, setErrorState] = useState(false);
    const [passwordsValid, setPasswordsValid] = useState(false);
    const [passwordsMatch, setPasswordsMatch] = useState(false);
    const [passwordReset, setPasswordReset] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const query = useQuery();
    const token = query.get('token');

    const onFirstPasswordChange = (event) => {
        setPasswordFirst(event.target.value);
    };

    const onSecondPasswordChange = (event) => {
        setPasswordSecond(event.target.value);
    };

    const onPasswordButtonClick = () => {
        setShowPassword(!showPassword);
    };

    const onSubmitResetPassword = () => {
        if (passwordReset) {
            return;
        }

        if (password_first_attempt === password_second_attempt) {
            const minLength = 14;
            const hasUpperCase = /[A-Z]/.test(password_first_attempt);
            const hasLowerCase = /[a-z]/.test(password_first_attempt);
            const hasNumbers = /[0-9]/.test(password_first_attempt);
            const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password_first_attempt);

            if (password_first_attempt.length < minLength || !hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChars) {
                setErrorText('Passwords must be at least 14 characters long and have at least 1 upper case letter, lower case letter, number, and special character');
                setErrorState(true);
            } else {
                fetch('https://smart-brain-backend-zha7.onrender.com/api/reset_password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        token: token,
                        password: password_first_attempt
                    })
                }).then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Error resetting password');
                    }
                }).then(data => {
                    if (data) {
                        setPasswordReset(true);
                        setErrorText('');
                        setErrorState(false);
                    } else {
                        setErrorText('Error resetting password');
                        setErrorState(true);
                    }
                }).catch(error => {
                    setErrorText(error.message);
                    setErrorState(true);
                });
            }
        } else {
            setErrorText('Passwords must match');
            setErrorState(true);
        }
    };

    useEffect(() => {
        if (password_first_attempt === password_second_attempt) {
            setPasswordsMatch(true);

            const minLength = 14;
            const hasUpperCase = /[A-Z]/.test(password_first_attempt);
            const hasLowerCase = /[a-z]/.test(password_first_attempt);
            const hasNumbers = /[0-9]/.test(password_first_attempt);
            const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password_first_attempt);

            if (password_first_attempt.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChars) {
                setPasswordsValid(true);
            } else {
                setPasswordsValid(false);
            }
        } else {
            setPasswordsMatch(false);
        }
    }, [password_first_attempt, password_second_attempt]);

    return (
        <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
            <main className='w-75 pa4 black-80'>
                <div className="measure">
                    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                        <legend className="f1 fw6 ph0 mh0 text-center">Reset Password</legend>
                        <div className="mt3">
                            <label className="db fw6 lh-copy f6" htmlFor="password">New Password</label>
                            <input onChange={onFirstPasswordChange} className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100 style-input" type={showPassword ? 'text' : 'password'} name="password1" id="password1" />
                        </div>
                        <div className="mv3">
                            <label className="db fw6 lh-copy f6" htmlFor="password">Retype Password</label>
                            <input onChange={onSecondPasswordChange} className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100 style-input" type={showPassword ? 'text' : 'password'} name="password2" id="password2" />
                        </div>
                    </fieldset>
                    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                        <div>
                            <p><strong>Passwords Match:</strong> {passwordsMatch ? 'true' : 'false'}</p>
                        </div>
                        <div>
                            <p><strong>Valid Passwords:</strong> {passwordsValid ? 'true' : 'false'}</p>
                        </div>
                    </div>
                    <div className="center">
                        <button onClick={onPasswordButtonClick} className='b ph3 pv2 input-reset ba b--black bg-transparent pointer f6 dib mr3 style-buttons'>{showPassword ? 'Hide Password' : 'Show Password'}</button>
                        <input onClick={onSubmitResetPassword} disabled={passwordReset} className="b ph3 pv2 input-reset ba b--black bg-transparent pointer f6 dib style-buttons" type="submit" value="Set New Password" />
                    </div>
                </div>

                <div className='error-text'>
                    <p style={{color: 'green'}}>{passwordReset ? 'Password successfully reset!' : null}</p>
                    {errorState ? <div className='text-danger fs-italic'><p>{error_text}</p></div> : null}
                </div>
            </main>
        </article>
    );
};

export default ResetPassword;
