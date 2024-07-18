import React from 'react';
import { Link } from 'react-router-dom';
// import './Card.css';

const Card = ({ item }) => {
    console.log(item);
    const {_id, name, image, availableSeats, price, totalEnrolled} = item;

    // Vérifiez si l'image est présente et affichez un message d'erreur si elle ne l'est pas
    if (!image) {
        console.error('Image URL is missing for item:', item);
    }

    return (
        <div className="shadow-lg rounded-lg p-3 flex flex-col justify-between border border-secondary overflow-hidden m-4">
            {image ? (
                <img src={image} alt={name} className="w-full h-48 object-cover" />
            ) : (
                <div className="w-full h-48 flex items-center justify-center bg-gray-200 text-red-500">
                    Image not available
                </div>
            )}
            <div className="p-4">
                <h2 className='text-xl font-semibold mb-2 dark:text-white text-center'>{name}</h2>
                <p className="text-gray-600 mb-2">{availableSeats} available seats</p>
                <p className="text-gray-600 mb-2">Price: {price}</p>
                <p className="text-gray-600 mb-2">Total Students: {totalEnrolled}</p>

                <Link to={`/classes/${_id}`} className='text-center mt-2'>
                    <button className="px-2 w-full py-1 bg-secondary text-white rounded-xl font-bold mt-2">Selected</button>
                </Link>
                
            </div>
        </div>
    );
};

export default Card;
