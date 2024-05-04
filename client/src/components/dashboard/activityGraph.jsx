import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

import './activityGraph.css';

const moodTypes = {
    '8b9bdea4d98416caa98c9e67709bd809': 'positive',
    'f2393b3139b4d562773452de1d555a58': 'positive',
    '83f6bc66c0682eb76edd3af542266988': 'negative',
    '589ef8151502a71b3064b84286349604': 'negative'
}

function getRecentDates(){
    const dates = [];
    const endDate = new Date();
    const startDate = new Date()
    startDate.setMonth(endDate.getMonth() - 3);

    let currentDate = startDate;
    while(currentDate <= endDate){
        const newDate = `${String(currentDate.getFullYear())}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
        dates.push(newDate);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
}

async function getEntries(dates){
    const entryData = await fetch('http://localhost:8000/journalEntry/getByDate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({date: dates}),
        credentials: 'include'
    });
    const entries = await entryData.json();
    return entries;
}

async function getActivityName(activityID){
    const activityData = await fetch(`http://localhost:8000/activity/get/${activityID}`, {
        method: 'GET'
    });
    const activity = await activityData.json();
    return activity.name;
}

export default function ActivityGraph({type}){
    const [moodType, setMoodType] = useState(type);
    const [activityData, setActivityData] = useState([]);

    useEffect(() => {
        setMoodType(type);
    }, [type]);

    useEffect(() => {
        const activities = []; // array of objects with activity and count
        const dates = getRecentDates();
        getEntries(dates).then(entries => {
            entries.forEach(entry => {
                if( (moodType === 'positive' && moodTypes[entry.moodID] === 'positive') ||
                    (moodType === 'negative' && moodTypes[entry.moodID] === 'negative')){
                        entry.activityList.forEach(act => {
                            if(activities.some(a => a.activity === act)){
                                activities.find(a => a.activity === act).count++;
                            } else {
                                activities.push({activity: act, count: 1});
                            }
                        })
                }
            });
            const sorted = activities.sort((a, b) => b.count - a.count);
            const topActivities = sorted.slice(0, 5);
            const promises = topActivities.map(a => getActivityName(a.activity));
            Promise.all(promises).then(names => {
                const activitiesWithNames = topActivities.map((a, index) => {
                    return {activity: names[index], count: a.count}
                });

                setActivityData(activitiesWithNames);
            })
        });
    }, [moodType]);

    return(
        <div className='activity-graph'>
            <ResponsiveContainer width="75%" height={250}>
                <BarChart
                    data={activityData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <Bar dataKey="count" fill={type === 'positive' ? '#229954' : '#C0392B'} />
                    <XAxis dataKey="activity" stroke='#38156F' />
                    <YAxis dataKey="count" allowDecimals={false} stroke='#38156F' />
                </BarChart>
            </ResponsiveContainer>
            {activityData.length === 0 && <div className='empty-graph'>
                <p>Save a journal entry that has a {moodType} mood and some activity chosen to see its graph.</p>
                </div>}
        </div>
    )
}