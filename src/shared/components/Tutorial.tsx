import { FC, useEffect, useRef, useState } from 'react';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Badge, Box, Button, Card, Flex, Heading, Text } from '@radix-ui/themes';
import { Link, useNavigate } from 'react-router-dom';
import refs from './../imgs/refs_v2.png';
import airdrop from './../imgs/airdrop-green.png';
import moneybag from './../imgs/money-bag.webp';
import projects from './../imgs/first_meme.png';
import styled from 'styled-components';
import useAnimationFrame from '../utils/animations/useAnimationFrame';
import GlowingButton from './Buttons/GlowingButton';
import CoinbagAnimated from './LottieIcons/Coinbag/CoinbagAnimated';

const M2E = <Badge color='bronze'>M2E</Badge>;

interface TutorialProps {
  onComplete: () => void;
}

const swiperBackgroundColors = [
  'linear-gradient(-25deg, #00000000 20%, #8bc34a2a 80%)',
  'linear-gradient(-25deg, #00000000, #fecf0a2a 50%, #00000000)',
  'linear-gradient(-25deg, #fecf0a2a 20%, #00000000 80%)',
];

const SwiperDiv = styled.div`
  height: 100vh;
  width: 100vw;
  background: #00000000;
`;

const Iphone = styled.div`
  box-shadow: -8px 20px 20px 0px #000;
  margin-top: -50px;
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
  position: absolute;
  bottom: 12vh;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
`;
const Tutorial: FC<TutorialProps> = ({ onComplete }) => {
  const swiperRef = useRef<Swiper | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [slideNormalizedOffset1, setSlideNormalizedOffset1] = useState(0);
  const [slideNormalizedOffset2, setSlideNormalizedOffset2] = useState(1);
  const [slideNormalizedOffset3, setSlideNormalizedOffset3] = useState(1);
  const [slideNormalizedOffset4, setSlideNormalizedOffset4] = useState(1);

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
      else if (index == 3) setSlideNormalizedOffset4(offsetNormalized);
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
    <SwiperDiv className='swiper'>
      <Box
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100vh',
          width: '100vw',
          zIndex: -1,
          transition: 'all 0.5s ease',
          background: `radial-gradient(#fecd0a11, #00000000 100%)`,
        }}
      />
      <div className='swiper-wrapper'>
        <div className='swiper-slide'>
          <Flex
            direction='column'
            align='center'
            style={{
              transformStyle: 'preserve-3d',
              transform: `perspective(1200px) rotateX(${slideNormalizedOffset1 * 10 + 10}deg) rotateY(${slideNormalizedOffset1 * 70}deg) scale(${Math.min(1 + slideNormalizedOffset1 / 1.5, 1)}) translateY(20vh)`,
              translate: '0.4s ease all',
            }}
          >
            <CoinbagAnimated />
          </Flex>
          <StyledCard>
            <Box pt='2' pb='2'>
              <Heading size='5'>How to Earn With Us?</Heading>
              <Text size={{ xs: '2', sm: '4' }}>
                The more {M2E} points you get - the more your Airdrop chances.
              </Text>
            </Box>
          </StyledCard>
          <Button
            size='3'
            onClick={handleNextSlide}
            style={{
              position: 'absolute',
              bottom: '20px',
              right: '50%',
              transform: 'translateX(50%)',
              zIndex: '9999',
            }}
          >
            Learn
          </Button>
        </div>
        <div className='swiper-slide'>
          <Flex
            direction='column'
            align='center'
            style={{
              transformStyle: 'preserve-3d',
              transform: `perspective(1200px) rotateX(${slideNormalizedOffset2 * 10 + 10}deg) rotateY(${slideNormalizedOffset2 * 70}deg) scale(${Math.min(1 + slideNormalizedOffset2 / 1.5, 1)}) translateY(10vh)`,
              translate: '0.4s ease all',
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

          <StyledCard>
            <Box pt='2' pb='2'>
              <Heading size='5'>Invite Friends!</Heading>
              <Text size={{ xs: '2', sm: '4' }}>
                Earn <b>1000</b> {M2E} for each friend.
              </Text>
            </Box>
          </StyledCard>
          <Button
            size='3'
            onClick={handleNextSlide}
            style={{
              position: 'absolute',
              bottom: '20px',
              right: '50%',
              transform: 'translateX(50%)',
              zIndex: '9999',
            }}
          >
            Alright
          </Button>
        </div>
        <div className='swiper-slide'>
          <Flex
            direction='column'
            align='center'
            style={{
              transformStyle: 'preserve-3d',
              transform: `perspective(1200px) rotateX(${slideNormalizedOffset3 * 10 + 10}deg) rotateY(${slideNormalizedOffset3 * 70}deg) scale(${Math.min(1 + slideNormalizedOffset3 / 1.5, 1)}) translateY(10vh)`,
              translate: '0.4s ease all',
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
          <StyledCard>
            <Box pt='2' pb='2'>
              <Heading size='5'>Complete Fast tasks!</Heading>
              <Text size={{ xs: '2', sm: '4' }}>
                Earn up to <b>1000</b> {M2E} for each task
              </Text>
            </Box>
          </StyledCard>
          <Button
            size='3'
            onClick={handleNextSlide}
            style={{
              position: 'absolute',
              bottom: '20px',
              right: '50%',
              transform: 'translateX(50%)',
              zIndex: '9999',
            }}
          >
            Alright
          </Button>
        </div>
        <div className='swiper-slide'>
          <Flex
            direction='column'
            align='center'
            style={{
              transformStyle: 'preserve-3d',
              transform: `perspective(1200px) rotateX(${slideNormalizedOffset4 * 10 + 10}deg) rotateY(${slideNormalizedOffset4 * 70}deg) scale(${Math.min(1 + slideNormalizedOffset4 / 1.5, 1)}) translateY(10vh)`,
              translate: '0.4s ease all',
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
          <StyledCard>
            <Box pt='2' pb='2'>
              <Heading size='5'>Create content!</Heading>
              <Text size={{ xs: '2', sm: '4' }}>
                You will post content in socials and earn more than <b>10 000</b> {M2E} daily
              </Text>
            </Box>
          </StyledCard>
          <GlowingButton
            size='3'
            onClick={handleTutorialCompleted}
            style={{
              position: 'absolute',
              bottom: '20px',
              right: '50%',
              transform: 'translateX(50%)',
              zIndex: '9999',
            }}
          >
            Make Money
          </GlowingButton>
        </div>
      </div>
      <div className='swiper-pagination'></div>
    </SwiperDiv>
  );
};

export default Tutorial;
