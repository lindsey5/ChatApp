import { Avatar, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { fetchData } from "../services/api";
import { useNavigate } from "react-router-dom";


const AutoComplete = ({ className, placeholder }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([]);
    const [isFocused, setIsFocused] = useState(false);
    const navigate = useNavigate();

    const searchUsers = async () => {
        if(searchTerm){
             const response = await fetchData(`/api/user/users?searchTerm=${searchTerm}`);
             setUsers(response.users)
        }else{
            setUsers([])
        }
    }

    useEffect(() => {
        const delayDebounce = setTimeout(async () => {
          await searchUsers();
        }, 300);
      
        return () => clearTimeout(delayDebounce);
      }, [searchTerm]);

    const handleBlur = () => {
        setTimeout(() => {
        setIsFocused(false);
        }, 200); 
  };

  const handleClick = (people) => {
    navigate('/chat',{ state: { contact : people } })
  }

    return <div className={`relative flex-grow ${className}`}>
        <TextField 
            fullWidth
            placeholder={placeholder}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
        />
        {isFocused && users.length > 0 && (
        <div className="inset-x-0 absolute bg-white z-10 border-1 border-gray-200 max-h-[400px] overflow-y-auto">
          {users.map((user, index) => (
            <div key={index} className="p-2 flex gap-2 items-center h-[70px] hover:bg-gray-200 cursor-pointer" onClick={() => handleClick(user)}>
              <Avatar src={`data:image/jpeg;base64,${user.image}`} sx={{ width: '40px', height: '40px' }} />
              <h1>{`${user.firstname} ${user.lastname}`}</h1>
            </div>
          ))}
        </div>
      )}

    </div>
}

export default AutoComplete