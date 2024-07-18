import React, { useEffect, useState } from 'react';
import useAxiosFetch from '../../../hooks/useAxiosFetch';
import Card from './Card';  // Assurez-vous que le chemin est correct

const PopularClasses = () => {
    const axiosFetch = useAxiosFetch();
    const [classes, setClasses] = useState([]);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await axiosFetch.get('/classes');
                console.log("Data received:", response.data);  // Vérifiez les données ici
                setClasses(response.data);
            } catch (error) {
                console.error("Error fetching classes:", error);
            }
        };

        fetchClasses();
    }, [axiosFetch]);

    return (
        <div className='md:w-[80%] mx-auto my-28'>
            <div>
                <h1 className='text-5xl font-bold text-center'>
                    Our <span className='text-secondary'>Popular</span> Classes
                </h1>
                <div className='w-[40%] text-center mx-auto my-4'>
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Dolor soluta beatae voluptatem maxime quo ullam.
                    </p>
                </div>
            </div>
            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {
                    classes.slice(0, 6).map((item, index) => <Card key={index} item={item} />)
                }
            </div>
        </div>
    );
};

export default PopularClasses;
