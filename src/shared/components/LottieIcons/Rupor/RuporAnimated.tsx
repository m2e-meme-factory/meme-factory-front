import Lottie from 'lottie-react';
import rupor from './rupor.json';
import React from 'react';

const RuporAnimated = () => {
  return (
    <div style={{ width: '50%', height: '50%' }}>
      <Lottie animationData={rupor} loop={true} autoplay={true} />
    </div>
  );
};
export default RuporAnimated;
