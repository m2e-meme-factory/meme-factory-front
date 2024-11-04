import Lottie from 'lottie-react';
import shiba from './shiba.json';
import React from 'react';

const ShibaAnimated = () => {
  return (
      <Lottie animationData={shiba} loop={true} autoplay={true} />
  );
};
export default ShibaAnimated;
