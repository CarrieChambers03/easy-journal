import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

import EntryEditor from '../../components/journalEntry/journalEntryEditor.jsx';

import './createEntry.css';

export default function CreateEntry(){
    const [message, setMessage] = useState('');
    const [showMessage, setShowMessage] = useState(false);

    const emptyEntry = {
        textInput: '',
        activityList: [],
        moodID: "",
        date: new Date()
    }
    const navigate = useNavigate();

    async function handleSubmit(data){
        fetch('http://localhost:8000/journalEntry/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            credentials: 'include'
        })
        .then(response => {
            if(response.ok){
                setMessage('Entry saved!');
                setShowMessage(true);
                setTimeout(() => {
                    setShowMessage(false);
                    navigate('/dashboard');
                }, 3000);
            } else if (response.status === 401){
                setMessage('You must be logged in to save an entry');
                setShowMessage(true);
                setTimeout(() => {
                    setShowMessage(false);
                    navigate('/login');
                }, 3000);
            } else {
                return response.json().then(data => {
                    setMessage('Failed to save entry: ' + data.message || 'Unknown error');
                    setShowMessage(true);
                })
            }
        })
        .catch(
            error => {
                setMessage('Failed to save entry: ' + error.message || 'Unknown error');
                setShowMessage(true);
        });
    }

    function handleCancel(){
        navigate('/dashboard');
    }

    return (
        <div className='create-entry'>
            {
                showMessage && (
                    <div>
                        {message}
                        <button onClick={() => {
                            setShowMessage(false);
                            if(message.includes('saved')){
                                navigate('/dashboard');
                            }
                            }}>
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                    </div>
                )
            }
            <EntryEditor initialData={emptyEntry} onSubmit={handleSubmit} onCancel={handleCancel} />            
        </div>

    );
}