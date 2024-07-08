import React from 'react'
import bgImg from '../../../assets/home/banner-1.jpg'

const Hero = () => {
  return (
    <div 
      className="min-h-screen bg-cover" 
      style={{ backgroundImage: `url(${bgImg})` }}>
        <div></div>

      </div>
  );
};

export default Hero;
