import React from 'react'
import { useContext } from 'react';
import { useState } from 'react'
import { userDataContext } from '../context/UserContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";

const Customize2 = () => {
    const { userData, serverUrl, backendImage, selectedImage, setUserData } = useContext(userDataContext);
    const [assistantName, setAssistantName] = useState(userData.assistantName || '');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    // console.log(userData);

    const handleSubmit = async () => {
        try {
            let formdata = new FormData();
            formdata.append("assistantName", assistantName);
            if (backendImage) {
                formdata.append("assistantImage", backendImage);
            } else {
                formdata.append("imageUrl", selectedImage);
            }

            const res = await axios.post(`${serverUrl}/api/user/update`, formdata, { withCredentials: true });
            // console.log(res.data);
            setUserData(res.data.user);
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='w-full h-screen bg-linear-to-t from-[#000000fd] to-[#0202b4e7] flex justify-center items-center flex-col relative'>
            <IoMdArrowRoundBack size={40} className='text-white absolute top-6 left-6 cursor-pointer h-7 w-7 hover:text-gray-300' onClick={() => navigate(`/customize`)} />
            <h1 className='text-white text-3xl font-semibold mb-10'>Enter Your <span className='font-bold text-green-400'>Assistant Name</span></h1>
            <input type="text" placeholder='Eg : VoxNet' value={assistantName} onChange={(e) => setAssistantName(e.target.value)} className='w-full max-w-150 h-15 p-4 outline-none border-2 border-white bg-transparent text-white placeholder-gray-400 rounded-full text-lg' />
            {assistantName.length > 0 && <button className='h-12 min-w-30 rounded-full bg-gray-200 text-lg font-semibold text-black cursor-pointer mt-3 hover:bg-gray-300'
                onClick={() => { handleSubmit() }} disabled={loading}>{loading ? "Loading.." : "Let's Go"}</button>}
        </div>
    )
}

export default Customize2
