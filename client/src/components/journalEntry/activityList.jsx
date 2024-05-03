import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

import './activityList.css';

async function listActivities(){
    return fetch('http://localhost:8000/activity/list', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        return data;
    })
    .catch(error => console.error('Error:', error));
}

async function getActivity(id){
    return fetch(`http://localhost:8000/activity/get/${id}`, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        return data;
    })
    .catch(err => console.log(err));
}

export default function ActivityList({inputActivities, onClose}){
    const [activitiesList, setActivitiesList] = useState([]);
    const [selectedActivities, setSelectedActivities] = useState([]);

    useEffect(() => {
        listActivities().then(data => {
            setActivitiesList(data);
        });
        Promise.all(inputActivities.map(id => getActivity(id)))
            .then(activities => {
                setSelectedActivities(activities);
            });
    }, [inputActivities]);

    function handleActivityClick(activity){
        if(selectedActivities.some(a => a.id === activity.id)){
            setSelectedActivities(selectedActivities.filter(a => a.id !== activity.id));
        } else {
            setSelectedActivities([...selectedActivities, activity]);
        }
    }

    return(
        <div>
            <button onClick={() => onClose(selectedActivities)}>
                <FontAwesomeIcon icon={faXmark} />
            </button>
            {activitiesList.map(activity => {
                return(
                    <div 
                        key={activity.id}
                        onClick={() => handleActivityClick(activity)}
                        className={selectedActivities.some(a => a.id === activity.id) ? 'selected' : ''}
                    >
                        {activity.name}
                    </div>
                )
            })}
        </div>
    )
}