import { TextField, Button } from "@mui/material"
import { useState } from "react";
import { postData } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { setToken } from "../../services/auth";

const Signup = () => {
    const [data, setData] = useState({
        email: '',
        firstname: '',
        lastname: '',
        password: '',
        confirmPassword: ''
    })
    const [error, setError] = useState(' ');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('')

        if(data.password !== data.confirmPassword){
            setError('Password doesn\'t matched')
        }else if(data.password.length < 8){
            setError('Password must be 8 characters and above')
        }else{
            const response = await postData('/api/auth/signup', data);
            if(response.success){
                setToken(response.token)
                navigate('/chat', { replace: true});
            }else{
                setError(response.data.message);
            }
        }
    }

    return <main className="h-screen flex justify-center items-center">
            <form onSubmit={handleSubmit} className="w-[500px] shadow-xl rounded-xl border-1 border-gray-100 p-10">
                <h1 className="font-bold text-3xl">Signup</h1>
                <div className='flex flex-col gap-10 my-5'>
                    <p className='text-red-600'>{error}</p>
                    <TextField 
                        label="Email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData({...data, email: e.target.value})}
                        required
                        aria-readonly
                    />
                    <div className="flex gap-2">
                        <TextField 
                            label="Firstname"
                            value={data.firstname}
                            onChange={(e) => setData({...data, firstname: e.target.value})}
                            required
                        />
                         <TextField 
                            label="Lastname"
                            value={data.lastname}
                            onChange={(e) => setData({...data, lastname: e.target.value})}
                            required
                        />
                    </div>
                    <TextField 
                        label="Password"
                        type="password"
                        value={data.password}
                        onChange={(e) => setData({...data, password: e.target.value})}
                        required
                    />
                    <TextField 
                        label="Confirm Password"
                        type="password"
                        value={data.confirmPassword}
                        onChange={(e) => setData({...data, confirmPassword: e.target.value})}
                        required
                    />

                    <Button 
                        type='submit'
                        variant='contained' 
                        sx={{ height: 45}}
                    >Sign up</Button>
                </div>
                 <p className='text-center'>Already have an account? <a className="underline text-blue-500" href="/">Login</a></p>
            </form>
    </main>
}

export default Signup