import { FC, useEffect, useRef, useState } from 'react';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Button, Card, Flex, Text } from '@radix-ui/themes';
import { Link, useNavigate } from 'react-router-dom';
import profile from './../imgs/profile.webp';
import autotasks from './../imgs/airdrop.webp';
import projects from './../imgs/projects.webp';

interface TutorialProps {
  onComplete: () => void;
}

const Tutorial: FC<TutorialProps> = ({ onComplete }) => {
  const swiperRef = useRef<Swiper | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

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
        setCurrentSlideIndex(swiperRef.current?.activeIndex);
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

  return (
    <div className='swiper'>
      <div className='swiper-wrapper'>
        <div className='swiper-slide'>
          <Flex direction='column'>
            <img
              src={autotasks}
              alt='Profile illustration'
              style={{
                height: '80vh',
                objectFit: 'contain',
                animation: 'updown 6s linear infinite',
              }}
            />
            <Card
              style={{
                position: 'absolute',
                bottom: '12vh',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80%',
              }}
            >
              <Text weight='regular' size='3' style={{ textAlign: 'justify' }}>
                На нашей фабрике мемов очень просто зарабатывать: Самый простой вариант -{' '}
                <Link
                  onClick={() => {
                    handleTutorialCompleted();
                  }}
                  style={{ color: 'var(--brand-color)' }}
                  to='/projects/autotasks'
                >
                  это участвовать в airdrop
                </Link>
                . Подпишись на наши соцсети и получи свои первые мем койны.
              </Text>
            </Card>
          </Flex>
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
            Next
          </Button>
        </div>
        <div className='swiper-slide'>
          <Flex direction='column'>
            <img
              src={profile}
              alt='Autotask illustration'
              style={{
                height: '80vh',
                objectFit: 'contain',
                animation: 'updown 6s linear infinite',
              }}
            />

            <Card
              style={{
                position: 'absolute',
                bottom: '12vh',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80%',
              }}
            >
              <Text weight='regular' size='3' style={{ textAlign: 'justify' }}>
                Второй вариант - это приглашать друзей! За каждого приглашенного криейтора ты
                получишь 100 мем койнов. Просто{' '}
                <Link
                  onClick={() => {
                    handleTutorialCompleted();
                  }}
                  style={{ color: 'var(--brand-color)' }}
                  to='/profile'
                >
                  делись своей реферальной ссылкой.
                </Link>
              </Text>
            </Card>
          </Flex>
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
            Next
          </Button>
        </div>
        <div className='swiper-slide'>
          <Flex direction='column'>
            <img
              src={projects}
              alt='Projects illustration'
              style={{
                height: '80vh',
                objectFit: 'contain',
                animation: 'updown 6s linear infinite',
              }}
            />

            <Card
              style={{
                position: 'absolute',
                bottom: '12vh',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80%',
              }}
            >
              <Text weight='regular' size='3' style={{ textAlign: 'justify' }}>
                И третий, беспроигрышный вариант - это выкладывать контент! Для этого{' '}
                <Link
                  onClick={() => {
                    handleTutorialCompleted();
                  }}
                  style={{ color: 'var(--brand-color)' }}
                  to='/projects'
                >
                  выбирай проекты
                </Link>{' '}
                и выполняй задания.
              </Text>
            </Card>
          </Flex>
          <Button
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
            Make money
          </Button>
        </div>
      </div>
      <div className='swiper-pagination'></div>
    </div>
  );
};

export default Tutorial;
