import React from 'react';
import styles from './Slideshow.module.css'

const delay = 8500;

export default function Slideshow({ nft } : { nft: any, style?: React.CSSProperties }) {
  const [index, setIndex] = React.useState(0);
  const timeoutRef = React.useRef(null);

  function resetTimeout() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }

  React.useEffect(() => {
    resetTimeout();
    
    // setTimeout(
    //   () =>
    //     setIndex((prevIndex) =>
    //       prevIndex === colors.length - 1 ? 0 : prevIndex + 1
    //     ),
    //   delay
    // );

    return () => {
      resetTimeout();
    };
  }, [index]);

  return (
    <div className={styles.slideshow}>
      <div
        className={styles.slideshowSlider}
        style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}
      >
        {nft.map((item: any, index: any) => (
          <div
            className={styles.slide}
            key={index}
            style={{  }}
          >{item.name}</div>
        ))}
      </div>

      <div className={styles.slideshowDots}>
        {nft.map((item: any, idx: any) => (
          <div
            key={idx}
            className={`${styles.slideshowDot} ${index === idx ? styles.active : styles.slideshowDot}`}
            onClick={() => {
              setIndex(idx);
            }}
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}