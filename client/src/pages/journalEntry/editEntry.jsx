import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

import EntryEditor from '../../components/journalEntry/journalEntryEditor.jsx';

import './editEntry.css';

async function getEntry(entryID){
    const entryData = await fetch(`http://localhost:8000/journalEntry/getById?id=${entryID}`, {
        method: 'GET',
        credentials: 'include'
    })
    const entry = await entryData.json();
    return entry;
}

export default function EditEntry(){
    let { entryID } = useParams();
    const [entry, setEntry] = useState({});
    const [message, setMessage] = useState('');
    const [showMessage, setShowMessage] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        getEntry(entryID).then(en => {
            if(en){
                setEntry(en);
            } else {
                setMessage('This entry doesn\'t exist');
                setShowMessage(true);
                console.error("an internal error occurred");
                setTimeout(() => {
                    navigate('/dashboard');
                }, 3000);
            }
        })
    }, [entryID, navigate]);

    function handleCancel(){
        navigate('/dashboard');
    }

    async function handleSubmit(data){
        delete data.userID;
        console.log(data);
        fetch('http://localhost:8000/journalEntry/edit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            credentials: 'include'
        }).then(res => {
            if(res.ok){
                setMessage('Entry updated!');
                setShowMessage(true);
                setTimeout(() => {
                    setShowMessage(false);
                    navigate(`/journalEntry/${entryID}`);
                }, 3000);
            } else if(res.status === 401){
                setMessage('You must be logged in to save an entry');
                setShowMessage(true);
                setTimeout(() => {
                    setShowMessage(false);
                    navigate('/login');
                }, 3000);
            } else {
                console.error('An internal error occurred');
            }
        })
    }

    return(
        <div className='edit-entry'>
            {showMessage && (
                <div>
                    {message}
                    <button onClick={() => {
                        setShowMessage(false);
                        navigate(`/journalEntry/${entryID}`);
                    }}><FontAwesomeIcon icon={faXmark} /></button>
                </div>
            )}
            {Object.keys(entry).length !== 0 &&
                <EntryEditor initialData={entry} onSubmit={handleSubmit} onCancel={handleCancel} />
            }
        </div>
    )
}