import React, { useState, useEffect } from 'react';

import JournalEntries from '../journalEntry/journalEntries.jsx';

//getting user's entry list
async function recentEntries(){
    const entriesData = await fetch('http://localhost:8000/journalEntry/myList', {
        method: 'GET',
        credentials: 'include'
    });
    let entryList = await entriesData.json()
    return entryList.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0,5);
}


//displaying the user's entry list
export default function JournalEntryList(){
    const [entries, setEntries] = useState([]);

    useEffect(() => {
        recentEntries().then(entryList => {
            if(entryList){
                setEntries(entryList);
            } else {
                console.error("an internal error occurred");
            }
        });
    }, [])

    return (
        <div>
            <JournalEntries list={entries} />
        </div>
    );
}