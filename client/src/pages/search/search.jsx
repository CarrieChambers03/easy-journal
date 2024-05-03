import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import JournalEntries from '../../components/journalEntry/journalEntries.jsx';
import Navbar from '../../components/navbar.jsx';

async function getEntriesByDate(date){
    const entriesData = await fetch('http://localhost:8000/journalEntry/getByDate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({date: date}),
        credentials: 'include'
    });
    const entryList = await entriesData.json();
    return entryList.sort((a, b) => new Date(b.date) - new Date(a.date));
}

async function getEntriesByText(text){
    const entriesData = await fetch('http://localhost:8000/journalEntry/getByText', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({text: text}),
        credentials: 'include'
    });
    const entryList = await entriesData.json();
    return entryList.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export default function Search(){
    const [searchTerm, setSearchTerm] = useState('');
    const [entries, setEntries] = useState([]);
    const [showEntries, setShowEntries] = useState(false);
    const [type, setType] = useState('none');

    const location = useLocation();
    const input = location.state?.input;

    useEffect(() => {
        if(input){
            setSearchTerm(input);
        }
    }, [input]);

    useEffect(() => {
        setType(/^\d{4}-\d{2}-\d{2}$/.test(searchTerm) ? 'date' : (searchTerm.length > 0 ? 'text' : 'none'));
    }, [searchTerm]);

    function handleSearchChange(e){
        setSearchTerm(e.target.value);
    }

    function handleSearchSubmit(e){
        if(e){
            e.preventDefault();
        }
        
        if(type === 'date'){
            getEntriesByDate(searchTerm).then(entryList => {
                setEntries(entryList);
                setShowEntries(true);
            });
        } else if(type === 'text'){
            getEntriesByText(searchTerm).then(entryList => {
                setEntries(entryList);
                setShowEntries(true);
            });
        } else {
            setShowEntries(false);
            return;
        }
    }

    return(
        <div>
            <Navbar />
            <form onSubmit={handleSearchSubmit}>
                <input
                    type='text'
                    placeholder='enter date or text'
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <button type='submit'>Search</button>
                {showEntries &&
                    <JournalEntries list={entries} {...((type !== 'date') && { searchTerm })} />
                }
            </form>
        </div>
    )
}