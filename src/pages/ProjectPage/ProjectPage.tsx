import React, { useEffect, useState } from 'react';
import { Badge, Button, Card, Flex, Heading, Text, Dialog, TextArea } from '@radix-ui/themes';
import {
  DollarOutlined,
  PushpinOutlined,
  TagsOutlined,
  TeamOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import styles from './ProjectPage.module.css';
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
import fallbackBanner from './../../shared/imgs/fallbackBanner.png';
import { showErrorMessage } from '../../shared/utils/helpers/notify';
import { Role } from '../../shared/consts/userRoles';
import { shortenString } from '../../shared/utils/helpers/shortenString';

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
  const [downloadError, setDownloadError] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isApplyLoading, setIsApplyLoading] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState<string>('');
  const [progress, setProgress] = useState<ProjectProgress>();
  const [applyBlocked, setApplyBlocked] = useState<boolean>(false);
  const [minPrice, setMinPrice] = useState<number>();
  const [maxPrice, setMaxPrice] = useState<number>();

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
      console.log(projectInfoResponse);
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
    setIsDownloading(true);
    if (currentProject && user) {
      try {
        await downloadFiles({
          params: { projectId: currentProject.project.id, telegramId: user.telegramId },
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
    ? `https://api.meme-factory.site${currentProject?.project.bannerUrl}`
    : fallbackBanner;

  return (
    <Flex direction='column'>
      <Flex className={styles.bannerContainer}>
        <img src={bannerLink} alt='banner' className={styles.bannerImage} />
      </Flex>
      <Flex className={styles.content} direction='column'>
        <Flex m='4' direction='column'>
          <Heading weight='medium'>{shortenString(currentProject?.project.title, 40)}</Heading>
          {currentUserRole === 'projectOwner' && (
            <Button onClick={handleEditClick} my='2'>
              Edit project
            </Button>
          )}

          {currentUserRole !== 'projectOwner' && currentUserRole !== 'guestCreator' && (
            <Button onClick={handleEditClick} disabled={true} my='2'>
              Apply to earn
            </Button>
          )}

          {currentUserRole === 'guestCreator' && (
            <Dialog.Root>
              <Dialog.Trigger>
                <Button my='2' disabled={applyBlocked}>
                  Apply to earn
                </Button>
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
                    <Button onClick={handleApplyClick} loading={isApplyLoading}>
                      Apply
                    </Button>
                  </Dialog.Close>
                </Flex>
              </Dialog.Content>
            </Dialog.Root>
          )}
          <Text color='yellow' weight='medium' mb='5'>
            Category: {currentProject?.project.category}
          </Text>
          <Flex mb='5'>
            <TaskDescriptionDisplay description={currentProject?.project.description || ''} />
          </Flex>
          <Flex align='center' direction='row' mb='2'>
            <TagsOutlined style={{ color: 'yellow', marginRight: '8px' }} />
            <Text weight='medium' size='5'>
              Tags:{' '}
              {currentProject?.project.tags &&
                currentProject?.project.tags.map((tag, index) => (
                  <Badge size='3' key={index} style={{ marginLeft: index > 0 ? '8px' : '0' }}>
                    {tag}
                  </Badge>
                ))}
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
            </Card>
          </Flex>

          <Flex direction='column' mb='5'>
            <Flex align='center' mb='2'>
              <DollarOutlined style={{ color: 'yellow', marginRight: '8px' }} />
              <Text weight='medium' size='5'>
                Price
              </Text>
            </Flex>
            <Card mb='2'>
              <Text weight='regular' size='6'>
                Min:{' '}
                <Text color='yellow' weight='medium'>
                  {minPrice}
                </Text>
              </Text>
            </Card>
            <Card>
              <Text weight='regular' size='6'>
                Max:{' '}
                <Text color='yellow' weight='medium'>
                  {maxPrice}
                </Text>
              </Text>
            </Card>
          </Flex>

          <Flex direction='column' mb='5'>
            <Flex align='center' mb='2'>
              <UnorderedListOutlined style={{ color: 'yellow', marginRight: '8px' }} />
              <Text weight='medium' size='5'>
                Subtasks
              </Text>
            </Flex>
            {currentProject?.project.tasks &&
              currentProject?.project.tasks.map((subtask, index) => (
                <SubtaskCard
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
            {currentProject?.project.files &&
              currentProject?.project.files.map((file, index) => (
                <AttachmentCard key={index} name={file} />
              ))}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ProjectPage;
