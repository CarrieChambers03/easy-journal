import React, { useState, useEffect } from 'react';

import bad1 from '../../assets/bad-full.png';
import bad2 from '../../assets/bad-white.png';
import good1 from '../../assets/good-full.png';
import good2 from '../../assets/good-white.png';
import great1 from '../../assets/great-full.png';
import great2 from '../../assets/great-white.png';
import horrid1 from '../../assets/horrid-full.png';
import horrid2 from '../../assets/horrid-white.png';
import meh1 from '../../assets/meh-full.png';
import meh2 from '../../assets/meh-white.png';

const moods = {
    'Horrible': {
        id: '83f6bc66c0682eb76edd3af542266988',
        'sel': horrid1,
        'none': horrid2
    },
    'Bad': {
        id: '589ef8151502a71b3064b84286349604',
        'sel': bad1,
        'none': bad2
    },
    'Meh': {
        id: 'db65e2551349382b77a6f46a87ffb1f3',
        'sel': meh1,
        'none': meh2
    },
    'Good': {
        id: '8b9bdea4d98416caa98c9e67709bd809',
        'sel': good1,
        'none': good2
    },
    'Great': {
        id: 'f2393b3139b4d562773452de1d555a58',
        'sel': great1,
        'none': great2
    }
}

async function getMoodName(moodID){
    if(moodID !== ""){
        return fetch(`http://localhost:8000/mood/get/${moodID}`, {
        method: 'GET',
        })
        .then(response => response.json())
        .then(data => {
            return data.name;
        })
        .catch(err => console.log(err));
    } else {
        return '';
    }
    
}

export default function MoodSelector({ mood, onMoodChange }){
    const [selectedMood, setSelectedMood] = useState(mood);
    const [moodName, setMoodName] = useState('');

    useEffect(() => {
        getMoodName(selectedMood).then(name => setMoodName(name));
    }, [selectedMood]);

    return(
        <div>
            {Object.keys(moods).map(mood => {
                return(
                    <img
                        key={mood}
                        src={moodName === mood ? moods[mood].sel : moods[mood].none}
                        onClick={() => {
                            setSelectedMood(moods[mood].id);
                            onMoodChange(moods[mood].id);
                        }}
                        alt={`${mood}: ${moodName === mood ? 'coloured' : 'white'}`}
                    />
                )
            })}
        </div>
    )
}