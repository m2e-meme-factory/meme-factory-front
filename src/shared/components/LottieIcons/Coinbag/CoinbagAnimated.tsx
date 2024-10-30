import React from 'react';
import coinbag from './coinbag.json';
import Lottie from 'lottie-react';

const CoinbagAnimated = () => {
  return (
    <div style={{ width: '50%', height: '50%' }}>
      <Lottie animationData={coinbag} loop={true} autoplay={true} />
    </div>
  );
};

export default CoinbagAnimated;
