import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import '../../styles/Tutorial.css'

const mockups = [
  '/images/screen1.png', // Изображения для экрана iPhone
  '/images/screen2.png',
  '/images/screen3.png',
];

// Анимация разворота
const SlideAnimation = keyframes`
  0% { transform: rotateY(90deg) scale(0.8); }
  100% { transform: rotateY(0deg) scale(1); }
`;

const SlideWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 1000px;
  overflow: hidden;
  width: 100%;
  max-width: 800px;
  margin: auto;
  position: relative;
`;

const SlideTrack = styled.div<{ offset: number }>`
  display: flex;
  transition: transform 0.5s ease-in-out;
  transform: translateX(${(props) => props.offset}%);
`;

const Slide = styled.div<{ isActive: boolean }>`
  min-width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: ${(props) =>
    props.isActive ? 'rotateY(0deg) scale(1)' : 'rotateY(-90deg) scale(0.8)'};
  transition: transform 0.5s ease-in-out;
  animation: ${(props) => (props.isActive ? SlideAnimation : '')} 0.5s forwards;
`;

const IphoneMockup = styled.div`
  width: 300px;
  height: 600px;
  border: 16px solid black;
  border-radius: 36px;
  position: relative;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  background: #333;

  /* Вырез экрана */
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
    border-radius: 24px;
  }
`;

const Tutorial3D: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [startX, setStartX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [offset, setOffset] = useState(0);
  const slideTrackRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isSwiping) {
      const moveX = e.touches[0].clientX - startX;
      const percentageOffset = (moveX / window.innerWidth) * 100;
      setOffset(percentageOffset - activeSlide * 100);
    }
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);
    const endOffset = offset / 100;
    const threshold = 0.3; // Порог свайпа
    if (endOffset < -threshold && activeSlide < mockups.length - 1) {
      setActiveSlide(activeSlide + 1);
    } else if (endOffset > threshold && activeSlide > 0) {
      setActiveSlide(activeSlide - 1);
    }
    setOffset(-activeSlide * 100);
  };

  useEffect(() => {
    setOffset(-activeSlide * 100);
  }, [activeSlide]);

  return (
    <SlideWrapper>
      <SlideTrack
        ref={slideTrackRef}
        offset={offset}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {mockups.map((mockup, index) => (
          <Slide key={index} isActive={index === activeSlide}>
            <IphoneMockup>
              <Screen>
                <img src={mockup} alt={`Screen ${index + 1}`} />
              </Screen>
            </IphoneMockup>
          </Slide>
        ))}
      </SlideTrack>
    </SlideWrapper>
  );
};

export default Tutorial3D;
