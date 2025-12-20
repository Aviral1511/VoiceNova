import React from 'react'
import { useContext } from 'react';
import { userDataContext } from '../context/UserContext';

const Card = ({ image }) => {
    const { serverUrl, userData, setUserData, frontendImage, setFrontendImage, backendImage, setBackendImage, selectedImage, setSelectedImage } = useContext(userDataContext);

    return (
        <div className={`h-55 w-40 bg-blue-950 border-gray-600 border-2 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-800 cursor-pointer hover:border-4 hover:border-gray-200 
            ${selectedImage === image ? 'shadow-2xl shadow-blue-800 border-4 border-white' : null}`}
            onClick={() => { setSelectedImage(image); setBackendImage(null); setFrontendImage(null); }} >
            <img src={image} alt="card-img" className='h-full w-full object-cover' />
        </div>
    )
}

export default Card