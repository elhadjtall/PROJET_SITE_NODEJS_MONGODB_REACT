import React, { useState, useEffect } from 'react';
import useAxiosFetch from '../../../hooks/useAxiosFetch';
// import Card from './Card'; // Assurez-vous que le chemin est correct

const PopularTeacher = () => {
    const [instructors, setInstructors] = useState([]);
    const axiosFetch = useAxiosFetch();

    useEffect(() => {
        const fetchInstructors = async () => {
            try {
                const response = await axiosFetch.get('/instructors');
                setInstructors(response.data);
                console.log(response);
            } catch (error) {
                console.error("Error fetching instructors:", error);
            }
        };

        fetchInstructors();
    }, [axiosFetch]);

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
            {/* Affichage des images et Cards */}
            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {instructors.slice(0, 6).map((item, index) => (
                    <Card key={index} item={item} />
                ))}
            </div>
        </div>
    );
};

export default PopularTeacher;
