import React from 'react';
import { useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faMagnifyingGlass, faPlus } from '@fortawesome/free-solid-svg-icons';

import './navbar.css'

export default function Navbar(){
    const navigate = useNavigate();
    return(
        <div className="navbar">
            <FontAwesomeIcon icon={faHouse} onClick={() => navigate('/dashboard')} />
            <FontAwesomeIcon icon={faMagnifyingGlass} onClick={() => navigate('/search')} />
            <FontAwesomeIcon icon={faPlus} onClick={() => navigate('/journalEntry/new')} />
        </div>
    )
}