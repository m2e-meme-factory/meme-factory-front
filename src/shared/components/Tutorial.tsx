import { FC, useEffect, useRef, useState } from 'react';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Box, Button, Card, Flex, Heading, Text } from '@radix-ui/themes';
import { Link, useNavigate } from 'react-router-dom';
import refs from './../imgs/refs_v2.png';
import airdrop from './../imgs/airdrop-green.png';
import projects from './../imgs/first_meme.png';
import styled from 'styled-components';
import useAnimationFrame from '../utils/animations/useAnimationFrame';
import GlowingButton from './Buttons/GlowingButton';

interface TutorialProps {
  onComplete: () => void;
}

const TutorialWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #121212;
  overflow: hidden;
`;

const SwiperContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .swiper {
    width: 100%;
    height: 100%;
  }

  .swiper-slide {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
`;

const IphoneWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 70vh;
  margin-bottom: 20px;
`;

const Iphone = styled.div`
  box-shadow: -8px 20px 20px 0px #000;
  background-color: #000;
  border-radius: 40px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  transition: all 0.5s ease;

  /* Optimal size for screens between 430px and 932px */
  width: 300px;
  height: calc(300px * 2.15); /* Maintain correct aspect ratio (645px / 300px = 2.15) */

  /* Adjustments for larger screens (above 932px) */
  @media (min-width: 933px) {
    width: 350px;
    height: calc(350px * 2.15); /* Maintain the same aspect ratio */
    border-radius: 50px;
  }

  /* Adjustments for medium screens (between 400px and 429px) */
  @media (max-width: 429px) and (min-width: 400px) {
    width: 280px;
    height: calc(280px * 2.15); /* Maintain the same aspect ratio */
    border-radius: 35px;
  }

  /* Adjustments for small screens (below 400px) */
  @media (max-width: 399px) {
    width: 250px;
    height: calc(250px * 2.15); /* Maintain the same aspect ratio */
    border-radius: 30px;
  }

  /* Further adjustments for very small screens (below 320px) */
  @media (max-width: 320px) {
    width: 220px;
    height: calc(220px * 2.15); /* Maintain the same aspect ratio */
    border-radius: 25px;
  }
`;

const Notch = styled.div`
  z-index: 1;
  width: 37%;
  height: 26px;
  background-color: #000;
  position: absolute;
  top: 2%;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 30px;
  border: 1px solid #222;
`;

const Screen = styled.div`
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #333;
`;

const StyledCard = styled(Card)`
  text-align: center;
  max-width: 350px;
  width: 80%;
  margin-bottom: 20px;
`;

const Tutorial: FC<TutorialProps> = ({ onComplete }) => {
  const swiperRef = useRef<Swiper | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [slideNormalizedOffset1, setSlideNormalizedOffset1] = useState(0);
  const [slideNormalizedOffset2, setSlideNormalizedOffset2] = useState(1);
  const [slideNormalizedOffset3, setSlideNormalizedOffset3] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    swiperRef.current = new Swiper('.swiper', {
      modules: [Navigation, Pagination],
      direction: 'horizontal',
      pagination: {
        el: '.swiper-pagination',
      },
    });

    if (swiperRef.current) {
      swiperRef.current.on('slideChange', () => {
        setCurrentSlideIndex(swiperRef.current!.activeIndex);
      });
    }

    return () => swiperRef.current?.destroy();
  }, []);

  const handleNextSlide = () => {
    swiperRef.current?.slideNext();
  };

  const handleTutorialCompleted = () => {
    localStorage.setItem('onboardCompleted', 'true');
    onComplete();
  };

  const handleResize = () => {
    const html = document.documentElement.getBoundingClientRect();

    const prevSlide = swiperRef.current?.slides[currentSlideIndex - 1];
    const nextSlide = swiperRef.current?.slides[currentSlideIndex + 1];
    const currntSlide = swiperRef.current?.slides[currentSlideIndex];

    const setWithIndex = (index: number, offsetNormalized: number) => {
      if (index == 0) setSlideNormalizedOffset1(offsetNormalized);
      else if (index == 1) setSlideNormalizedOffset2(offsetNormalized);
      else if (index == 2) setSlideNormalizedOffset3(offsetNormalized);
    };

    if (currntSlide) {
      const offsetNormalized = currntSlide.getBoundingClientRect().x / html.width;
      setWithIndex(currentSlideIndex, offsetNormalized);
    }

    if (prevSlide) {
      const offsetNormalized = prevSlide.getBoundingClientRect().x / html.width;
      setWithIndex(currentSlideIndex - 1, offsetNormalized);
    }

    if (nextSlide) {
      const offsetNormalized = nextSlide.getBoundingClientRect().x / html.width;
      setWithIndex(currentSlideIndex + 1, offsetNormalized);
    }
  };

  useAnimationFrame(() => {
    handleResize();
  }, [currentSlideIndex]);

  return (
    <TutorialWrapper>
      <SwiperContainer>
        <div className='swiper'>
          <div className='swiper-wrapper'>
            <div className='swiper-slide'>
              <IphoneWrapper>
                <Flex
                  direction='column'
                  style={{
                    marginTop: '5rem',
                    transformStyle: 'preserve-3d',
                    transform: `perspective(1200px) rotateX(${slideNormalizedOffset1 * 10 + 10}deg) rotateY(${slideNormalizedOffset1 * 70}deg) scale(${Math.min(1 + slideNormalizedOffset1 / 1.5, 1)})`,
                    transition: '0.4s ease all',
                  }}
                >
                  <Iphone>
                    <Notch />
                    <Screen>
                      <img
                        src={airdrop}
                        alt='Profile illustration'
                        style={{
                          width: '100%',
                          objectFit: 'contain',
                        }}
                      />
                    </Screen>
                  </Iphone>
                </Flex>
              </IphoneWrapper>
              <StyledCard>
                <Box pt='2' pb='2'>
                  <Heading size='5'>Join Airdrop!</Heading>
                  <Text size={{ xs: '2', sm: '4' }}>
                    Earn up to <b>10 000</b> coin for joining us
                  </Text>
                </Box>
              </StyledCard>
              <Button size='3' onClick={handleNextSlide}>
                Alright
              </Button>
            </div>
            <div className='swiper-slide'>
              <IphoneWrapper>
                <Flex
                  direction='column'
                  style={{
                    marginTop: '5rem',
                    transformStyle: 'preserve-3d',
                    transform: `perspective(1200px) rotateX(${slideNormalizedOffset2 * 10 + 10}deg) rotateY(${slideNormalizedOffset2 * 70}deg) scale(${Math.min(1 + slideNormalizedOffset2 / 1.5, 1)})`,
                    transition: '0.4s ease all',
                  }}
                >
                  <Iphone>
                    <Notch />
                    <Screen>
                      <img
                        src={refs}
                        alt='Profile illustration'
                        style={{
                          width: '100%',
                          objectFit: 'contain',
                        }}
                      />
                    </Screen>
                  </Iphone>
                </Flex>
              </IphoneWrapper>
              <StyledCard>
                <Box pt='2' pb='2'>
                  <Heading size='5'>Invite Friends!</Heading>
                  <Text size={{ xs: '2', sm: '4' }}>
                    Earn <b>100</b> coins for each friend.
                  </Text>
                </Box>
              </StyledCard>
              <Button size='3' onClick={handleNextSlide}>
                Alright
              </Button>
            </div>
            <div className='swiper-slide'>
              <IphoneWrapper>
                <Flex
                  direction='column'
                  style={{
                    marginTop: '5rem',
                    transformStyle: 'preserve-3d',
                    transform: `perspective(1200px) rotateX(${slideNormalizedOffset3 * 10 + 10}deg) rotateY(${slideNormalizedOffset3 * 70}deg) scale(${Math.min(1 + slideNormalizedOffset3 / 1.5, 1)})`,
                    transition: '0.4s ease all',
                  }}
                >
                  <Iphone>
                    <Notch />
                    <Screen>
                      <img
                        src={projects}
                        alt='Profile illustration'
                        style={{
                          width: '100%',
                          objectFit: 'contain',
                        }}
                      />
                    </Screen>
                  </Iphone>
                </Flex>
              </IphoneWrapper>
              <StyledCard>
                <Box pt='2' pb='2'>
                  <Heading size='5'>Create content!</Heading>
                  <Text size={{ xs: '2', sm: '4' }}>
                    Earn up to <b>10 000</b> coin daily
                  </Text>
                </Box>
              </StyledCard>
              <GlowingButton size='3' onClick={handleTutorialCompleted}>
                Make Money
              </GlowingButton>
            </div>
          </div>
          <div className='swiper-pagination'></div>
        </div>
      </SwiperContainer>
    </TutorialWrapper>
  );
};

export default Tutorial;
