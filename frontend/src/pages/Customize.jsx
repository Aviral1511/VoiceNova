import React from 'react'
import img1 from '../assets/image1.png'
import img2 from '../assets/image2.jpg'
import img3 from '../assets/authBg.png'
import img4 from '../assets/image4.png'
import img5 from '../assets/image5.png'
import img6 from '../assets/image6.jpeg'
import img7 from '../assets/image7.jpeg'
import Card from '../components/Card'
import { RiImageAddFill } from "react-icons/ri";

const Customize = () => {
    return (
        <div className='w-full h-screen bg-linear-to-t from-[#000000fd] to-[#0202b4e7] flex justify-center items-center flex-col'>
            <h1 className='text-white text-3xl font-semibold mb-10'>Select Your <span className='font-bold text-green-400'>Assistant Image</span></h1>
            <div className='w-full max-w-[70%] flex justify-center items-center flex-wrap gap-5 mb-5'>
                <Card image={img1} />
                <Card image={img2} />
                <Card image={img3} />
                <Card image={img4} />
                <Card image={img5} />
                <Card image={img6} />
                <Card image={img7} />
                <div className='h-55 w-40 bg-blue-950 border-gray-600 border-2 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-800 cursor-pointer hover:border-4 hover:border-gray-200 flex items-center justify-center'>
                    <RiImageAddFill className='h-6 w-6 text-white' />
                </div>
            </div>
            <button className='h-12 min-w-30 rounded-full bg-gray-200 text-lg font-semibold text-black cursor-pointer mt-3 hover:bg-gray-300'>Next</button>
        </div>
    )
}

export default Customize
