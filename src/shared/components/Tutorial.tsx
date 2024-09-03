import React, { FC } from 'react';
import Stories from 'react-insta-stories';
import { Story } from 'react-insta-stories/dist/interfaces';
import { Button } from '@radix-ui/themes';

const stories: Story[] = [
  {
    url: 'https://api.meme-factory.site/uploads/tutorial/26ba574c-2c1b-4030-8711-c0b6e24f52d2_mmfctry.webp',
    duration: 6000,
  },
];

interface TutorialProps {
  onComplete: () => void;
}

const Tutorial: FC<TutorialProps> = ({ onComplete }) => {
  const handleTutorialCompleted = () => {
    localStorage.setItem('onboardCompleted', 'true');
    onComplete();
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <Stories
        stories={stories}
        width='100vw'
        height='100vh'
        defaultInterval={1500}
        onAllStoriesEnd={handleTutorialCompleted}
      />
      <Button
        onClick={handleTutorialCompleted}
        variant='ghost'
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: '1001',
        }}
      >
        Skip all
      </Button>
    </div>
  );
};

export default Tutorial;
