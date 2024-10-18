import React, { useCallback, useEffect, useState } from 'react';
import {
  Badge,
  Button,
  Flex,
  Heading,
  Text,
  Dialog,
  TextArea,
  Link,
  Separator,
  Box,
  Theme,
  Card,
  IconButton,
} from '@radix-ui/themes';
import { UnorderedListOutlined } from '@ant-design/icons';
import styles from './ProjectPage.module.css';
import TaskDescriptionDisplay from './components/Description/DescriptionSection';
import { useGetProject } from '../../shared/utils/api/hooks/project/useGetProject';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../shared/utils/redux/store';
import Loading from '../../shared/components/Loading';
import { setProject } from '../../shared/utils/redux/project/projectSlice';
import { Project, ProjectProgress } from 'api';
import { downloadFiles } from '../../shared/utils/api/requests/files/downloadFile';
import { useApplyForProject } from '../../shared/utils/api/hooks/project/useApplyForProject';
import { useGetProgress } from '../../shared/utils/api/hooks/project/useGetProjectProgress';
import fallbackBanner from './../../shared/imgs/fallbackBanner.png';
import { showErrorMessage, showToastWithPromise } from '../../shared/utils/helpers/notify';
import { Role } from '../../shared/consts/userRoles';
import { shortenString } from '../../shared/utils/helpers/shortenString';
import { BASE_URL } from '../../shared/consts/baseURL';
import GlowingButton, { AccentButton } from '../../shared/components/Buttons/GlowingButton';
import SheetSubtaskCard from './components/SubtaskCard/SheetSubtaskCard';
import { useWebApp } from '@vkruglikov/react-telegram-web-app';
import { DrawingPinIcon, QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import { Sheet } from 'react-modal-sheet';
import yeyEmoji from '../../shared/imgs/yey.png';
import styled from 'styled-components';
import AttachmentCard from './components/AttachmentCard/AttachmentCard';

export type UserRoleInProject =
  | 'projectOwner'
  | 'guestAdvertiser'
  | 'guestCreator'
  | 'projectMember'
  | 'unconfirmedMember';

const FixedHelpButton = styled(IconButton)`
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 5;
`;

const ProjectPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<UserRoleInProject>('guestCreator');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isApplyLoading, setIsApplyLoading] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState<string>('');
  const [progress, setProgress] = useState<ProjectProgress>();
  const [applyBlocked, setApplyBlocked] = useState<boolean>(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [downloadSheetVisible, setDownloadSheetVisible] = useState(false);

  const webapp = useWebApp();

  const handleBack = useCallback(() => {
    navigate(-1);
    webapp.BackButton.hide();
  }, [navigate, webapp]);

  useEffect(() => {
    webapp.ready();
    webapp.BackButton.show();
    webapp.onEvent('backButtonClicked', handleBack);

    return () => {
      webapp.offEvent('backButtonClicked', handleBack);
      webapp.BackButton.hide();
    };
  }, [handleBack, webapp]);

  const user = useSelector((state: RootState) => state.user.user);

  const { data: projectInfoResponse, isLoading } = useGetProject(id);
  const { data: progressesResponse, isLoading: isProjectProgressLoading } = useGetProgress({
    projectId: id ?? '',
    userId: user?.id,
  });
  const { mutate: applyMutation } = useApplyForProject(
    setIsApplyLoading,
    setApplyBlocked,
    setCurrentUserRole
  );

  useEffect(() => {
    if (projectInfoResponse) {
      setCurrentProject(projectInfoResponse.data);
      dispatch(setProject(projectInfoResponse.data));
    }
  }, [projectInfoResponse, dispatch]);

  useEffect(() => {
    if (progressesResponse && progressesResponse.data.length === 1) {
      const userProgress = progressesResponse.data[0];
      setProgress(userProgress);
      if (userProgress) {
        setCurrentUserRoleFromProgress(userProgress.status);
      }
    }
  }, [progressesResponse]);

  useEffect(() => {
    if (user && currentProject) {
      determineUserRole(user, currentProject);
    }
  }, [user, currentProject]);

  const determineUserRole = (user: RootState['user']['user'] | undefined, project: Project) => {
    if (!user) return;

    if (user.role === Role.ADVERTISER) {
      setCurrentUserRole(user.id === project.project.authorId ? 'projectOwner' : 'guestAdvertiser');
    } else {
      if (currentUserRole !== 'projectOwner' && currentUserRole !== 'guestAdvertiser') {
        if (currentUserRole === 'projectMember' || currentUserRole === 'unconfirmedMember') {
          return;
        }
        setCurrentUserRole('guestCreator');
      }
    }
  };

  const handleDialogClose = () => {
    setModalVisible(false);
  };

  const handleDialogOpen = () => {
    setModalVisible(true);
  };

  const handleDownloadSheetClose = () => {
    setDownloadSheetVisible(false);
  };

  const handleDownloadSheetOpen = () => {
    setDownloadSheetVisible(true);
  };

  const setCurrentUserRoleFromProgress = (status: string) => {
    if (status === 'accepted') {
      setCurrentUserRole('projectMember');
    } else if (status === 'pending') {
      setCurrentUserRole('unconfirmedMember');
    } else {
      setCurrentUserRole('guestCreator');
    }
  };

  if (isLoading || isProjectProgressLoading) {
    return <Loading />;
  }

  const handleEditClick = () => {
    navigate('edit');
  };

  const handleApplyClick = () => {
    setIsApplyLoading(true);
    if (currentProject && user) {
      if (applicationMessage.trim() === '') {
        showErrorMessage('Application message cannot be empty or just whitespace.');
        setIsApplyLoading(false);
        return;
      }

      applyMutation({
        params: {
          projectId: currentProject.project.id,
          message: applicationMessage,
        },
      });
    }
  };

  const handleTextAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setApplicationMessage(event.target.value);
  };

  const bannerLink = currentProject?.project.bannerUrl
    ? `${BASE_URL}${currentProject?.project.bannerUrl}`
    : fallbackBanner;

  return (
    <Flex direction='column' style={{ userSelect: 'text' }}>
      {/* Banner */}
      <Flex className={styles.bannerContainer}>
        <img src={bannerLink} alt='banner' className={styles.bannerImage} />
      </Flex>
      {/* Title */}
      <FixedHelpButton size='3' onClick={handleDialogOpen}>
        <QuestionMarkCircledIcon width='25' height='25' />
      </FixedHelpButton>
      <Flex direction='column'>
        <Flex m='4' mt='2' gap='5' direction='column'>
          <Heading weight='medium'>{currentProject?.project.title}</Heading>
          {currentUserRole === 'projectOwner' && (
            <Button onClick={handleEditClick} my='2' size='4'>
              Edit project
            </Button>
          )}

          {/* Description */}
          <Flex mb='2' mt='2' direction='column'>
            <TaskDescriptionDisplay description={currentProject?.project.description || ''} />
            <Button mt='2' onClick={() => handleDownloadSheetOpen()}>
              Download attachments
            </Button>
            <Sheet
              isOpen={downloadSheetVisible}
              onClose={() => handleDownloadSheetClose()}
              detent='content-height'
            >
              <Sheet.Container style={{ overflowY: 'auto', background: '#121113' }}>
                <Sheet.Header />
                <Sheet.Content>
                  <Theme style={{ width: '100%' }}>
                    <Flex direction='row' gap='2' mb='2' align='center'>
                      <DrawingPinIcon width='20' height='20' />
                      <Text size='5'>Attachments:</Text>
                    </Flex>
                    <Flex direction='column' gap='2' justify='center'>
                      {currentProject?.project.files.map((file) => (
                        <AttachmentCard name={file} key={file} />
                      ))}
                    </Flex>
                  </Theme>
                </Sheet.Content>
              </Sheet.Container>
              <Sheet.Backdrop onTap={() => handleDownloadSheetClose()} />
            </Sheet>
          </Flex>

          {(currentUserRole === 'projectMember' || currentUserRole === 'unconfirmedMember') && (
            <AccentButton my='2' size='4' onClick={() => navigate(`logs/${user?.id}`)}>
              View History
            </AccentButton>
          )}

          {/* Join project modal */}
          {currentUserRole === 'guestCreator' && (
            <Dialog.Root>
              <Dialog.Trigger>
                <GlowingButton
                  size='4'
                  style={{
                    width: '100%',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    marginBottom: '10px',
                  }}
                  disabled={applyBlocked}
                >
                  Join
                </GlowingButton>
              </Dialog.Trigger>

              <Dialog.Content maxWidth='450px'>
                <Dialog.Title>Apply for the project</Dialog.Title>

                <Flex direction='column'>
                  <TextArea
                    style={{ height: '20vh' }}
                    size='2'
                    placeholder='I have one million subscribers on my Youtube channel'
                    value={applicationMessage}
                    onChange={handleTextAreaChange}
                  />
                </Flex>

                <Flex gap='3' mt='4' justify='end'>
                  <Dialog.Close>
                    <Button variant='soft' color='gray'>
                      Cancel
                    </Button>
                  </Dialog.Close>
                  <Dialog.Close>
                    <Button
                      onClick={handleApplyClick}
                      loading={isApplyLoading}
                      disabled={applicationMessage.length === 0}
                    >
                      Join
                    </Button>
                  </Dialog.Close>
                </Flex>
              </Dialog.Content>
            </Dialog.Root>
          )}

          {/* Tasks */}
          <Flex direction='column' mb='3'>
            <Flex align='center' mb='2'>
              <UnorderedListOutlined style={{ color: 'yellow', marginRight: '8px' }} />
              <Text weight='medium' size='5'>
                Tasks
              </Text>
            </Flex>
            <Flex gap='3' direction='column'>
              {currentProject?.project.tasks &&
                currentProject?.project.tasks.map((subtask, index) => (
                  <SheetSubtaskCard
                    key={index}
                    id={subtask.task.id}
                    description={subtask.task.description}
                    price={subtask.task.price}
                    title={subtask.task.title}
                    progress={progress}
                    userRole={currentUserRole || 'guestCreator'}
                  />
                ))}
            </Flex>
          </Flex>

          {/* Category and tags */}
          <Box>
            <Flex align='center' direction='row' mb='2'>
              {currentProject?.project && (
                <>
                  <Text weight='medium' mr='2'>
                    {currentProject.project.category?.toUpperCase()}
                  </Text>
                  <Separator mr='2' orientation='vertical' />
                  <Text weight='medium' size='5'>
                    {currentProject.project.tags?.map((tag, index) => (
                      <Badge size='3' key={index} style={{ marginLeft: index > 0 ? '8px' : '0' }}>
                        {tag.toUpperCase()}
                      </Badge>
                    ))}
                  </Text>
                </>
              )}
            </Flex>

            {/* Host */}
            <Flex direction='row' align='center'>
              <Flex
                style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: '13px',
                  background: 'var(--gray-2)',
                }}
                mr='2'
                align='center'
                justify='center'
              >
                <Text weight='bold' size='5'>
                  {shortenString(
                    currentProject
                      ? currentProject.project.author.username
                        ? currentProject.project.author.username[0].toUpperCase()
                        : `User ${currentProject.project.author.telegramId}`[0].toUpperCase()
                      : 'Meme factory'[0].toUpperCase()
                  )}
                </Text>
              </Flex>

              <Text weight='medium' size='6'>
                {shortenString(
                  currentProject
                    ? currentProject.project.author.username
                      ? currentProject.project.author.username
                      : `User ${currentProject.project.author.telegramId}`
                    : 'Meme factory'
                )}
              </Text>
            </Flex>
          </Box>
        </Flex>
      </Flex>

      <Sheet isOpen={isModalVisible} onClose={() => handleDialogClose()} detent='content-height'>
        <Theme appearance='dark'>
          <Sheet.Container style={{ overflowY: 'auto', background: '#121113' }}>
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
                              Wait until the advertiser approves {/*<Badge color='yellow'>*/}
                              {/*  <Text*/}
                              {/*    style={{ textDecoration: 'underline' }}*/}
                              {/*    onClick={() => {*/}
                              {/*      handleDialogClose();*/}
                              {/*      navigate('/profile?tab=account&action=verify');*/}
                              {/*    }}*/}
                              {/*  >*/}
                              {/*    Or Verify now*/}
                              {/*  </Text>*/}
                              {/*</Badge>*/}
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
          <Sheet.Backdrop onTap={() => handleDialogClose()} />
        </Theme>
      </Sheet>
    </Flex>
  );
};

export default ProjectPage;
