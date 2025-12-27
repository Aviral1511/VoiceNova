import React from 'react'
import { userDataContext } from '../context/UserContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';

const HomePage = () => {

    const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(userDataContext);
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

    const speak = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.pitch = 1;
        utterance.rate = 1;
        window.speechSynthesis.speak(utterance);
    }

    useEffect(() => {
        try {
            const speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!speechRecognition) {
                console.log("Speech Recognition API not supported");
                return;
            }

            const recognition = new speechRecognition();
            recognition.continuous = true;
            recognition.lang = "en-US";

            recognition.onstart = () => console.log("VoiceNova Listening...");
            recognition.onerror = (e) => console.log("Error:", e);
            // recognition.onend = () => {
            //     console.log("Recognition stopped, restarting...");
            //     recognition.start(); // Keeps listening
            // };

            recognition.onresult = async (event) => {
                const transcript = event.results[event.results.length - 1][0].transcript.trim();
                console.log("Voice Input:", transcript);

                if (transcript.toLowerCase().includes((userData?.assistantName || "voicenova").toLowerCase())) {
                    console.log("Assistant Triggered");

                    try {
                        const data = await getGeminiResponse(transcript);
                        console.log("Assistant Response:", data);
                        speak(data);
                    } catch (err) {
                        console.log("Error:", err);
                    }
                }
            };

            // must be user triggered for chrome
            setTimeout(() => recognition.start(), 500);

        } catch (error) {
            console.log(error);
        }
    }, []);


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
