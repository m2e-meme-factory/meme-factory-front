import Lottie from 'lottie-react';
import handshake from './handshake.json';
import React from 'react';

const HandshakeAnimated = () => {
  return (
    <div style={{ width: '40%', height: '40%' }}>
      <Lottie animationData={handshake} loop={true} autoplay={true} />
    </div>
  );
};
export default HandshakeAnimated;
