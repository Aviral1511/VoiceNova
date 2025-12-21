import React from 'react'
import { userDataContext } from '../context/UserContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {

    const { userData, serverUrl, setUserData } = useContext(userDataContext);
    const navigate = useNavigate();
    // console.log(userData);

    const handleLogout = async () => {
        try {
            const res = await axios.post(`${serverUrl}/api/auth/logout`, { withCredentials: true });
            setUserData(null);
            navigate('/login');
        } catch (error) {
            console.log(error);
            setUserData(null);
        }
    }

    return (
        <div className='w-full h-screen bg-linear-to-t from-[#000000fd] to-[#010188ea] flex justify-center items-center flex-col'>
            <button className='h-12 min-w-30 rounded-full bg-gray-200 hover:bg-gray-300 text-lg font-semibold text-black cursor-pointer mt-3 absolute top-5 right-5'
                onClick={handleLogout}>Log Out</button>
            <button className='h-12 min-w-30 rounded-full bg-gray-200 hover:bg-gray-300 text-lg font-semibold text-black cursor-pointer mt-3 absolute top-20 right-5 px-4'
                onClick={() => navigate('/customize')}>Customize Your Assistant</button>
            <div className='w-70 h-90 flex justify-center items-center overflow-hidden rounded-4xl shadow-2xl shadow-blue-800 border-2 border-gray-300 mb-4'>
                <img src={userData?.assistantImage} className='h-full object-cover' />
            </div>
            <h1 className='text-white text-xl font-bold'>I'm {userData?.assistantName}</h1>
        </div>
    )
}

export default HomePage
