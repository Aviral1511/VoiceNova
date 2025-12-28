import React, { useRef, useState, useContext, useEffect } from 'react'
import { userDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import ai from '../assets/ai.gif';
import user from '../assets/user.gif';

const HomePage = () => {

    const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(userDataContext);
    const navigate = useNavigate();

    const [listening, setListening] = useState(false);
    const [userText, setUserText] = useState("");
    const [aiText, setAiText] = useState("");

    const recognitionRef = useRef(null);
    const isSpeakingRef = useRef(false);
    const synth = window.speechSynthesis;

    const wakeWord = (userData?.assistantName || "voicenova").toLowerCase();

    const handleLogout = async () => {
        try {
            await axios.post(`${serverUrl}/api/auth/logout`, { withCredentials: true });
            setUserData(null);
            navigate('/login');
        } catch {
            setUserData(null);
        }
    };

    // *************************************
    // SPEAK — Handles TTS + Resume listening
    // *************************************
    const speak = (text) => {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = userData?.assistantLang || "en-US";

        isSpeakingRef.current = true;
        setAiText(text);

        u.onend = () => {
            isSpeakingRef.current = false;
            setAiText("");
            recognitionRef.current?.start(); // resume listening
        };
        synth.speak(u);
    };

    // *************************************
    // Direct commands (Runs BEFORE Gemini)
    // *************************************
    const handleCommands = (text) => {
        const cmd = text.toLowerCase();

        // Google
        if (cmd.startsWith("google") || cmd.startsWith("search")) {
            const q = cmd.replace("google", "").replace("search", "").trim();
            speak(`Searching for ${q}`);
            window.open(`https://www.google.com/search?q=${q}`, "_blank");
            return true;
        }

        // YouTube
        if (cmd.includes("youtube") || cmd.startsWith("play")) {
            const q = cmd.replace("youtube", "").replace("play", "").trim();
            speak(`Playing ${q} on YouTube`);
            window.open(`https://www.youtube.com/results?search_query=${q}`, "_blank");
            return true;
        }

        // Website opener
        const sites = {
            facebook: "https://facebook.com",
            instagram: "https://instagram.com",
            gmail: "https://mail.google.com",
            whatsapp: "https://web.whatsapp.com",
            github: "https://github.com",
            spotify: "https://open.spotify.com"
        };

        for (let key in sites) {
            if (cmd.includes(key)) {
                speak(`Opening ${key}`);
                window.open(sites[key], "_blank");
                return true;
            }
        }

        return false; // no match → go to Gemini
    };


    // *************************************
    // Speech Recognition
    // *************************************
    useEffect(() => {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) return console.log("Speech Recognition Not Supported!");

        const rec = new SR();
        rec.continuous = false; // important fix against double greeting
        rec.lang = "en-US";
        recognitionRef.current = rec;

        rec.onstart = () => setListening(true);
        rec.onend = () => { setListening(false); if (!isSpeakingRef.current) rec.start(); };
        rec.onerror = () => { if (!isSpeakingRef.current) rec.start(); };

        rec.onresult = async (e) => {
            const text = e.results[0][0].transcript.trim();
            setUserText(text);

            console.log("Heard:", text);

            // ------------ Wake Phrase ------------
            if (!text.toLowerCase().startsWith(wakeWord)) return; // prevents random triggers

            rec.stop(); // stop listening while responding

            // 1️⃣ Try commands first
            if (handleCommands(text)) return;

            // 2️⃣ AI Response
            const reply = await getGeminiResponse(text);
            speak(reply);
        }

        // ---------------- GREETING FIX ----------------
        setTimeout(() => {
            speak(`Hello ${userData?.name || ''}, I am ${userData?.assistantName || 'VoiceNova'}. How can I assist you today?`);
            console.log("Greeting sent");
        }, 800);

        rec.start();

        return () => rec.stop();
    }, []);


    return (
        <div className='w-full h-screen bg-linear-to-t from-[#000000fd] to-[#010188ea] flex flex-col justify-center items-center'>

            <button onClick={handleLogout}
                className='absolute top-5 right-5 bg-gray-200 hover:bg-gray-300 text-black font-semibold px-6 py-2 rounded-full cursor-pointer'>
                Log Out
            </button>

            <button onClick={() => navigate('/customize')}
                className='absolute top-20 right-5 bg-gray-200 hover:bg-gray-300 text-black font-semibold px-4 py-2 rounded-full cursor-pointer'>
                Customize
            </button>

            <div className='w-70 h-90 rounded-4xl overflow-hidden shadow-2xl border border-gray-300 mb-5'>
                <img src={userData?.assistantImage} className='h-full w-full object-cover' />
            </div>

            <h1 className='text-white text-xl font-bold'>I'm {userData?.assistantName || "VoiceNova"}</h1>

            {aiText ? <img src={ai} className='w-40' /> : <img src={user} className='w-40' />}

            <p className='text-white text-lg text-center px-5 mt-3'>
                {userText || aiText || (listening ? "Listening..." : "")}
            </p>

        </div>
    );
};

export default HomePage;
