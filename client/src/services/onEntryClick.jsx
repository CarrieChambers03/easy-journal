import { useNavigate } from 'react-router-dom';

export default function useOnEntryClick(){
    const navigate = useNavigate();
    function handleClick(entryID){
        navigate(`/journalEntry/${entryID}`);
    }

    return handleClick;
};