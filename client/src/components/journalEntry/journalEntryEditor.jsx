import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import ActivityList from './activityList.jsx';
import MoodSelector from './moodSelector.jsx';

export default function EntryEditor ({ initialData, onSubmit, onCancel }) {
    const [data, setData] = useState(initialData);
    const [showActivities, setShowActivities] = useState(false);
    const [activityObjects, setActivityObjects] = useState([]);
    const [activities, setActivities] = useState(data.activityList);
    const [date, setDate] = useState(data.date);
    const [mood, setMood] = useState(data.moodID);

    useEffect(() => {
        setData(
            {...initialData, date: new Date(initialData.date).toISOString()}
        );
    }, [initialData]);

    function handleChange(e){
        if(e.target.name === 'activityObjects'){
            const newActivityArray = [];
            e.target.value.forEach(activity => {
                newActivityArray.push(activity.id);
            });
            setActivities(newActivityArray);
            setData({
                ...data,
                activityList: newActivityArray
            });
        } else {
            setData({
                ...data,
                [e.target.name]: e.target.value
            });
        }
    };

    function handleSubmit(e){
        e.preventDefault();
        onSubmit(data);
    };

    function handleCancel(e){
        e.preventDefault();
        setData(initialData);
        if(onCancel){ //ensures onCancel is a function
            onCancel();
        }
    }

    function handleActivityListClose(selectedActivities){
        setActivityObjects(selectedActivities);
        setShowActivities(false);
        handleChange({target: {name: 'activityObjects', value: selectedActivities}})
    }

    function handleDateChange(newDate){
        let isoDate = new Date(newDate).toISOString();
        setDate(isoDate);
        handleChange({target: {name: 'date', value: isoDate}})
    }

    function handleMoodChange(newMood){
        setMood(newMood);
        handleChange({target: {name: 'moodID', value: newMood}})
    }

    return(
        <form onSubmit={handleSubmit}>
            <MoodSelector mood={mood} onMoodChange={handleMoodChange} />

            <label htmlFor='textInput'>text:</label>
            <input
                type="text"
                id="textInput"
                name="textInput"
                value={data.textInput}
                onChange={handleChange}
            />

            <div className="activityList" onClick={() => setShowActivities(true)}>
                Activities: 
                <div>{activityObjects.map(a => {
                    return (
                        <span key={a.id}>
                            {a.name}
                        </span>
                    );
                })}
                </div>
            </div>
            {showActivities && (
                <ActivityList
                    inputActivities={activities}
                    onClose={handleActivityListClose}
                 />
            )
            }

            <label htmlFor="date">Date:</label>
            <DatePicker
                selected={date}
                onChange={handleDateChange} />

            <button type="submit">Save</button>
            <button type="button" onClick={handleCancel}>Cancel</button>
        </form>
    )
}