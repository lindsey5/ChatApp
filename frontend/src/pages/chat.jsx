import { TextField, IconButton, Avatar } from "@mui/material"
import { useContext } from "react";
import SendIcon from '@mui/icons-material/Send';
import { useLocation } from "react-router-dom";
import { SignalContext } from "../contexts/signalContext";
import { useEffect, useState, useRef } from "react";
import { fetchData, updateData } from "../services/api";
import { UserContext } from "../contexts/userContext";
import { formatDateTime } from '../utils/utils'

const Chat = () => {
    const location = useLocation();
    const contact = location.state?.contact;
    const { user, loadContacts } = useContext(UserContext);
    const { connection, sendMessage } = useContext(SignalContext);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        const getMessagesAsync = async () => {
            const response = await fetchData(`/api/message/${contact.email}`)
            setMessages(response.messages);
        }
        if(contact?.email) getMessagesAsync();
    }, [contact])

     useEffect(() => {
        if(connection){
            connection.on("ReceiveMessage", async (data) => {
                if(data.sender == contact.id) {
                    setMessages(prev => [...prev, data])
                    await loadContacts();
                }
            })
        }
    }, [connection])

    const handleSendMessage = async () => {
        if(message) {
            setLoading(true)
            await sendMessage(contact.email, user.email, message)
            setMessages(prev => [...prev, { 
                sender: user.id,
                content: message,
                date_time: new Date() 
            }]);
            await loadContacts();
            await updateData(`/api/message/seen?senderEmail=${contact.email}`);
            setMessage('')
            setLoading(false)
        }
    }

    useEffect(() => {
        if (bottomRef.current && messages.length > 0) {
            bottomRef.current.scrollIntoView();
        }
    }, [messages]);

    return <main className="h-[87%] flex flex-col">
        <div className="bg-[url(bg.jpg)] bg-cover bg-center flex flex-col flex-grow p-10 min-h-0 overflow-y-auto">
            {contact && <div className="w-full flex flex-col justify-center items-center gap-5">
                <Avatar src={`data:image/jpeg;base64,${contact?.image}`} sx={{ width: 80, height: 80}}/>
                <h1 className="font-bold text-2xl">{contact?.firstname} {contact?.lastname}</h1>
            </div>}
            {messages && messages.map((message, index) => <div 
                ref={index === messages.length -1 ? bottomRef : undefined} 
                key={index} 
                className={`gap-3 flex w-full mt-10 ${message.sender === user?.id ? 'justify-end' : 'justify-start'}`}
            >
                {message.sender !== user.id && <Avatar 
                    src={`data:image/jpeg;base64,${contact?.image}`} 
                    sx={{ width: 50, height: 50}}
                />}
                <div>
                    <div className={`rounded-lg ${message.sender === user.id ? 'bg-[#1c18fa] text-white' : 'bg-white border-1 border-gray-100'} p-5`}>
                        <p className="text-lg">{message.content}</p>
                    </div>
                    <p className="text-sm mt-1">{formatDateTime(message.date_time)}</p>
                </div>
            </div>)}

        </div>
        <div className="flex w-full border-t-1 border-gray-300 p-5">
            <TextField 
                placeholder="Send a message" 
                sx={{ flexGrow: 1}} 
                disabled={!contact} 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <IconButton 
                size="large" 
                disabled={!contact || loading}
                onClick={handleSendMessage}
            >
                <SendIcon fontSize="inherit" sx={{ color: '#1c18fa'}}/>
            </IconButton>
        </div>
    </main>
}

export default Chat