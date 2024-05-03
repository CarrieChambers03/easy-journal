import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

import './moodGraph.css';

const monthNames = {
    '01': 'Jan',
    '02': 'Feb',
    '03': 'Mar',
    '04': 'Apr',
    '05': 'May',
    '06': 'Jun',
    '07': 'Jul',
    '08': 'Aug',
    '09': 'Sep',
    '10': 'Oct',
    '11': 'Nov',
    '12': 'Dec'
}

const moodValues = {
    'f2393b3139b4d562773452de1d555a58': 5,
    '8b9bdea4d98416caa98c9e67709bd809': 4,
    'db65e2551349382b77a6f46a87ffb1f3': 3,
    '589ef8151502a71b3064b84286349604': 2,
    '83f6bc66c0682eb76edd3af542266988': 1
}

const valueEmojis = {
    5: 'U+1F604',
    4: 'U+1F60A',
    3: 'U+1F610',
    2: 'U+1F641',
    1: 'U+1F616'
}

function getMonthDates(){
    const months = [];
    for(let i = 0; i < 12; i++){
        const monthDates = [];
        const firstDay = new Date();
        firstDay.setMonth(firstDay.getMonth() - i, 1);
        const lastDay = new Date();
        if(i !== 0){
            lastDay.setMonth(lastDay.getMonth() - i + 1, 0);
        }
    
        for(let j=firstDay.getDate(); j <= lastDay.getDate(); j++){
            monthDates.push(new Date(firstDay.getFullYear(), firstDay.getMonth(), j));
        }
    
        const dates = monthDates.map(date => {
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    
        });
    
        const key = String(firstDay.getMonth()+1).padStart(2, '0');
        months.push({[key]: dates})
    }
    return months;
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

function calcAverage(entries){
    const numbers = entries.map(entry => moodValues[entry.moodID]);
    return numbers.reduce((a, b) => a+b, 0) / numbers.length;
}

export default function MoodGraph(){
    const [axisData, setAxisData] = useState([]);
    const [moodData, setMoodData] = useState([]);

    useEffect(() => {
        async function fetchEntries(){
            const months = getMonthDates();

            const promises = months.map((month) => {
                const [monthNumber, dates] = Object.entries(month)[0];
                return getEntries(dates).then(entries => {
                    if(entries.length > 0){
                        return {month: monthNumber, mood: calcAverage(entries)};
                    } else {
                        return {month: monthNumber, mood: null};
                    }
                })
            });

            const moodAverage = await Promise.all(promises);


            const axis = months.map(m => {
                const [monthNumber] = Object.entries(m)[0];
                return monthNumber; 
            });
            setAxisData(axis.reverse())
            setMoodData(moodAverage.reverse());
        }
        
        fetchEntries()
    }, []);

    return (
        <div className="mood-graph">
            <ResponsiveContainer width="100%" height={250}>
                <LineChart
                    data={moodData}
                    margin={{
                        top: 5,
                        right: 20,
                        left: 20,
                        bottom: 5
                    }}
                >
                    <defs>
                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#A93226" stopOpacity={1}/>
                            <stop offset="100%" stopColor="#1E8449" stopOpacity={1}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid 
                        strokeDasharray="3 3" 
                        stroke='#603D97'
                        strokeOpacity={0.25}
                    />
                    <Line type="monotone" dataKey="mood" stroke="url(#colorUv)" />
                    <XAxis 
                        dataKey="month"
                        stroke='#38156F'
                        tick={{fontSize: 12}}
                        ticks={axisData}
                        tickFormatter={(value) => {
                            return monthNames[value];
                        }}
                    />
                    <YAxis
                        dataKey="mood"
                        stroke='#38156F'
                        tick={{fontSize: 12}}
                        ticks={[1, 2, 3, 4, 5]}
                        domain={[1, 5]}
                        tickFormatter={(value) => {
                            return String.fromCodePoint(parseInt(valueEmojis[value].substring(2), 16))
                        }}
                    />
                </LineChart>
                    
            </ResponsiveContainer>
        </div>
    )
}