import Lottie from 'lottie-react';
import eyes from './eyes.json';
import React from 'react';

const EyesAnimated = () => {
  return (
    <div style={{ width: '50%', height: '50%' }}>
      <Lottie animationData={eyes} loop={true} autoplay={true} />
    </div>
  );
};
export default EyesAnimated;
