import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchData } from "../services/api";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState();
    const navigate = useNavigate();
    const [contacts, setContacts] = useState([]);

    const loadContacts = async () => {
        const response = await fetchData('/api/contact')
        setContacts(response.contacts)
    }

    useEffect(() => {
        loadContacts();
    }, [])
    
    useEffect(() => {
        const getUser = async () => {
            const details = await fetchData('/api/user')
            if(details.success) setUser(details.user) 
            else{
                 localStorage.removeItem('token');
                 navigate('/', { replace: true })
            }
        }
        getUser();
    }, [])
  
    return (
        <UserContext.Provider value={{ user, contacts, loadContacts }}>
            {children}
        </UserContext.Provider>
    )
};