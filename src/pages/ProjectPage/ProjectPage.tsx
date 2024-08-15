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
import { Project } from 'api';
import fallbackImg from '../../shared/imgs/fallback_img.jpg';
import { downloadFiles } from '../../shared/utils/api/requests/files/downloadFile';

const ProjectPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams();
  const { data, isLoading } = useGetProject(id);

  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isUserAdvertiser, setIsUserAdvertiser] = useState(false);
  const [isUserGuest, setIsUserGuest] = useState(!isUserAdvertiser);
  const [downloadError, setDownloadError] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    if (currentProject && user) {
      setIsUserAdvertiser(currentProject.authorId == user.id);
    }
  }, [currentProject, user]);

  useEffect(() => {
    if (currentProject) {
      dispatch(setProject(currentProject));
    }
  }, [currentProject]);

  useEffect(() => {
    if (data) {
      setCurrentProject(data.data);
    }
  }, [data]);

  if (isLoading) {
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
            {isUserAdvertiser && <Button onClick={handleEditClick}>Edit project</Button>}

            {isUserGuest && (
              <Dialog.Root>
                <Dialog.Trigger>
                  <Button>Apply</Button>
                </Dialog.Trigger>

                <Dialog.Content maxWidth='450px'>
                  <Dialog.Title>Apply for the project</Dialog.Title>
                  <Dialog.Description size='2' mb='4'>
                    Tell us about yourself
                  </Dialog.Description>

                  <Flex direction='column'>
                    <TextArea
                      size='2'
                      placeholder='I have one million subscribers on my Youtube channel'
                    />
                  </Flex>

                  <Flex gap='3' mt='4' justify='end'>
                    <Dialog.Close>
                      <Button variant='soft' color='gray'>
                        Cancel
                      </Button>
                    </Dialog.Close>
                    <Dialog.Close>
                      <Button>Apply</Button>
                    </Dialog.Close>
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
