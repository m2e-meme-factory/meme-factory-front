import { JSXElementConstructor, ReactElement, useEffect, useRef, useState } from 'react';
import { Box, Tabs, ScrollArea } from '@radix-ui/themes';
import styled from 'styled-components';
import { Swiper, SwiperClass, SwiperSlide, useSwiper } from 'swiper/react';
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
  const [tabIndex, setTabIndex] = useState(currentTabIndex);
  const [realTabIndex, setRealTabIndex] = useState(0);
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);

  useEffect(() => {
    console.log(realTabIndex, tabIndex)
  }, [tabIndex, realTabIndex])

  useEffect(() => {
    handleTabChangeByIndex(currentTabIndex)
  }, [currentTabIndex])

  const handleSlideChange = (swiper: SwiperClass) => {
    setTabIndex(swiper.activeIndex);
  }


  const handleTabChangeByIndex = (index: number) => {
    if (index < 0 || index >= tabs.length || !isWorking) return;

    setTabIndex(index);
    swiper?.slideTo(index);

    window.scrollX = 0
  };

  return (
    <Tabs.Root
      defaultValue="public"
      onValueChange={(value: string) => handleTabChangeByIndex(Number(value))}
      value={tabIndex.toString()}
    >
      <Tabs.List justify={justifyTabs} style={{ width: "100%", background: "#000" }}>
        {tabs.map((tab, index) => (
          <Tabs.Trigger disabled={!isWorking} key={index} value={index.toString()}>
            {tab.name}
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      <Box>
        <Swiper
          initialSlide={tabIndex}
          onSlideChange={handleSlideChange}
          onSwiper={(swiper: SwiperClass) => setSwiper(swiper)}
        >
          {tabs.map((tab, index) => (
            <SwiperSlide style={{ height: "calc(100vh - 40px)" }} key={index}>
              {({ isActive, isPrev, isNext }) =>
                (isActive || isPrev || isNext) && (
                  tab.scrollable ? (
                    <ScrollArea scrollbars="vertical" style={{ maxHeight: "98vh" }}>
                      {tab.component}
                    </ScrollArea>
                  ) : (
                    tab.component
                  )
                )
              }
            </SwiperSlide>
          ))}

        </Swiper>

      </Box>
    </Tabs.Root>
  );
};

export default SwipableTabs;
