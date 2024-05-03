import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useNavigate } from 'react-router-dom';

export default function DashboardCalendar(){
    const navigate = useNavigate();
    
    function handleDateClick(date){
        const searchDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        navigate(`/search/`, { state: { input: searchDate } });
    }

    return <Calendar onClickDay={handleDateClick} />
}