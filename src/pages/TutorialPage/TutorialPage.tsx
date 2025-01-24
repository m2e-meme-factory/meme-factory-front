import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Tutorial from '@shared/components/Tutorial';

export default function TutorialPage() {
  const navigate = useNavigate();
  const [isTutorialCompleted, setIsTutorialCompleted] = useState(
    localStorage.getItem('onboardCompleted') === 'true'
  );

  useEffect(() => {
    const onboardCompleted = localStorage.getItem('onboardCompleted') === 'true';
    if (onboardCompleted && !isTutorialCompleted) {
      setIsTutorialCompleted(true);
    }
  }, []);

  const handleTutorialComplete = () => {
    localStorage.setItem('onboardCompleted', 'true');
    setIsTutorialCompleted(true);
  };

  if (!isTutorialCompleted) {
    return <Tutorial onComplete={handleTutorialComplete} />;
  } else {
    navigate(-1);
  }

  return null;
}
