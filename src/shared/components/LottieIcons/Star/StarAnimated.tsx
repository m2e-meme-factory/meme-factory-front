import Lottie from 'lottie-react';
import star from './star.json';
import React from 'react';

const StarAnimated = () => {
  return (
    <div style={{ width: '50%', height: '50%' }}>
      <Lottie animationData={star} loop={true} autoplay={true} />
    </div>
  );
};
export default StarAnimated;
