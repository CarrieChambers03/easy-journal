import React, { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from './authContext';

export default function EntryRoute(){
    const user = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        
    })
}