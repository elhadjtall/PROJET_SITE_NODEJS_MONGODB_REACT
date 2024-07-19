import React, { useEffect, useState } from 'react';
import useAxiosFetch from '../../hooks/useAxiosFetch';

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const axiosFetch = useAxiosFetch();

  useEffect(() => {
    axiosFetch.get('/classes')
      .then((response) => {
        setClasses(response.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, [axiosFetch]); // Ajoutez axiosFetch comme dépendance si nécessaire

  console.log(classes);
  
  return (
    <div>
      <div className='mt-20 pt-3'>
        <h1 className="text-5xl font-bold text-center">Classes</h1>
      </div>
    </div>
  );
}

export default Classes;
