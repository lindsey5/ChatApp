import { useContext } from "react"
import { UserContext } from "../../contexts/userContext"
import { Avatar, IconButton } from "@mui/material";
import AutoComplete from "../AutoComplete";
import LogoutIcon from '@mui/icons-material/Logout';
import { signout } from "../../services/auth";

const Header = () => {
    const { user } = useContext(UserContext);

    const handleSignout = () =>{
        if(confirm("Are you sure you want to log out?")){
            signout();
        }
    }

    return <header className="flex items-center border-b-1 border-gray-300 p-5 gap-10 justify-between">
        <AutoComplete className="max-w-[500px]" placeholder="Search people" />
        <div className="flex items-center gap-2">
            <Avatar src={user?.image} sx={{ width: 50, height: 50}}/>
            <IconButton size="large" onClick={handleSignout}>
                <LogoutIcon fontSize="inherit"/>
            </IconButton>
        </div>
    </header>

}

export default Header