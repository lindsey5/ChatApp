import { TextField, Button } from "@mui/material"
import { useState } from "react";
import { postData } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { setToken } from "../../services/auth";
import { maskEmail } from "../../utils/utils";

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
    const [loading, setLoading] = useState(false)
    const [verificationCode, setVerificationCode] = useState('');
    const [code, setCode] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('')
        setLoading(true);

        if(verificationCode){
            if(code !== verificationCode.toString()){
                setError('Incorrect code')
            }else{
                const response = await postData('/api/auth/signup', data);
                if(response.success){
                    setToken(response.token)
                    navigate('/chat', { replace: true});
                }else{
                    setError(response.data.message);
                }
            }
        }else{
            if(data.password !== data.confirmPassword){
                setError('Password doesn\'t matched')
            }else if(data.password.length < 8){
                setError('Password must be 8 characters and above')

            }else{
                const response = await postData(`/api/email/verification-code?email=${data.email}`)
                response.success ? setVerificationCode(response.verification_code) : setError(response.message);
            }
            
        }
        setLoading(false)
    }

    return <main className="bg-[url(bg.jpg)] bg-cover bg-center h-screen flex justify-center items-center">
            <form onSubmit={handleSubmit} className="bg-white max-w-[500px] shadow-xl rounded-xl border-1 border-gray-100 p-10">
                {!verificationCode ? <>
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
                        disabled={loading}
                    >Sign up</Button>
                </div>
                </> : <div className="flex flex-col items-center gap-5 mb-5">
                    <h1 className="font-bold text-3xl">Verify</h1>
                    <p className="text-lg">We sent code to <span className="font-bold">{maskEmail(data.email)}</span></p>
                    <p className='text-red-600'>{error}</p>
                    <TextField 
                        fullWidth 
                        placeholder="Enter code" 
                        onChange={(e) => setCode(e.target.value)}
                    />
                    <Button fullWidth variant="contained" type="submit">Verify</Button>
                </div>}
                 <p className='text-center'>Already have an account? <a className="underline text-blue-500" href="/">Login</a></p>
            </form>
    </main>
}

export default Signup