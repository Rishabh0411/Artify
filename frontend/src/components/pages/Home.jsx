// frontend/src/components/pages/Home.jsx
import React from 'react';
import HeroSection from '../sections/HeroSection'; // Adjusted path
import FeaturedArtists from '../sections/FeaturedArtists'; // Adjusted path
import FeaturedArtworks from '../sections/FeaturedArtworks'; // Adjusted path

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