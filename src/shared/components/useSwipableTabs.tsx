import { JSXElementConstructor, ReactElement, useEffect, useRef, useState } from 'react';
import { Flex, Box, Tabs, ScrollArea } from '@radix-ui/themes';
import styled from 'styled-components';
import { useSwipeable } from 'react-swipeable';
import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const SwiperContainer = styled.div`
  .swiper {
    width: 100%;
    z-index: 0;
  }

  .swiper-slide {
    overflow-y: none;
    z-index: 0;
  }

  .screen-without-tabs {
    height: calc(100vh - 40px);
  }
`;

interface SwipableTabsProps {
  tabs: {
    name: ReactElement<any, string | JSXElementConstructor<any>> | string;
    component: ReactElement<any, string | JSXElementConstructor<any>>;
    scrollable?: boolean
    slideClass?: string
  }[];
  isWorking?: boolean;
  currentTabIndex?: number;
  justifyTabs?: "center" | "start" | "end";
}

const SwipableTabs: React.FC<SwipableTabsProps> = ({ tabs, currentTabIndex = 0, justifyTabs = 'center', isWorking = true }) => {
  const swiperRef = useRef<Swiper | null>(null);
  const [tabIndex, setTabIndex] = useState(currentTabIndex);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleTabChangeByIndex(tabIndex + 1),
    onSwipedRight: () => handleTabChangeByIndex(tabIndex - 1),
    trackMouse: true,
  });


  useEffect(() => {
    // if (swiperRef.current) {
    //   swiperRef.current?.
    //   swiperRef.current?.allowSlideNext = false
    // }
  }, [isWorking]);

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.on('slideChange', () => {
        const newIndex = swiperRef.current!.activeIndex;
        if (newIndex !== tabIndex) {
          setTabIndex(newIndex);
        }
      });
    }
  }, [tabIndex]);
  
  useEffect(() => {
    swiperRef.current = new Swiper('.swiper', {
      direction: 'horizontal',
    });

    if (swiperRef.current) {
      swiperRef.current.on('slideChange', () => {
        setTabIndex(swiperRef.current!.activeIndex);
      });
    }


    return () => {
      if (swiperRef.current) {
        swiperRef.current.destroy(true, true);
        swiperRef.current = null;
      }
    };
  }, []);

  
  useEffect(() => {
    handleTabChangeByIndex(currentTabIndex)
  }, [currentTabIndex])


  const handleTabChangeByIndex = (index: number) => {
    if (index < 0 || index >= tabs.length || !isWorking) return;

    
    setTabIndex(index);
    swiperRef.current?.slideTo(index);
    console.log(index, swiperRef.current?.activeIndex, tabs.length - 1, swiperRef.current?.slides)
    window.scrollX = 0
  };

  return (
    <div {...swipeHandlers} style={{height: "100%"}}>
      <Tabs.Root
        defaultValue="public"
        onValueChange={(value: string) => handleTabChangeByIndex(Number(value))}
        value={tabIndex.toString()}
      >
        <Tabs.List justify={justifyTabs} style={{width: "100%", background: "#000"}}>
            {tabs.map((tab, index) => (
              <Tabs.Trigger disabled={!isWorking} key={index} value={index.toString()}>
                {tab.name}
              </Tabs.Trigger>
            ))}
        </Tabs.List>

        <Box>
          <SwiperContainer>
            <div className="swiper" style={{ width: '100%' }}>
              <div className="swiper-wrapper">
                {tabs.map((tab, index) => (
                  <div className={`${tab.slideClass || ""} swiper-slide`} key={index}>
                    {tab.scrollable ? (
                      <ScrollArea scrollbars="vertical" style={{maxHeight: "98vh"}}>
                      {tab.component}
                      </ScrollArea>
                    ) : tab.component }
                  </div>
                ))}
              </div>
            </div>
          </SwiperContainer>
        </Box>
      </Tabs.Root>
    </div>
  );
};

export default SwipableTabs;
