import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { Link, Outlet } from 'react-router-dom';
import './Navigation.css';

const Navigation = ({ onRouteChange, isSignedIn }) => {
    const [showModal, setShowModal] = useState(false);
    // use state to show error message as a div below password if we enter the wrong email or password!
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => showPassword ? setShowPassword(false) : setShowPassword(true);
    const handleShowModal = () => setShowModal(true);

    const handleCloseModal = () =>  {
        removeErrorStatus();
        setShowModal(false);
    };

    const addErrorStatus = () => setError(true);

    const removeErrorStatus = () => setError(false);

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleAccountDeletion = () => {
        // call deletion endpoint on backend
        fetch('https://smart-brain-7iex.onrender.com/api/delete', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              email: email,
              password: password
            })
          })
          .then(response => {
            if(response.ok) {
                return response.json();
            }
            else {
                addErrorStatus();
                throw new Error('Could not delete user, rejected with code: ' + response.statusText);
            }
           })
          .then(deletedUser =>  {
            //
            handleCloseModal();
            onRouteChange('signout');
           })
          .catch(err => {
            addErrorStatus();
          });
    };

    if(isSignedIn) {
        return (
            <div>
                <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
                    <p onClick={() => onRouteChange('signout')} className='f3 link dim black underline pa3 pointer'>Sign Out</p>
                    <p onClick={handleShowModal} className='f3 link dim black underline pa3 pointer'>Delete Account</p>
                    <div>
                        <Modal show={showModal} onHide={handleCloseModal} backdrop='static' centered className='modal-background'>
                            <Modal.Header className='bg-dark text-white'>
                                <Modal.Title className='w-100 fs-3 d-flex align-items-center justify-content-center adjust-modal-title modal-text-styling modal-header-text-size'>Delete Account</Modal.Title>
                                <button onClick={handleCloseModal} type="button" className="btn-close btn-close-white" aria-label="Close"></button>
                            </Modal.Header>
                            <Modal.Body className='bg-dark'>
                                <p className='text-white fs-5 modal-box-background modal-text-styling text-center '>Thank you trying Smart Brain. Enter your email address and password to confirm  account deletion.</p>
                                <Form>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <Form.Label className='text-white'>Email address</Form.Label>
                                        <Form.Control
                                            type="email"
                                            onChange={handleEmailChange}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <Form.Label className='text-white'>Password</Form.Label>
                                        <Form.Control
                                            type={showPassword ? 'text' : 'password'}
                                            onChange={handlePasswordChange}
                                        />
                                    </Form.Group>
                                    <Button variant='secondary' onClick={toggleShowPassword}>{showPassword ? 'Hide Password' : 'Show Password'}</Button>
                                </Form>
                            </Modal.Body>

                            <Modal.Footer className='modal-box-background bg-dark text-white'>
                                <Button variant='secondary' onClick={handleCloseModal}>Cancel</Button>
                                <Button variant='primary' onClick={handleAccountDeletion}>Confirm</Button>
                                {
                                error ? (<div className='error-text'><p>Invalid Email or Password. Please Try Again.</p></div>) : (<div className='error-text'></div>)
                                }
                            </Modal.Footer>
                        </Modal>
                    </div>
                </nav>

                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%'}}>
                    <Outlet />
                </div>
            </div>
        );
    }
    else {
        return (
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', border: '2px solid black'}}>
                <nav style={{display: 'flex', justifyContent: 'flex-end', width: '100%'}}>
                    <Link to='/' style={{textDecoration: 'none'}}><p onClick={() => onRouteChange('signin')} className='f3 link dim black underline pa3 pointer'>Sign In</p></Link>
                    <Link to="/" style={{textDecoration: 'none'}}><p onClick={() => onRouteChange('register')} className='f3 link dim black underline pa3 pointer'>Register</p></Link>
                </nav>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%'}}>
                    <Outlet />
                </div>
            </div>
        );
    }
}

export default Navigation;