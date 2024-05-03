import { useContext, createContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {if(location.pathname !== '/login' && location.pathname !== '/register'){
        fetch('http://localhost:8000/authenticate', {
            method: 'GET',
            credentials: 'include'
        })
        .then(res => res.json())
        .then(data => {
            if(data.auth){
                setUser(data.user);
            } else {
                navigate('/login');
            }
            setLoading(false);
        })
        .catch(err => {
        console.error(err);
        setLoading(false);
        });
    } else {
        setLoading(false);
    }}, [location.pathname, navigate]);

    if(loading) {
        return <div>Loading...</div>
    }
    return <AuthContext.Provider value={{user}} >{children}</AuthContext.Provider>;
}

export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext);
}