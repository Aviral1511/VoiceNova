import React, { useState } from 'react'
import { createContext } from 'react';
export const userDataContext = createContext();
import axios from 'axios';
import { useEffect } from 'react';

const UserContext = ({ children }) => {
    const serverUrl = "http://localhost:8000";

    const [userData, setUserData] = useState(null);
    const [frontendImage, setFrontendImage] = useState(null);
    const [backendImage, setBackendImage] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(
                    `${serverUrl}/api/user/current`,
                    { withCredentials: true }
                );
                setUserData(res.data.user);
            } catch (error) {
                console.log("Error fetching user data:", error);
            }
        };

        fetchUser();
    }, []);

    const value = { serverUrl, userData, setUserData, frontendImage, setFrontendImage, backendImage, setBackendImage, selectedImage, setSelectedImage };
    return (
        <div>
            <userDataContext.Provider value={value}>
                {children}
            </userDataContext.Provider>
        </div>
    )
}

export default UserContext
