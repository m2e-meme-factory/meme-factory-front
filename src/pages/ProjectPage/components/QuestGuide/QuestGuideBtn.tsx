import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import React, { useState } from 'react';
import styled from 'styled-components';
import { Badge, Box, Card, Flex, Heading, IconButton, Text, Theme } from '@radix-ui/themes';
import { Sheet } from 'react-modal-sheet';
import yeyEmoji from '../../../../shared/imgs/yey.png';
import '../../../../styles/CustomSheetsStyles.css';
import GlowingButton from '../../../../shared/components/Buttons/GlowingButton';

const FixedHelpButton = styled(IconButton)`
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 5;
`;

const QuestGuideBtn = () => {
  const [isModalVisible, setModalVisible] = useState(false);

  return (
    <>
      <FixedHelpButton size='3' onClick={() => setModalVisible(true)}>
        <QuestionMarkCircledIcon width='25' height='25' />
      </FixedHelpButton>
      <Sheet isOpen={isModalVisible} onClose={() => setModalVisible(false)} detent='content-height'>
        <Theme appearance='dark'>
          <Sheet.Container>
            <Sheet.Header />
            <Sheet.Content>
              <Theme>
                <Heading mb='4' align='center' size='8'>
                  What should I do?
                </Heading>

                <Box m='4' mb='8'>
                  <Flex direction='column' gap='2'>
                    <Card>
                      <Flex gap='4' align='center' p='1'>
                        <Box>
                          <Text size='8' weight='bold'>
                            1
                          </Text>
                        </Box>
                        <Box>
                          <Box>Join Quest</Box>
                          <Box>
                            <Text size='1' color='gray'>
                              Join Quest with message based on requirements
                            </Text>
                          </Box>
                        </Box>
                      </Flex>
                    </Card>

                    <Card>
                      <Flex gap='4' align='center' p='1'>
                        <Box>
                          <Text size='8' weight='bold'>
                            2
                          </Text>
                        </Box>
                        <Box>
                          <Box>Await Approval</Box>
                          <Box>
                            <Text size='1' color='gray'>
                              Wait until the advertiser approves
                            </Text>
                          </Box>
                        </Box>
                      </Flex>
                    </Card>

                    <Card>
                      <Flex gap='4' align='center' p='1'>
                        <Box>
                          <Text size='8' weight='bold'>
                            3
                          </Text>
                        </Box>
                        <Flex justify='between' width='100%' align='center'>
                          <Box>
                            <Box>Complete Tasks</Box>
                            <Box>
                              <Text size='1' color='gray'>
                                Complete listed tasks
                              </Text>
                            </Box>
                          </Box>
                        </Flex>
                      </Flex>
                    </Card>

                    <Card>
                      <Flex gap='4' align='center' p='1'>
                        <Box>
                          <Text size='8' weight='bold'>
                            4
                          </Text>
                        </Box>
                        <Flex justify='between' width='100%' align='center'>
                          <Box>
                            <Box>Get Reward</Box>
                            <Box>
                              <Text size='1' color='gray'>
                                Get <Badge color='bronze'>M2E</Badge> for each completed task
                              </Text>
                            </Box>
                          </Box>
                          <img
                            style={{
                              height: 'var(--font-size-8)',
                            }}
                            src={yeyEmoji}
                          />
                        </Flex>
                      </Flex>
                    </Card>
                  </Flex>
                </Box>

              </Theme>
            </Sheet.Content>
          </Sheet.Container>
          <Sheet.Backdrop onTap={() => setModalVisible(false)} />
        </Theme>
      </Sheet>
    </>
  );
};

export default QuestGuideBtn;
