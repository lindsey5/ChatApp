import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { postData } from '../../services/api'
import { useNavigate } from 'react-router-dom';
import { getToken, setToken } from '../../services/auth';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(' ');
    const navigate = useNavigate();

    useEffect(() => {
        const token = getToken();
        if(token)  navigate('/chat', { replace: true })

    },[])

    const handleLogin = async (e) => {
        e.preventDefault()
        setError(' ')
        if(email && password) {
            const response = await postData('/api/auth/login', { email, password});
            if(response.success){
                setToken(response.token)
                navigate('/chat', { replace: true });
            }else{
                setError(response.message || response.errors.Email[0])
            }
        }else{
            setError('Fill the blanks')
        }
    }
    

    return <main className="h-screen flex justify-center items-center">
        <form onSubmit={handleLogin} className="md:grid md:grid-cols-[2fr_1.5fr] flex justify-center items-center w-[80%]">
            <img className="md:block hidden h-full"  src="/20945462.jpg"/>
            <div className="w-full h-full shadow-xl rounded-xl border-1 border-gray-100 p-10">
                <h1 className="font-bold text-3xl">Login</h1>
                <div className='flex flex-col gap-10 my-10'>
                    <p className='text-red-600'>{error}</p>
                    <TextField 
                        label="Email" 
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                     />
                    <TextField 
                        label="Password" 
                        variant="outlined"
                        value={password} 
                        type='password'
                        onChange={e => setPassword(e.target.value)}
                    />
                    <Button 
                        type='submit'
                        variant='contained' 
                        sx={{ height: 45}}
                    >Login</Button>
                </div>
                <p className='text-center'>Don't have an account? <a className="underline text-blue-500" href="/signup">Signup</a></p>
            </div>
        </form>

    </main>
}

export default LoginPage