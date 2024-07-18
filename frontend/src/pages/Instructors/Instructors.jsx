import React, { useEffect, useState } from 'react';
import useAxiosFetch from '../../hooks/useAxiosFetch';
import img from "../../assets/home/girl.jpg";

const Instructors = () => {
  const [instructors, setInstructors] = useState([]);
  const axiosFetch = useAxiosFetch();

  useEffect(() => {
    axiosFetch.get('/instructors')
      .then((response) => {
        setInstructors(response.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [axiosFetch]);

  console.log(instructors);

  return (
    <div className='md:w-[80%] mx-auto my-28'>
      <div>
        <h1 className='text-5xl font-bold text-center'>
          Our <span className='text-secondary'>Best</span> Instructors
        </h1>
        <div className='w-[40%] text-center mx-auto my-4'>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Dolor soluta beatae voluptatem maxime quo ullam.
          </p>
        </div>
      </div>
      {instructors.length > 0 ? (
        <div className='grid mb-28 md:grid-cols-2 lg:grid-cols-4 w-[90%] gap-4 mx-auto mt-20'>
          {instructors.slice(0, 6).map((instructor, i) => (
            <div key={i} className='flex dark:text-white hover:-translate-y-2 duration-200 cursor-pointer flex-col shadow-md py-8 px-10 md:px-8 rounded-md'>
              <div className='flex-col flex gap-6 md:gap-8'>
                <img
                  className='rounded-full border-4 border-gray-300 h-24 w-24 mx-auto'
                  src={instructor?.photoUrl || img}
                  alt=''
                />
              </div>
              <div className='flex flex-col text-center'>
                <p className='font-medium text-lg dark:text-white text-gray-800'>{instructor?.instructor?.name}</p>
                <p className='text-gray-500'>Instructor</p>
                <p className='text-gray-500 mb-4'> Adresses: {instructor?.address}</p>
                <p className='text-gray-500 mb-4'> Email: {instructor?.email}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className='text-center'>No instructors available</p>
      )}
    </div>
  );
};

export default Instructors;
