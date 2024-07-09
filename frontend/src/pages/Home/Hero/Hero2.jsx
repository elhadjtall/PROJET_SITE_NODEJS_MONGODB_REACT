import React from 'react';
import anotherBgImg from '../../../assets/home/banner-2.jpg';

const Hero2 = () => {
  return (
    <div 
      className="min-h-screen bg-cover bg-center" 
      style={{ backgroundImage: `url(${anotherBgImg})` }}
    >
    //   {/* <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-50">
    //     <div className="text-center text-white">
    //       <h1 className="text-5xl font-bold mb-4">Discover More</h1>
    //       <p className="text-lg">Join our classes and learn from the best instructors.</p>
    //     </div>
    //   </div> */}
    // </div>
  );
};

export default Hero2;
