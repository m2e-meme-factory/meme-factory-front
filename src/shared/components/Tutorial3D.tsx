import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCube, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-cube';
import 'swiper/css/pagination';

const GlobalStyle = createGlobalStyle`
    body, html {
        margin: 0;
        padding: 0;
        height: 100%;
        width: 100%;
        overflow: hidden;
    }
`;

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
`;

const StyledSwiper = styled(Swiper)`
  width: 300px;
  height: 600px;
`;

const IphoneMockup = styled.div`
  width: 100%;
  height: 100%;
  border: 16px solid black;
  border-radius: 36px;
  position: relative;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  background: #333;
  overflow: hidden;

  &:before {
    content: '';
    display: block;
    position: absolute;
    width: 60%;
    height: 30px;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    background: black;
    border-radius: 0 0 20px 20px;
    z-index: 10;
  }
`;

const Screen = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: white;
  border-radius: 24px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const mockups = ['/images/screen1.png', '/images/screen2.png', '/images/screen3.png'];

const Tutorial3D: React.FC = () => {
  return (
    <>
      <GlobalStyle />
      <Container>
        <IphoneMockup>
          <StyledSwiper
            effect={'cube'}
            grabCursor={true}
            cubeEffect={{
              shadow: true,
              slideShadows: true,
              shadowOffset: 20,
              shadowScale: 0.94,
            }}
            pagination={true}
            modules={[EffectCube, Pagination]}
          >
            {mockups.map((mockup, index) => (
              <SwiperSlide key={index}>
                <Screen>
                  <img src={mockup} alt={`Screen ${index + 1}`} />
                </Screen>
              </SwiperSlide>
            ))}
          </StyledSwiper>
        </IphoneMockup>
      </Container>
    </>
  );
};

export default Tutorial3D;
