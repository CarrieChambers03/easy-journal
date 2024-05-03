import React, { useState } from 'react';

import Navbar from '../../components/navbar.jsx';
import JournalEntryList from '../../components/dashboard/journalEntryList.jsx';
import DashboardCalendar from '../../components/dashboard/calendar.jsx';
import MoodGraph from '../../components/dashboard/moodGraph.jsx';
import ActivityGraph from '../../components/dashboard/activityGraph.jsx';

import './dashboard.css';

export default function Dashboard(){
    const [moodType, setMoodType] = useState('positive');

    function toggleMood(){
        if(moodType === 'positive'){
            setMoodType('negative');
        } else {
            setMoodType('positive');
        }
    }

    return(
        <div className='dashboard'>
            <Navbar />
            <div className="top">
                <JournalEntryList />
                <DashboardCalendar />
            </div>
            <button className="switch-button" onClick={toggleMood}>Switch View</button>
            <div className="graphs">
                <MoodGraph />
                <ActivityGraph type={moodType} />
            </div>
        </div>
    )
}