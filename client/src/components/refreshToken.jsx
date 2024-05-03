import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function RefreshToken(){
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        async function refresh(){
            console.log('called function')
            if(location.pathname !== '/login' && location.pathname !== '/register'){
                console.log('passed if function')
                fetch('http://localhost:8000/user/refresh', {
                    method: 'GET',
                    credentials: 'include'
                })
                .then(response => {
                    console.log(response.status)
                    if(response.status === 401){
                        navigate('/login');
                    } else if (response.status === 403){
                        navigate('/login');
                    } else {
                        console.log('Token refreshed');
                    }
                })
                .catch(err => console.log(err));
            }
        }

        function handleClick() {
            console.log('click');
            refresh().catch(err => console.log(err));
        }

        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, [location, navigate]);

    return null;
}