import { FC, useEffect, useRef, useState } from 'react';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Badge, Box, Button, Card, DataList, Flex, Heading, Text, TextField } from '@radix-ui/themes';
import { Link, useNavigate } from 'react-router-dom';
import refs from './../imgs/refs_v2.png';
import airdrop from './../imgs/airdrop-green.png';
import moneybag from './../imgs/money-bag.webp';
import projects from './../imgs/first_meme.png';
import styled from 'styled-components';
import useAnimationFrame from '../utils/animations/useAnimationFrame';
import GlowingButton from './Buttons/GlowingButton';
import CoinbagAnimated from './LottieIcons/Coinbag/CoinbagAnimated';
import Header from '../../pages/ProfilePage/Header';

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
  height: 92vh;
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
    <>
    <Box p="4">
      <Header />
      </Box>
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
              ml='16px'
              mr='16px'
              overflowX='hidden'
              style={{
                transformStyle: 'preserve-3d',
                // transform: `perspective(1200px) rotateX(${slideNormalizedOffset1 * 10 + 10}deg) rotateY(${slideNormalizedOffset1 * 70}deg) scale(${Math.min(1 + slideNormalizedOffset1 / 1.5, 1)}) translateY(20vh)`,
                transform: `perspective(1200px) rotateX(0deg) rotateY(${slideNormalizedOffset1 * 70}deg) scale(${Math.min(1 + slideNormalizedOffset1 / 1.5, 1)}) translateY(15.5vh)`,
                translate: '0.4s ease all',
              }}
            >
              {/* <CoinbagAnimated /> */}
              <Box width='100%' style={{ borderRadius: '10px', background: '#191919 url(imgs/ellipse-tutorial-1.svg) no-repeat top left / cover', minHeight: 'clamp(15.625rem, 4.716rem + 54.55vw, 19.375rem)', display: 'flex', alignItems: 'end', justifyContent: 'center', overflow: 'hidden'}}>
                <img src="imgs/6-01.png" width='233' height='233' alt="" style={{
                  position: 'absolute',
                  width: 'clamp(7.5rem, -13.045rem + 102.73vw, 14.563rem)',
                  height: 'clamp(7.5rem, -13.045rem + 102.73vw, 14.563rem)',
                  top: '4%',
                  right: '-15%',
                }}/>
                <img src="imgs/8-01.png" width='134' height='135' alt="" style={{
                  position: 'absolute',
                  width: 'clamp(6.25rem, 0.068rem + 30.91vw, 8.375rem)',
                  height: 'clamp(6.25rem, 0.068rem + 30.91vw, 8.375rem)',
                  top: '-8%',
                  left: '25vw',
                }}/>
                <img src="imgs/10-01.png" width='164' height='164' alt="" style={{
                  position: 'absolute',
                  width: 'clamp(7.5rem, -0.5rem + 40vw, 10.25rem)',
                  height: 'clamp(7.5rem, -0.5rem + 40vw, 10.25rem)',
                  top: '15%',
                  left: '-9%',
                  rotate: '12deg'
                }}/>
                <Flex direction='column' align='center'>
                  <Box style={{ marginTop: 'auto'}}>
                    <svg width="68" height="18" viewBox="0 0 68 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M67.4469 5.32384H55.3068V6.97173H67.4469V11.2816H55.3068V12.9295H67.4469V17.9999H48.731V0.253418H67.4469V5.32384Z" fill="#FFCF0B" />
                      <path d="M47.9611 5.57747C47.9611 11.3324 39.286 10.4451 38.0214 12.4225H47.7082V18H27.8794V14.9577C27.8794 8.31549 41.3852 8.9493 41.3852 6.46479C41.3852 5.70422 40.7529 5.57747 38.5525 5.57747C36.2257 5.57747 34.7082 5.57747 34.7082 7.22535H28.1323C28.1323 1.1662 32.2802 0 38.2996 0C44.3949 0 47.9611 1.1662 47.9611 5.57747Z" fill="#FFCF0B" />
                      <path d="M27.1128 0.253418V17.9999H20.537V9.55764L15.7062 17.9999H11.4066L6.57587 9.55764V17.9999H0V0.253418H8.09338L13.5564 10.3943L19.0194 0.253418H27.1128Z" fill="#FFCF0B" />
                    </svg>
                  </Box>
                  <Text mb='17px' style={{ color: 'var(--accent-1)' }}>
                    Meme-To-Earn
                  </Text>
                </Flex>
              </Box>
            
              <Box pt='8' pb='2' style={{ textAlign: 'center'}}>
                <Flex direction='column' align='center' gap='1'>
                  <Heading size='4'>How to Earn With Us?</Heading>
                  <Box style={{ maxWidth: '25ch' }}>
                    <Text size={{ xs: '2', sm: '3' }} >
                      The more M2E points you get - the more your Airdrop chances.
                    </Text>
                  </Box>
                </Flex>
              </Box>
            </Flex>
            <Button
              size='3'
              onClick={handleNextSlide}
              style={{
                position: 'absolute',
                width: 'calc(100% - 32px)',
                bottom: '20px',
                right: '50%',
                transform: 'translateX(50%)',
                textTransform: 'uppercase',
                fontWeight: 'bold',
                zIndex: '9999',
              }}
            >
              Learn
            </Button>
          </div>
          <div className='swiper-slide'>
            <Flex
              height='100%'
              direction='column'
              justify='center'
              align='center'
              ml='16px'
              mr='16px'
              style={{
                transformStyle: 'preserve-3d',
                // transform: `perspective(1200px) rotateX(${slideNormalizedOffset2 * 10 + 10}deg) rotateY(${slideNormalizedOffset2 * 70}deg) scale(${Math.min(1 + slideNormalizedOffset2 / 1.5, 1)}) translateY(10vh)`,
                transform: `perspective(1200px) rotateX(0deg) rotateY(${slideNormalizedOffset2 * 70}deg) scale(${Math.min(1 + slideNormalizedOffset2 / 1.5, 1)}) translateY(-2vh)`,
                translate: '0.4s ease all',
              }}
            >

              <Box width='100%' style={{ borderRadius: '10px', background: '#191919 url(imgs/ellipse-tutorial-2.svg) no-repeat top left / cover', padding: '24px 12px', minHeight: '19.375rem'}}>
                <Flex direction='column' align='center' justify='center' gap='1' height='100%'>
                  <img src="imgs/step2.png" width='325' height='248' alt="" />
                </Flex>
              </Box>

              <Box pt='8' pb='2' style={{ textAlign: 'center'}}>
                <Flex direction='column' align='center' gap='1'>
                  <Heading size='4'>Invite Friends!</Heading>
                  <Text size={{ xs: '2', sm: '4' }}>
                    Earn up to 1000 M2E for each tasks.
                  </Text>
                </Flex>
              </Box>

            </Flex>

            <Button
              size='3'
              onClick={handleNextSlide}
              style={{
                position: 'absolute',
                width: 'calc(100% - 32px)',
                bottom: '20px',
                right: '50%',
                transform: 'translateX(50%)',
                textTransform: 'uppercase',
                fontWeight: 'bold',
                zIndex: '9999',
              }}
            >
              Alright
            </Button>
          </div>
          <div className='swiper-slide'>
            <Flex
              height='100%'
              direction='column'
              justify='center'
              align='center'
              ml='16px'
              mr='16px'
              style={{
                transformStyle: 'preserve-3d',
                // transform: `perspective(1200px) rotateX(${slideNormalizedOffset3 * 10 + 10}deg) rotateY(${slideNormalizedOffset3 * 70}deg) scale(${Math.min(1 + slideNormalizedOffset3 / 1.5, 1)}) translateY(10vh)`,
                transform: `perspective(1200px) rotateX(0deg) rotateY(${slideNormalizedOffset3 * 70}deg) scale(${Math.min(1 + slideNormalizedOffset3 / 1.5, 1)}) translateY(-2vh)`,
                translate: '0.4s ease all',
              }}
            >
              <Box width='100%' style={{ borderRadius: '10px', background: '#191919 url(imgs/ellipse-tutorial-2.svg) no-repeat top left / cover', padding: '24px 12px', minHeight: '19.375rem'}}>
                <Flex direction='column' align='center' justify='center' gap='1' height='100%'>
                  <img src="imgs/step3.png" width='323' height='262' alt="" />
                </Flex>
              </Box>

              <Box pt='8' pb='2' style={{ textAlign: 'center'}}>
                <Flex direction='column' align='center' gap='1'>
                  <Heading size='4'>Complete Fast tasks!</Heading>
                  <Text size={{ xs: '2', sm: '4' }}>
                    Earn up to 1000 M2E for each tasks
                  </Text>
                </Flex>
              </Box>

            </Flex>

            <Button
              size='3'
              onClick={handleNextSlide}
              style={{
                position: 'absolute',
                width: 'calc(100% - 32px)',
                bottom: '20px',
                right: '50%',
                transform: 'translateX(50%)',
                textTransform: 'uppercase',
                fontWeight: 'bold',
                zIndex: '9999',
              }}
            >
              Alright
            </Button>
          </div>
          <div className='swiper-slide' style={{ overflowX: 'hidden'}}>
            <Flex
              height='100%'
              direction='column'
              justify='center'
              align='center'
              ml='16px'
              mr='16px'
              style={{
                transformStyle: 'preserve-3d',
                // transform: `perspective(1200px) rotateX(${slideNormalizedOffset4 * 10 + 10}deg) rotateY(${slideNormalizedOffset4 * 70}deg) scale(${Math.min(1 + slideNormalizedOffset4 / 1.5, 1)}) translateY(10vh)`,
                transform: `perspective(1200px) rotateX(0deg) rotateY(${slideNormalizedOffset4 * 70}deg) scale(${Math.min(1 + slideNormalizedOffset4 / 1.5, 1)}) translateY(0vh)`,
                translate: '0.4s ease all',
                overflowX: 'hidden'
              }}
            >
              <Box width='100%' style={{ borderRadius: '10px', background: '#191919 url(imgs/ellipse-tutorial-4.svg) no-repeat top left / cover', padding: '12px 0px 12px 12px', minHeight: '19.375rem'}}>
                <Flex direction='column' align='start' justify='between' gap='3'>
                  <Heading size='3'>Airdrop tasks</Heading>
                  <Flex gap='2'>
                    <img src="imgs/step4-1.png" width='236' height='243' alt="" />
                    <img src="imgs/step4-2.png" width='236' height='243' alt="" />
                  </Flex>
                </Flex>
              </Box>

              <Box pt='7' pb='2' style={{ textAlign: 'center'}}>
                <Flex direction='column' align='center' gap='1'>
                  <Heading size='4'>Create content!</Heading>
                  <Box style={{ maxWidth: '28ch'}}>
                    <Text size={{ xs: '2', sm: '4' }}>
                      You will post content in socials and earn more than 10 000 M2E daily
                    </Text>
                  </Box>
                </Flex>
              </Box>
            </Flex>

            <GlowingButton
              size='3'
              onClick={handleTutorialCompleted}
              style={{
                position: 'absolute',
                width: 'calc(100% - 32px)',
                bottom: '20px',
                right: '50%',
                transform: 'translateX(50%)',
                textTransform: 'uppercase',
                fontWeight: 'bold',
                zIndex: '9999',
              }}
            >
              Make Money
            </GlowingButton>
          </div>
        </div>
        <div className='swiper-pagination'></div>
      </SwiperDiv>
    </>
    
    
  );
};

export default Tutorial;
