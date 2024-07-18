import React, { useState, useEffect } from 'react';
import useAxiosFetch from '../../../hooks/useAxiosFetch';
<<<<<<< HEAD
import img from "../../../assets/home/girl.jpg";
// import Card from './Card'; // Assurez-vous que le chemin est correct
=======

import img from '../../../assets/home/girl.jpg';
>>>>>>> 77446e4c0524af7099d08c1921828f0c1b15df32

const PopularTeacher = () => {
  const [instructors, setInstructors] = useState([]);
  const axiosFetch = useAxiosFetch();

<<<<<<< HEAD
    useEffect(() => {
        axiosFetch.get('/popular-instructors').then((data) => {
            setInstructors(data.data);
        }).catch((err) => {
            console.error(err)
        })
    }, []);
=======
  useEffect(() => {
    axiosFetch
      .get("/popular-instructors")
      .then((response) => {
        setInstructors(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  console.log(instructors);
  return (
    <div className='md:w-[80%] mx-auto my-28'> {/* c'est le div principal qui contient toutes les images */}
>>>>>>> 77446e4c0524af7099d08c1921828f0c1b15df32

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
<<<<<<< HEAD
            {instructors && (
                <div>
                    {instructors?.map((instructor, i) => (
                        <div>
                            <div>
                                <img src={instructor?.instructor?.photoUrl || `${img}`} alt={`Instructor ${i}`} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
=======
            {/* Affichage des images et Cards  */}
            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
                
                
            </div>
>>>>>>> 77446e4c0524af7099d08c1921828f0c1b15df32
        </div>
    );
};

export default PopularTeacher;
