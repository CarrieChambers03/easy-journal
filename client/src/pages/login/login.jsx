import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import './login.css';

export default function Login(){
    // set up the form
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // error message
    const [message, setMessage] = useState('');
    const [showMessage, setShowMessage] = useState(false);

    const history = useNavigate();

    async function handleLogin(event){
        event.preventDefault();
        const data = {
            email,
            password
        };

        // send the data to the server
        fetch('http://localhost:8000/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            credentials: 'include'
        })
        .then(response => {
            if (response.ok){
                history('/dashboard');
            } else {
                response.json().then(data => {
                    setMessage('Login failed: ' + data.message || 'Unknown error');
                    setShowMessage(true);
                })
            }
        })
        .catch(error => {
            console.error(error);
        });
    }

    return (
        <div className="login">
            {
                showMessage && (
                    <div className="message">
                        {message}
                        <button className="icon-button" onClick={() => setShowMessage(false)}>
                            <FontAwesomeIcon icon={faXmark} className="x-icon" />
                        </button>
                    </div>
                )
            }
            <form onSubmit = {handleLogin}>
                <h2>Sign In</h2>
                <div className="input-group">
                    <label>Email:</label>
                    <input type = "email" name= "email" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="input-group">
                    <label>Password:</label>
                    <input type = "password" name="password" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <p>Don't have an account? <br /> <Link to="/register">Register</Link> instead.</p>
                <button type="submit">Sign In</button>
            </form>
        </div>
    );
}