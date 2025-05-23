import { Navigate, Outlet } from "react-router-dom"
import { UserContextProvider } from "../contexts/userContext"
import { SignalContextProvider } from "../contexts/signalContext"
import Sidebar from "../components/ui/Sidebar"
import Header from "../components/ui/Header"

const UserLayout = () => {
    if(!localStorage.getItem("token")) {
        return <Navigate to="/" replace />
    }
    
    return <UserContextProvider>    
            <SignalContextProvider>
                <div className="h-screen">
                    <Header />
                    <Outlet />
                </div>
            </SignalContextProvider>
        </UserContextProvider>
}

export default UserLayout