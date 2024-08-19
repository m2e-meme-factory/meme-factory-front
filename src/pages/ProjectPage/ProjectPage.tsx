import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Flex,
  Heading,
  Text,
  Dialog,
  TextArea,
} from '@radix-ui/themes';
import {
  DollarOutlined,
  PushpinOutlined,
  TagsOutlined,
  TeamOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import styles from './ProjectPage.module.css';
import avatarFallback from '../../shared/imgs/avatar-fallback.svg';
import AttachmentCard from './components/AttachmentCard/AttachmentCard';
import SubtaskCard from './components/SubtaskCard/SubtaskCard';
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
import { FALLBACK_BANNER_URL } from '../../shared/consts/fallbackBanner';
import { showErrorMessage } from '../../shared/utils/helpers/notify';
import { Role } from '../../shared/consts/userRoles';

export type UserRoleInProject =
  | 'projectOwner'
  | 'guestAdvertiser'
  | 'guestCreator'
  | 'projectMember'
  | 'unconfirmedMember';

const ProjectPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<UserRoleInProject>('unconfirmedMember');
  const [downloadError, setDownloadError] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isApplyLoading, setIsApplyLoading] = useState(false);
  const [currentUserProgress, setCurrentUserProgress] = useState<ProjectProgress>();
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [applicationMessage, setApplicationMessage] = useState<string>('');

  const user = useSelector((state: RootState) => state.user.user);

  const { data: projectInfoResponse, isLoading } = useGetProject(id);
  const { data: progressesResponse, isLoading: isProjectProgressLoading } = useGetProgress({
    projectId: id ?? '',
    userId: user?.id,
  });
  const { mutate: applyMutation, data: applyResponse } = useApplyForProject(setIsApplyLoading);

  useEffect(() => {
    if (user && currentProject && progressesResponse) {
      if (user.role === Role.ADVERTISER) {
        if (currentProject.authorId === user.id) {
          setCurrentUserRole('projectOwner');
        } else {
          setCurrentUserRole('guestAdvertiser');
        }
      } else {
        if (currentUserProgress) {
          if (currentUserProgress.status === 'accepted') {
            setCurrentUserRole('projectMember');
          } else if (currentUserProgress.status === 'pending') {
            setCurrentUserRole('unconfirmedMember');
          } else {
            setCurrentUserRole('guestCreator');
          }
        }
      }
    }
  }, [currentUserProgress, currentProject, user]);

  useEffect(() => {
    if (progressesResponse && progressesResponse?.data.length === 1) {
      setCurrentUserProgress(progressesResponse.data[0]);
    }
  }, [progressesResponse]);

  useEffect(() => {
    if (currentProject) {
      dispatch(setProject(currentProject));
    }
  }, [currentProject]);

  useEffect(() => {
    if (projectInfoResponse) {
      setCurrentProject(projectInfoResponse.data);
    }
  }, [projectInfoResponse]);

  if (isLoading || isProjectProgressLoading) {
    return <Loading />;
  }

  const handleEditClick = () => {
    navigate('edit');
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    if (currentProject && user) {
      try {
        await downloadFiles({
          params: { projectId: currentProject.id, telegramId: user.telegramId },
        });
      } catch (error) {
        setDownloadError(true);
      } finally {
        setIsDownloading(false);
      }
    }
  };

  const handleApplyClick = () => {
    setIsApplyLoading(true);
    if (currentProject && user) {
      if (applicationMessage.trim() === '') {
        setErrorMessage('Application message cannot be empty or just whitespace.');
        setIsApplyLoading(false);
        return;
      }
      setErrorMessage('');

      applyMutation({
        params: {
          projectId: currentProject.id,
          message: applicationMessage,
        },
      });

      if (applyResponse?.status === 201) {
        setCurrentUserRole('unconfirmedMember');
      } else {
        showErrorMessage('Error occurred while creating an application. Please try again!');
      }
    }
  };

  const handleTextAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setApplicationMessage(event.target.value);
  };

  const bannerLink = currentProject?.bannerUrl
    ? `https://api.meme-factory.site${currentProject?.bannerUrl}`
    : FALLBACK_BANNER_URL;

  return (
    <Flex direction='column'>
      <Flex className={styles.bannerContainer}>
        <img src={bannerLink} alt='banner' className={styles.bannerImage} />
      </Flex>
      <Flex className={styles.content} direction='column'>
        <Flex m='4' direction='column'>
          <Flex align='center' justify='between'>
            <Heading weight='medium'>{currentProject?.title}</Heading>
            {currentUserRole === 'projectOwner' && (
              <Button onClick={handleEditClick}>Edit project</Button>
            )}

            {currentUserRole === 'guestCreator' && (
              <Dialog.Root>
                <Dialog.Trigger>
                  <Button loading={isApplyLoading}>Apply</Button>
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
                    {errorMessage && (
                      <Text color='red' mt='2'>
                        {errorMessage}
                      </Text>
                    )}
                  </Flex>

                  <Flex gap='3' mt='4' justify='end'>
                    <Dialog.Close>
                      <Button variant='soft' color='gray'>
                        Cancel
                      </Button>
                    </Dialog.Close>
                    <Button onClick={handleApplyClick}>Apply</Button>
                  </Flex>
                </Dialog.Content>
              </Dialog.Root>
            )}
          </Flex>
          <Text color='yellow' weight='medium' mb='5'>
            Category: {currentProject?.category}
          </Text>
          <Flex mb='5'>
            <TaskDescriptionDisplay description={currentProject?.description || ''} />
          </Flex>
          <Flex align='center' direction='row' mb='2'>
            <TagsOutlined style={{ color: 'yellow', marginRight: '8px' }} />
            <Text weight='medium' size='5'>
              Tags:{' '}
              {currentProject?.tags &&
                currentProject?.tags.map((tag, index) => (
                  <Badge size='3' key={index} style={{ marginLeft: index > 0 ? '8px' : '0' }}>
                    {tag}
                  </Badge>
                ))}
            </Text>
          </Flex>
          <Flex mb='5'>
            <DollarOutlined style={{ color: 'yellow', marginRight: '8px' }} />
            <Text weight='medium' size='5'>
              Price: 1000$
            </Text>
          </Flex>
          <Flex direction='column' mb='5'>
            <Flex align='center' mb='2'>
              <TeamOutlined style={{ color: 'yellow', marginRight: '8px' }} />
              <Text weight='medium' size='5'>
                Host
              </Text>
            </Flex>
            <Card>
              <Flex align='center'>
                <Avatar fallback={<img src={avatarFallback} alt='fallback' />} />
                <Text weight='medium' size='6' ml='3'>
                  Meme Factory
                </Text>
              </Flex>
            </Card>
          </Flex>
          <Flex direction='column' mb='5'>
            <Flex align='center' mb='2'>
              <UnorderedListOutlined style={{ color: 'yellow', marginRight: '8px' }} />
              <Text weight='medium' size='5'>
                Subtasks
              </Text>
            </Flex>
            {currentProject?.tasks &&
              currentProject?.tasks.map((subtask, index) => (
                <SubtaskCard
                  key={index}
                  id={subtask.task.id}
                  description={subtask.task.description}
                  price={subtask.task.price}
                  title={subtask.task.title}
                  userRole={currentUserRole}
                  progress={currentUserProgress}
                />
              ))}
          </Flex>
          <Flex direction='column'>
            <Flex mb='2' direction='column'>
              <Flex align='center' justify='start'>
                <PushpinOutlined style={{ color: 'yellow', marginRight: '8px' }} />
                <Text weight='medium' size='5'>
                  Attachments
                </Text>
                <Button ml='3' onClick={handleDownload} loading={isDownloading}>
                  Download
                </Button>
              </Flex>
              {downloadError ? (
                <Text color='red' mt='2' size='2'>
                  Sorry, something went wrong. Try again later
                </Text>
              ) : (
                <Text color='gray' mt='2' size='2'>
                  Files will be sent to the MemeFactory bot chat
                </Text>
              )}
            </Flex>
            {currentProject?.files &&
              currentProject?.files.map((file, index) => (
                <AttachmentCard key={index} name={file} />
              ))}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ProjectPage;
