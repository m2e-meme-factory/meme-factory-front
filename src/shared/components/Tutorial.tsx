import { FC, useEffect, useRef, useState } from 'react';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Button, Text } from '@radix-ui/themes';

interface TutorialProps {
  onComplete: () => void;
}

const Tutorial: FC<TutorialProps> = ({ onComplete }) => {
  const swiperRef = useRef<Swiper | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

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
          <Text weight='medium' size='4' style={{ textAlign: 'justify', margin: '0 5vw' }}>
            Приветствую тебя, Создатель! С нами ты можешь стать мощным инфлюенсером и продвигать
            бренды со всего мира!
          </Text>
        </div>
        <div className='swiper-slide'>
          <Text weight='medium' size='4' style={{ textAlign: 'justify', margin: '0 5vw' }}>
            Meme Factory - первая Meme-To-Earn платформа, где люди постят мемы и зарабатывают на
            этом, а бренды повышают узнаваемость за счет рекламных интеграций.
          </Text>
        </div>
        <div className='swiper-slide'>
          <Text weight='medium' size='4' style={{ textAlign: 'justify', margin: '0 5vw' }}>
            Как получить Airdrop и заработать (в 1-2 сообщении): - Приглашай друзей 10 000 -
            Выкладывай в соцсети контент о проекте - Отмечай нас в соцсетях - Делай активности
            (комментируй, лайкай и т.д.) И участвуй в эйрдроп
          </Text>
        </div>
        <div className='swiper-slide'>
          <Text weight='medium' size='4' style={{ textAlign: 'justify', margin: '0 5vw' }}>
            Меня зовут Скай, я помогаю брендам улетать в небеса, ха-ха Я расскажу тебе, как мы тут
            работаем. Все просто, как никогда! 1. Берем популярный мем на английском языке, либо
            создаем уникальный 2. Скачиваем промо материалы от рекламодателя (анимацию) 3.
            Накладываем анимацию/лого/текст 4. Указываем аккаунт рекламодателя соавтором или
            упоминаем его
          </Text>
        </div>
        <div className='swiper-slide'>
          <Text weight='medium' size='4' style={{ textAlign: 'justify', margin: '0 5vw' }}>
            Тебя приветствует твой первый заказчик - Фабрика Мемов (Meme Factory) Мы хотим, чтобы о
            нас знали везде и нам нужна твоя помощь! Выкладывай контент в соцсетях и получай поинты
            ЕЖЕДЕНЕВНО
          </Text>
        </div>
      </div>
      <div className='swiper-pagination'></div>
      <Button
        size='3'
        onClick={currentSlideIndex !== 4 ? handleNextSlide : handleTutorialCompleted}
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '50%',
          transform: 'translateX(50%)',
          zIndex: '9999',
        }}
      >
        {currentSlideIndex === 4 ? 'Make money' : 'Next'}
      </Button>
    </div>
  );
};

export default Tutorial;
