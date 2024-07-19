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
      <h1>Classes</h1>
      {/* <ul>
        {classes.map((cls, index) => (
          <li key={index}>{cls.name}</li> // Ajustez en fonction des données
        ))}
      </ul> */}
    </div>
  );
}

export default Classes;
