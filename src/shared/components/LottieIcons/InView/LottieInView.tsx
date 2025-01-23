import React, { useState, useRef, useEffect } from 'react';
import Lottie from 'lottie-react';
import { LottieComponentProps } from 'lottie-react';

interface LottieInViewProps {
  animationData: LottieComponentProps['animationData'];
  style?: React.CSSProperties;
}

const LottieInView: React.FC<LottieInViewProps> = ({ style, animationData }) => {
  const [isInView, setIsInView] = useState(false);
  const lottieRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );

    if (lottieRef.current) {
      observer.observe(lottieRef.current);
    }

    return () => {
      if (lottieRef.current) {
        observer.unobserve(lottieRef.current);
      }
    };
  }, []);

  return (
    <div ref={lottieRef} style={{ height: '100%', overflow: 'hidden' }}>
      <Lottie
        style={style}
        animationData={animationData}
        loop={isInView}
        autoplay={isInView}
      />
    </div>
  );
}

export default LottieInView;
