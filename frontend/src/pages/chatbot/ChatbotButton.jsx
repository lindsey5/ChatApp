import { Avatar } from "@mui/material"
import { useNavigate } from "react-router-dom"

const ChatbotButton = () => {
    const navigate = useNavigate();

    return <button 
            className="cursor-pointer fixed left-2 bottom-2 p-2 rounded-full shadow-lg shadow-[#1c18fa]"
            onClick={() => navigate('/chatbot')}
        >
           <Avatar 
                src="/robot.png"
                sx={{ width: 60, height: 60 }}
            />
        </button>
}

export default ChatbotButton