import React, { useContext, useState } from 'react'
import bg from '../assets/authBg.png'
import axios from 'axios';
import { AiFillEye } from "react-icons/ai";
import { AiFillEyeInvisible } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';
import { userDataContext } from '../context/UserContext.jsx';

const Signup = () => {

    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { serverUrl, userData, setUserData } = useContext(userDataContext);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErr("");
        setLoading(true);
        try {
            const res = await axios.post(`${serverUrl}/api/auth/signup`, {
                name,
                email,
                password
            }, { withCredentials: true });
            console.log(res);
            setLoading(false);
            setUserData(res.data);
            navigate('/customize');
        } catch (error) {
            console.log(error);
            setUserData(null);
            setErr(error.response.data.message);
            setLoading(false);
        }
    }

    return (
        <div className='w-full h-screen bg-cover flex justify-center items-center' style={{ backgroundImage: `url(${bg})` }}>
            <form onSubmit={handleSubmit} className='w-[90%] h-160 max-w-150 bg-[#00000074] backdrop-blur shadow-lg shadow-blue-700 flex flex-col items-center justify-center gap-5 p-5'>

                <h1 className='text-white font-semibold text-3xl mb-10'>SignUp to  <span className='text-blue-700 font-bold'>VoiceNova</span></h1>
                <input type="text" placeholder='Ankit Sharma ' value={name} onChange={(e) => setName(e.target.value)} className='w-full h-15 p-4 outline-none border-2 border-white bg-transparent text-white placeholder-gray-400 rounded-full text-lg' />
                <input type="email" placeholder='abc@gmail.com' value={email} onChange={(e) => setEmail(e.target.value)} className='w-full h-15 p-4 outline-none border-2 border-white bg-transparent text-white placeholder-gray-400 rounded-full text-lg' />
                <div className='w-full h-15 outline-none border-2 border-white bg-transparent text-white rounded-full text-lg relative'>
                    <input type={showPassword ? "text" : "password"} placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} className='w-full h-full rounded-full outline-none placeholder-gray-400 p-4' />
                    {showPassword ? (
                        <AiFillEyeInvisible className='absolute top-4 right-4 h-6 w-6 cursor-pointer' onClick={() => setShowPassword(!showPassword)} />
                    ) : (
                        <AiFillEye className='absolute top-4 right-4 h-6 w-6 cursor-pointer' onClick={() => setShowPassword(!showPassword)} />
                    )}
                </div>
                {err && <p className='text-red-600 font-semibold'>*{err}</p>}
                <button className='h-12 min-w-30 rounded-full bg-gray-300 text-lg font-semibold text-black cursor-pointer mt-3' disabled={loading}>{loading ? "Signing up .." : "Signup"}</button>
                <p className='text-[15px] font-medium text-white '>Already have an account ? <span className='text-blue-400 font-bold cursor-pointer' onClick={() => navigate(`/login`)}>Log in</span></p>

            </form>
        </div>
    )
}

export default Signup
