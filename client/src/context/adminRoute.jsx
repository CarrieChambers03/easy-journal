import React, { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from './authContext';

export default function AdminRoute() {
    const user = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if(user){
            fetch(`http://localhost:8000/role/get/${user.role}`, {
                method: 'GET',
            })
            .then(res => res.json())
            .then(data => {
                if(data.name !== 'admin'){
                    window.alert('Unauthorized');
                    navigate('/dashboard');
                }
            })
            .catch(err => {
                console.error(err);
            });
        }
    }, [user, navigate])

    if(!user){
        return <Navigate to="/login" />;
    };
    return <Outlet />;
}