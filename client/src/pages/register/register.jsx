import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import './register.css';

export default function Register(){
    // set up the form
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // set up the message
    const [message, setMessage] = useState('');
    const [showMessage, setShowMessage] = useState(false);

    const history = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();
        const data = {
            email,
            password
        }

        // send the data to the server
        fetch('http://localhost:8000/user/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (response.ok){
                setMessage('Registration successful');
                setShowMessage(true);
                setTimeout(() => {
                    setShowMessage(false);
                    history('/login');
                }, 5000);
            } else {
                response.json().then(data => {
                    setMessage('Registration failed: ' + data.message || 'Unknown error');
                    setShowMessage(true);
                    setTimeout(() => {setShowMessage(false)}, 5000);
                })
            }
        })
        .catch(error => {
            console.error(error);
        });
    }

    return (
        <div className="register">
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
            <form onSubmit = {handleSubmit}>
                <h2>Sign Up</h2>
                <div className='input-group'>
                    <label>Email:</label>
                    <input type = "email" name="email" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className='input-group'>
                    <label>Password:</label>
                    <input type = "password" name="password" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <p>Already have an account? <br />
                    <Link to="/login">Log-in</Link> instead.</p>
                <button type="submit">Sign Up</button>
            </form>
        </div>
    )
}