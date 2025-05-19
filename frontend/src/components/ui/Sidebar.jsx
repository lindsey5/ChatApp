import { useContext } from "react"
import { UserContext } from "../../contexts/userContext"
import { Avatar, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { updateData } from "../../services/api";
import ChatbotButton from "../../pages/chatbot/ChatbotButton";
import CloseIcon from '@mui/icons-material/Close';

const Sidebar = ({ close }) => {
    const { contacts, user, loadContacts } = useContext(UserContext);
    const navigate = useNavigate();

    const handleClick = async (people) => {
        navigate('/chat',{ state: { contact : people } })
        await updateData(`/api/message/seen?senderEmail=${people.email}`)
        loadContacts();
    }

    return <aside className="z-10 fixed left-0 inset-y-0 bg-white w-[300px] py-10 border-r-1 border-gray-300 flex flex-col gap-5">
        <div className="flex items-center justify-between">
            <h1 className="ml-5 font-bold text-3xl">Messages</h1>
            <IconButton size="large" onClick={close}>
                <CloseIcon fontSize="inherit"/>
            </IconButton>
        </div>
        <div className="flex-grow min-h-0 overflow-y-auto">
            {contacts.map(contact => {
                const isSeen = contact.latestMessage.receiver === user.id && !contact.latestMessage.is_seen

                return <div 
                    key={contact.id}
                    className="hover:bg-gray-200 p-5 flex gap-5 cursor-pointer relative" 
                    onClick={() => handleClick(contact.contact_user)}
                >
                <Avatar 
                    src={`data:image/jpeg;base64,${contact.contact_user.image}`}
                    sx={{ width: 60, height: 60 }}
                />
                <div className="w-full flex flex-col gap-2 overflow-hidden">
                    <h1 className={`truncate text-lg ${isSeen && 'font-bold'}`}>{contact.contact_user.firstname} {contact.contact_user.lastname}</h1>
                    <p className={`truncate ${isSeen && 'font-bold'}`}>{contact.latestMessage.sender == user.id && 'You:' } {contact.latestMessage.content}</p>
                </div>
                {isSeen && <div className="w-[13px] h-[13px] bg-red-500 absolute rounded-full top-1/2 right-5"/>}
                </div>
            })}
        </div>
        <ChatbotButton />
    </aside>
}

export default Sidebar