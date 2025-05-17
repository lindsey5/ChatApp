import { createContext, useContext, useEffect, useState } from "react";
import { UserContext } from "./userContext";
import * as signalR from '@microsoft/signalr';
import { fetchData } from "../services/api";

export const SignalContext = createContext();

export const SignalContextProvider = ({ children }) => {
    const [connection, setConnection] = useState(null);
    const { user } = useContext(UserContext);
    
    useEffect(() => {
        if(user?.email){
            const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(`http://localhost:5050/messagehub?email=${user?.email}`)
            .withAutomaticReconnect()
            .build();
        
            newConnection.start()
            .then(() => {
                console.log("Connected!");
            })
            .catch(e => console.log("Connection failed:", e));
        
            setConnection(newConnection);
        }
      }, [user?.email]);

      useEffect(() => {
        
      }, [user])
    
      const sendMessage = async (receiver, sender, message) => {
        if (connection) {
          await connection.invoke("SendMessage", receiver, sender, message);
        }
      };
  
    return (
        <SignalContext.Provider value={{ connection, sendMessage }}>
            {children}
        </SignalContext.Provider>
    )
};