import { useCallback, useEffect, useState } from 'react';
import {
  Flex,
  Heading,
  Text,
  Box,
  IconButton,
  Callout,
  Card,
} from '@radix-ui/themes';
import { useNavigate } from 'react-router-dom';
import { useWebApp } from '@vkruglikov/react-telegram-web-app';
import styled from 'styled-components';
import QuestGuide from './components/QuestGuide/QuestGuide';
import Lottie from 'lottie-react';
import shiba from "../../shared/components/LottieIcons/Shiba/shiba.json";
import GlowingButton from '../../shared/components/Buttons/GlowingButton';
import LottieInView from '../../shared/components/LottieIcons/InView/LottieInView';

const FixedHelpButton = styled(IconButton)`
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 5;
`;


export const setSeenProjectGuide = (id: string) => {
  let guides = JSON.parse(localStorage.getItem("guides") || "[]");

  if (guides.includes(id)) return;

  guides.push(id);

  localStorage.setItem("guides", JSON.stringify(guides));
};

export const getSeenProjectGuide = (id: string) => {
  let guides = JSON.parse(localStorage.getItem("guides") || "[]");

  console.log("id: ", id, guides, guides.includes(id));
  return guides.includes(id);
}

const PreProjectPage = (props: {
  projectId: string
  btnClickHandler?: () => void
}) => {
  const isSeenProjectGuide = getSeenProjectGuide(props.projectId.toString());
  const [isModalVisible, setModalVisible] = useState(false);

  const handleDialogClose = () => {
    setModalVisible(false);
  };

  const handleDialogOpen = () => {
    setModalVisible(true);
  };

  return (
    <>
      <Flex direction='column' style={{ userSelect: 'text', paddingBottom: "108px" }} align="center" pl="6" pr="6" gap="4">
        <Flex justify="center" align="center" direction="column" >
          <LottieInView style={{ maxHeight: "40vh" }} animationData={shiba} />
          <Heading align="center">Ready to earn a lot of <b>M2E</b> points?</Heading>
        </Flex>
        <Box width="100%">
          <Callout.Root color='gray' mb='4'>
            <Callout.Text>
              {/* <img height="1rem" src={process.env.PUBLIC_URL + '/imgs/down.png'} /> */}
              <Text align="center">Take a look on guide to see how you are going to earn points with quest</Text>
              {/* Click join to start Quest */}
            </Callout.Text>
          </Callout.Root>

          <Box asChild p="4" position="fixed" bottom="0" left="0" right="0">
            <Card style={{ background: 'var(--gray-1)' }} >
              <GlowingButton
                onClick={() => handleDialogOpen()}
                size='4'
                style={{
                  width: '100%',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginBottom: '10px',
                }}
              >
                Guide
              </GlowingButton>
            </Card>
          </Box>

          <QuestGuide
            isBtnVisible={!isSeenProjectGuide}
            isModalVisible={isModalVisible}
            handleDialogClose={handleDialogClose}
            handleBtnClick={() => {
              setSeenProjectGuide(props.projectId.toString())

              setModalVisible(false);
              if (props.btnClickHandler) {
                setTimeout(props.btnClickHandler, 700);
              }
            }}
          />

        </Box>
      </Flex>
    </>
  );
};

export default PreProjectPage;
