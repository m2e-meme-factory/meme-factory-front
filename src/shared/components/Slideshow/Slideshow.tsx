import React from 'react';
import styles from './Slideshow.module.css'


const colors = ["#0088FE", "#00C49F", "#FFBB28"];
const delay = 8500;

export default function Slideshow() {
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
        {colors.map((backgroundColor, index) => (
          <div
            className={styles.slide}
            key={index}
            style={{ backgroundColor }}
          >{index}</div>
        ))}
      </div>

      <div className={styles.slideshowDots}>
        {colors.map((_, idx) => (
          <div
            key={idx}
            className={`${styles.slideshowDot} ${index === idx ? styles.active : styles.slideshowDot}`}
            onClick={() => {
              setIndex(idx);
            }}
          >
            {idx + 1}
          </div>
        ))}
      </div>
    </div>
  );
}