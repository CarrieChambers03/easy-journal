import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Navbar from '../../components/navbar.jsx';

import './viewEntry.css';

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

async function getEntry(entryID){
    const entryData = await fetch(`http://localhost:8000/journalEntry/getById?id=${entryID}`, {
        method: 'GET',
        credentials: 'include'
    })
    const entry = await entryData.json();
    return entry;
}

async function getMood(moodID){
    const moodData = await fetch(`http://localhost:8000/mood/get/${moodID}`, {
        method: 'GET'
    })
    const mood = await moodData.json();
    return mood.name;
}

async function getActivity(activityID){
    const activityData = await fetch(`http://localhost:8000/activity/get/${activityID}`, {
        method: 'GET'
    })  
    const activity = await activityData.json();
    return activity.name;
}

export default function ViewEntry(){
    let { entryID } = useParams();
    const [entry, setEntry] = useState({});
    const [mood, setMood] = useState('none');
    const [activities, setActivities] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        getEntry(entryID).then(en => {
            if(en){
                setEntry(en);

                if(en.moodID !== ""){
                    getMood(en.moodID).then(m => {
                        if(m){
                            setMood(m);
                        } else {
                            console.error("an internal error occurred");
                        }
                    });
                }

                const activityNames = [];
                en.activityList.forEach(activity => {
                    activityNames.push(getActivity(activity));
                });
                Promise.all(activityNames).then(activityNames => {
                    setActivities(activityNames);
                });

            } else {
                console.error("an internal error occurred");
            }
        });
    }, [entryID]);

    function handleEdit(){
        navigate(`/journalEntry/edit/${entryID}`, {state: {entryID: entryID}});
    }

    function handleDelete(){
        fetch(`http://localhost:8000/journalEntry/delete/`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: entryID})
        }).then(res => res.json())
        .then(data => {
            if(data.message === "Entry deleted"){
                navigate("/dashboard");
                return;
            } else {
                console.error("an internal error occurred");
            }
        })
    }

    return(
        <div className='view-entry'>
            <Navbar />
            <div className='box'>
                <div className='date-and-mood'>
                    <h1>{new Date(entry.date).toLocaleDateString()}</h1>
                    <img src={moodIcons[mood]} alt={mood} />
                </div>
                <div className='activities-and-text'>
                    <div className='activities'>
                        {activities.map((activity, index) => {
                            return <span key={index}>{activity}</span>
                        })}
                    </div>
                    <div className='text'>
                        <p>{entry.textInput}</p>
                    </div>
                </div>
                <div className='buttons'>
                    <button className='edit' type="button" onClick={handleEdit}>Edit</button>
                    <button className='delete' type="button" onClick={handleDelete}>Delete</button>
                </div>
            </div>
        </div>
    )
}