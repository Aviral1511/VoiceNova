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
    const isRecognizingRef = useRef(false);
    const synth = window.speechSynthesis;

    // ---------- LOGOUT ----------
    const handleLogout = async () => {
        try {
            await axios.post(`${serverUrl}/api/auth/logout`, { withCredentials: true });
            setUserData(null);
            navigate('/login');
        } catch {
            setUserData(null);
        }
    };

    // ---------- SPEAK ----------
    const speak = (text) => {
        isSpeakingRef.current = true;
        const u = new SpeechSynthesisUtterance(text);

        u.lang = userData?.assistantLang || "en-US";
        // u.pitch = 1;
        // u.rate = 1;

        u.onend = () => {
            isSpeakingRef.current = false;
            setAiText("");
            // recognitionRef.current?.start();
        };

        synth.speak(u);
    };

    // ---------- COMMAND HANDLER ----------
    const handleCommands = (text) => {
        const cmd = text.toLowerCase();

        // 🔎 Google Search
        if (cmd.includes("google")) {
            const q = cmd.replace("google", "").trim();
            speak("Searching on Google");
            window.open(`https://www.google.com/search?q=${encodeURIComponent(q)}`, "_blank");
            return true;
        }

        // ▶️ YouTube Search
        if (cmd.includes("youtube") || cmd.includes("play")) {
            const q = cmd.replace("youtube", "").replace("play", "").trim();
            speak(`Playing ${q} on YouTube`);
            window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`, "_blank");
            return true;
        }

        // 🌐 Open Apps/Webs (add more later)
        const openMap = {
            "facebook": "https://facebook.com",
            "instagram": "https://instagram.com",
            "gmail": "https://mail.google.com",
            "whatsapp": "https://web.whatsapp.com",
            "github": "https://github.com",
            "spotify": "https://open.spotify.com",
        };

        for (let app in openMap) {
            if (cmd.includes(app)) {
                speak(`Opening ${app}`);
                window.open(openMap[app], "_blank");
                return true;
            }
        }

        return false;
    };

    // ---------- SPEECH RECOGNITION ----------
    useEffect(() => {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) return console.log("Speech Recognition Not Supported!");

        const rec = new SR();
        rec.continuous = true;
        rec.lang = "en-US";
        recognitionRef.current = rec;

        const safeStart = () => {
            if (!isRecognizingRef.current && !isSpeakingRef.current) {
                try { rec.start(); } catch { }
            }
        };

        rec.onstart = () => { setListening(true); isRecognizingRef.current = true; console.log("🎤 Listening..."); };
        rec.onend = () => { setListening(false); isRecognizingRef.current = false; setTimeout(safeStart, 800); };
        rec.onerror = () => { setListening(false); isRecognizingRef.current = false; setTimeout(safeStart, 1000); };

        rec.onresult = async (e) => {
            const text = e.results[e.results.length - 1][0].transcript.trim();
            setUserText(text);
            console.log("User:", text);

            if (text.toLowerCase().includes((userData?.assistantName || "voicenova").toLowerCase())) {
                rec.stop();
                const reply = await getGeminiResponse(text);

                setAiText(reply);
                speak(reply);

                if (handleCommands(text)) return;
            }
        };

        // Greet Once
        setTimeout(() => {
            speak(`Hello ${userData?.name || ''}, I am ${userData?.assistantName || 'VoiceNova'}. How can I help you today?`);
        }, 300);

        safeStart();
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
                {userText || aiText || (listening && "Listening...")}
            </p>
        </div>
    );
};

export default HomePage;
