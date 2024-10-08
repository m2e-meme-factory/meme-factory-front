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
import GlowingButton from '../../shared/components/Buttons/GlowingButton';
import SheetSubtaskCard from './components/SubtaskCard/SheetSubtaskCard';
import { useWebApp } from '@vkruglikov/react-telegram-web-app';

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
  const [currentUserRole, setCurrentUserRole] = useState<UserRoleInProject>('guestCreator');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isApplyLoading, setIsApplyLoading] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState<string>('');
  const [progress, setProgress] = useState<ProjectProgress>();
  const [applyBlocked, setApplyBlocked] = useState<boolean>(false);
  const [minPrice, setMinPrice] = useState<number>();
  const [maxPrice, setMaxPrice] = useState<number>();

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
      setMinPrice(parseInt(projectInfoResponse.data.minPrice ?? '0'));
      setMaxPrice(parseInt(projectInfoResponse.data.maxPrice ?? '0'));
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

  const handleDownload = async () => {
    if (!isDownloading) {
      setIsDownloading(true);
      if (currentProject && user) {
        await showToastWithPromise({
          success: 'Files are downloaded successfully',
          error: 'Error occurred while downloading files',
          process: 'Downloading files',
          callback: () =>
            downloadFiles({
              params: { projectId: currentProject.project.id, telegramId: user.telegramId },
            }),
        });
      }
    }
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
    <Flex direction='column'>
      {/* Banner */}
      <Flex className={styles.bannerContainer}>
        <img src={bannerLink} alt='banner' className={styles.bannerImage} />
      </Flex>
      {/* Title */}
      <Flex className={styles.content} direction='column'>
        <Flex m='4' mt='2' direction='column'>
          <Heading weight='medium'>{currentProject?.project.title}</Heading>
          {currentUserRole === 'projectOwner' && (
            <Button onClick={handleEditClick} my='2'>
              Edit project
            </Button>
          )}

          {/* Description */}
          <Flex mb='2' mt='2' direction='column'>
            <TaskDescriptionDisplay description={currentProject?.project.description || ''} />
            {currentProject && currentProject.project.files.length > 0 && (
              <Link
                mt='1'
                style={{ alignSelf: 'end', cursor: 'pointer', fontSize: '13px' }}
                onClick={handleDownload}
              >
                Download attachments
              </Link>
            )}
          </Flex>

          {currentUserRole !== 'projectOwner' && currentUserRole !== 'guestCreator' && (
            <Button disabled={true} my='2' style={{ fontSize: '16px' }}>
              Join
            </Button>
          )}

          {/* Join project modal */}
          {currentUserRole === 'guestCreator' && (
            <Dialog.Root>
              <Dialog.Trigger>
                <GlowingButton
                  size='3'
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

          {/* Category and tags */}
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
                background: 'gray',
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
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ProjectPage;
