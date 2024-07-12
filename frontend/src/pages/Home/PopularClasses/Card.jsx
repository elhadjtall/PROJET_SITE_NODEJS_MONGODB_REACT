import React from 'react';
import { Link } from 'react-router-dom';
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

                {/* La gestion de la selection des elements en utilisant le id du data dans la base de donnée, lorsqu'on clique sur le bouton selected */}
                <Link to={`/classes/${_id}`} className='text-center mt-2'>
                    <button className="px-2 w-full py-1 bg-secondary text-white rounded-xl font-bold mt-2">Selected</button>
                </Link>
                
            </div>
        </div>
    );
};

export default Card;
