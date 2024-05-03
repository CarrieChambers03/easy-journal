import React, { useState, useEffect } from 'react';
import useOnEntryClick from '../../services/onEntryClick.jsx';

import './journalEntries.css';

//emoticons
import great from '../../assets/great-full.png';
import good from '../../assets/good-full.png';
import meh from '../../assets/meh-full.png';
import bad from '../../assets/bad-full.png';
import horrid from '../../assets/horrid-full.png';
import none from '../../assets/meh-white.png';

const moodIcons = {
    Great: great,
    Good: good,
    Meh: meh,
    Bad: bad,
    Horrible: horrid,
    none: none
}

async function getMood(moodID){
    let moodData = await fetch(`http://localhost:8000/mood/get/${moodID}`, {	
        method: 'GET'	
    });
    return new Promise((resolve, reject) => {
        moodData.json().then(mood => {
            resolve(mood.name);
        });
    })
}

async function getActivity(activityID){
    let data = await fetch(`http://localhost:8000/activity/get/${activityID}`, {
        method: 'GET'
    });
    return data.json();
}

function getTextPart(text, searchedText){
    const textWords = text.split(' ');
    const searchedWords = searchedText.split(' ');

    const index = textWords.indexOf(searchedWords[0]);
    const start = Math.max(0, index - 3); //if the word is less than on index 3, it will default to index 0
    const end = Math.min(textWords.length, index + (searchedWords.length - 1) + 3 + 1); //have to add + 1 since the end is not included in slice

    const result = textWords.slice(start, end).join(' ');
    return `...${result}...`;
}

export default function JournalEntries({list, searchTerm}){
    const [entries, setEntries] = useState(list);
    const [search, setSearch] = useState(searchTerm);
    const [texts, setTexts] = useState({});
    const [moods, setMoods] = useState({});
    const [activities, setActivities] = useState({});

    useEffect(() => {
        setEntries(list);
        if(searchTerm){
            setSearch(searchTerm);
        }
    }, [list]);

    useEffect(() => {
        entries.forEach(entry => {
            if (entry.moodID !== ""){
                getMood(entry.moodID).then(moodName => {
                    setMoods(prevMoods => ({...prevMoods, [entry.id]: moodName}))
                })
            }

            const activityNames = []; 
            entry.activityList.forEach(activity => {
                activityNames.push(getActivity(activity));
            })
            Promise.all(activityNames).then(activityNames => {
                setActivities(prevActivities => ({...prevActivities, [entry.id]: activityNames}));
            });

            if(searchTerm){
                const text = getTextPart(entry.textInput, search);
                setTexts(prevTexts => ({...prevTexts, [entry.id]: text}));
            }
        });
    }, [entries]);

    const onEntryClick = useOnEntryClick();

    return (
        <div className={`journal-entries${searchTerm ? '-with-text' : ''}`}>
            {entries.map(entry => {
                const moodName = (entry.moodID === "") ? "none" : moods[entry.id];
               return ( <div key = {entry.id} className = "entryBlock" onClick={() => onEntryClick(entry.id)}>
                    <img src={moodIcons[moodName]} alt={moodName} />
                    <div className="textDetails">
                        <p className='date'>{new Date(entry.date).toLocaleDateString()}</p>
                        <div className="activities">
                            {activities[entry.id]?.length > 0 ? (activities[entry.id].slice(0, 3).map((activity, index) => { return <span key={index} className="activity-label">{activity.name}</span>;})) : null }
                        </div>
                        {searchTerm &&
                            <p>{texts[entry.id]}</p>
                        }
                    </div>
                </div>);
            })}
        </div>
    );
}