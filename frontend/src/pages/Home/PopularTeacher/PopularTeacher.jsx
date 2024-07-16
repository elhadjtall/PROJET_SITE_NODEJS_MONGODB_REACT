import React, { useState, useEffect } from 'react';
import useAxiosFetch from '../../../hooks/useAxiosFetch';
// import Card from './Card'; // Assurez-vous que le chemin est correct

const PopularTeacher = () => {
    const [instructors, setInstructors] = useState([]);
    const axiosFetch = useAxiosFetch();

    useEffect(() => {
        axiosFetch.get('/popular-instructors').then((data) => {
            setInstructors(data.data);
        }).catch((err) => {
            console.error(err)
        })
    }, []);

    console.log(instructors)

    return (
        <div className='md:w-[80%] mx-auto my-28'> {/* c'est le div principal qui contient toutes les images */}
            {/* Titre et le texte */}
            <div>
                <h1 className='text-5xl font-bold text-center'>
                    Our <span className='text-secondary'>Best</span> Amazing
                </h1>
                <div className='w-[40%] text-center mx-auto my-4'>
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Dolor soluta beatae voluptatem maxime quo ullam.
                    </p>
                </div>
            </div>
            {instructors && (
                <div>
                    {instructors.map((instructor, i) => (
                        <div key={i}>
                            <div>
                                <img src={instructor?.photoUrl} alt={`Instructor ${i}`} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PopularTeacher;
