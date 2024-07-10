import React, { useEffect, useState } from 'react'
import useAxiosFetch from '../../../hooks/useAxiosFetch'
import axios from 'axios';

const PopularClasses = () => {
    // On ajoute les Axios
    const useAxiosFetch = useAxiosFetch();
    const [classes, setClasses] = useState([]);
    useEffect(() => {
      const fetchClasses = async () => {
        const response = await useAxiosFetch.get('/classes');
        console.log(response)
      }
      fetchClasses()
    }), []
  return (
    <div className='md:w-[80%] mx-auto my-28'>
        <div>
            <h1 className='text-5xl font-bold text-center'>Our <span className='text-secondary'>Popular</span> Classes</h1>
            <div className='w-[40%] text-center mx-auto my-4'>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor soluta beatae voluptatem maxime quo ullam.</p>
            </div>

        </div>

    </div>
  )
}

export default PopularClasses