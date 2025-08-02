import React from 'react';
import HeroSection from '../sections/HeroSection'; 
import FeaturedArtists from '../sections/FeaturedArtists'; 
import FeaturedArtworks from '../sections/FeaturedArtworks'; 

const Home = () => {
  return (
    <div>
      <HeroSection />
      <FeaturedArtists />
      <FeaturedArtworks />
    </div>
  );
};

export default Home;