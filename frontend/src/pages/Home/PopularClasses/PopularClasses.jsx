import React, { useState } from 'react'
import useAxiosFetch from '../../../hooks/useAxiosFetch'

const PopularClasses = () => {
    // On ajoute les Axios
    const useAxiosFetch = useAxiosFetch();
    const [classes, setClasses] = useState([]);
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