import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function RefreshToken(){
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        async function refresh(){
            console.log('called function')
            const response = await fetch('http://localhost:8000/user/refresh', {
                method: 'GET',
                credentials: 'include'
            });
            if(response.status === 401){
                navigate('/login');
                return;
            } else if (response.status === 403){
                navigate('/login');
                return;
            } else {
                console.log('Token refreshed');
            }
        }

        function handleClick() {
            console.log('click');
            if(location.pathname === '/login' || location.pathname === '/register'){
                return;
            }
            refresh().catch(console.error);
        }

        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, [location, navigate]);

    return null;
}