import { useContext, useState } from "react"
import { UserContext } from "../../contexts/userContext"
import { Avatar, IconButton } from "@mui/material";
import AutoComplete from "../AutoComplete";
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import { signout } from "../../services/auth";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

const Header = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [showSide, setShowSide] = useState(false);

    const handleSignout = () =>{
        if(confirm("Are you sure you want to log out?")){
            signout();
        }
    }

    return <header className="flex items-center border-b-1 border-gray-300 p-5 gap-10 justify-between">
        <IconButton size="large" onClick={() => setShowSide(true)}>
            <MenuIcon fontSize="inherit"/>
        </IconButton>
        <AutoComplete className="max-w-[500px]" placeholder="Search people" />
        <div className="flex items-center gap-2">
            <Avatar src={user?.image} sx={{ width: 50, height: 50}}/>
            <IconButton size="large" onClick={() => navigate('/settings')}>
                <SettingsIcon fontSize="inherit"/>
            </IconButton>
            <IconButton size="large" onClick={handleSignout}>
                <LogoutIcon fontSize="inherit"/>
            </IconButton>
        </div>
        {showSide && <Sidebar close={() => setShowSide(false)}/>}
    </header>

}

export default Header