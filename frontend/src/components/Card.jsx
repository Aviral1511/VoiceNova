import React from 'react'

const Card = ({ image }) => {
    return (
        <div className='h-55 w-40 bg-blue-950 border-gray-600 border-2 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-800 cursor-pointer hover:border-4 hover:border-gray-200'>
            <img src={image} alt="card-img" className='h-full w-full object-cover' />
        </div>
    )
}

export default Card