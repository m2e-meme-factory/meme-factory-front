import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import React, { useState } from 'react';
import styled from 'styled-components';
import { Badge, Box, Card, Flex, Heading, IconButton, Text, Theme } from '@radix-ui/themes';
import { Sheet } from 'react-modal-sheet';
import '../../../../styles/CustomSheetsStyles.css';
import GlowingButton from '../../../../shared/components/Buttons/GlowingButton';
import { GuideList } from './GuideList';

const FixedHelpButton = styled(IconButton)`
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 5;
`;

const QuestGuide = (props: {
  isBtnVisible: boolean;
  isModalVisible: boolean;
  handleDialogClose: () => void;
  handleBtnClick?: () => void;
}) => {

  return (
    // <FixedHelpButton size='3' onClick={handleDialogOpen}>
    //   <QuestionMarkCircledIcon width='25' height='25' />
      <Sheet isOpen={props.isModalVisible} onClose={() => props.handleDialogClose()} detent='content-height'>
        <Theme appearance='dark'>
          <Sheet.Container>
            <Sheet.Header />
            <Sheet.Content>
              <Theme>
                <Heading mb='4' align='center' size='8'>
                  What should I do?
                </Heading>

                <Box m='4' mb='8'>
                  <GuideList />
                  {props.isBtnVisible && 
                    <GlowingButton style={{width: "100%"}} mt="4" onClick={props.handleBtnClick} size="4">Begin Quest</GlowingButton>
                  }
                </Box>

              </Theme>
            </Sheet.Content>
          </Sheet.Container>
          <Sheet.Backdrop onTap={() => props.handleDialogClose()} />
        </Theme>
      </Sheet>
    // </FixedHelpButton>
  );
};

export default QuestGuide;
