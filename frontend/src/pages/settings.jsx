
import { useContext, useEffect, useState } from "react"
import { Avatar, Button, TextField } from "@mui/material"
import { UserContext } from "../contexts/userContext"
import { updateData } from "../services/api"

const Settings = () => {
    const { user } = useContext(UserContext)
    const [updatedUser, setUpdatedUser] = useState();

    useEffect(() => {
        if(user) setUpdatedUser(user)
    }, [user])

    const handleSave = async () => {
        if(confirm('Save updates?')){
            const data = {
            ...updatedUser,
            image: updatedUser.image.split(',')[1]
            }

            const response = await updateData('/api/user/', data);
        
            if(response.success) window.location.reload()
        }
    };

    const handleFiles = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUpdatedUser(prev => ({
                    ...prev,
                    image: reader.result,
                }));
            };
            reader.readAsDataURL(file);
        }
    }

    return <main className="flex-grow p-10">
        <div className="flex gap-5 items-center mb-12">
            <Avatar src={updatedUser?.image} sx={{ width: '100px', height: '100px'}} />
            <div className="flex flex-col gap-3">
                <h1>Profile Photo</h1>
                <Button variant="outlined" component="label">
                    <input
                        type="file"
                        onChange={handleFiles}
                        style={{ display: 'none' }}
                        accept="image/*"
                    />
                    Upload new picture
                </Button>
            </div>
        </div>
        <div className="flex gap-10 mb-12">
            <TextField 
                value={updatedUser?.firstname || ''} 
                onChange={(e) => setUpdatedUser({...updatedUser, firstname: e.target.value})}
                fullWidth 
                label="Firstname"
            />
            <TextField 
                value={updatedUser?.lastname || ''}
                onChange={(e) => setUpdatedUser({...updatedUser, lastname: e.target.value})}
                fullWidth
                label="Lastname"
            />
        </div>
        <div className="mb-12">
            <h1 className="font-bold text-xl">Email:</h1>
            <p>{user?.email}</p>
        </div>
        {updatedUser && JSON.stringify(user) !== JSON.stringify(updatedUser) && <div className="flex gap-4">
            <Button variant="contained" onClick={() => handleSave()}>Save</Button>
            <Button 
                variant="outlined" 
                color="error"
                onClick={() => setUpdatedUser(user)}
            >Cancel</Button>
        </div>}
    </main>
}

export default Settings