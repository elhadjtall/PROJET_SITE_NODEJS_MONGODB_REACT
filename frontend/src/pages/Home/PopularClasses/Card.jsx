import React from 'react';
// import './Card.css';

const Card = ({ item }) => {
    console.log(item);
    const {_id, name, image, availableSeats, price, totalEnrolled} = item;

    return (
        <div className="shadow-lg rounded-lg p-3 flex flex-col justify-between border border-secondary overflow-hidden m-4">
            <img src={image} alt="" />
            <div className="p-4">
                <h2 className='text-xl font-semibold mb-2 dark:text-white text-center'>{name}</h2>
                <p className="text-gray-600 mb-2">{availableSeats} available seats</p>
                <p className="text-gray-600 mb-2">Price: {price}</p>
                <p className="text-gray-600 mb-2">Total Students: {totalEnrolled}</p>
                <button className="bg-secondary text-white p-2 rounded-lg">View Details</button>
                
            </div>
        </div>
    );
};

export default Card;
