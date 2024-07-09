import React from 'react';
import HeroContainer from './Hero/HeroContainer';
import Gallary from './Gallary/Gallary';

const Home = () => {
  return (
    <section>
      <HeroContainer />

      <div className='mex-w-screen-xl mx-auto'>
        <Gallary/>

      </div>
    </section>
  );
};

export default Home;
