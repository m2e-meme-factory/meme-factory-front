import React, { useEffect, useState } from 'react';
import { Avatar, Badge, Button, Card, Flex, Heading, Text } from '@radix-ui/themes';
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

const ProjectPage = () => {
  const [isUserCreator, setIsUserCreator] = useState(false);
  const dispatch = useDispatch();

  const { id } = useParams();
  const { data, isLoading, error } = useGetProject(id);
  const task = data?.data;
  const user = useSelector((state: RootState) => state.user.user);

  const navigate = useNavigate();

  useEffect(() => {
    if (task && user) {
      setIsUserCreator(task.authorId == user.id);
    }
  }, [task, user]);

  useEffect(() => {
    if (task) {
      dispatch(setProject(task));
    }
  }, [task]);

  if (isLoading) {
    return <Loading />;
  }

  const handleEditClick = () => {
    navigate('edit');
  }

  return (
    <Flex direction='column'>
      <Flex className={styles.bannerContainer}>
        <img src={task?.bannerUrl} alt='banner' className={styles.bannerImage} />
      </Flex>
      <Flex className={styles.content} direction='column'>
        <Flex m='4' direction='column'>
          <Flex align='center' justify='between'>
            <Heading weight='medium'>{task?.title}</Heading>
            {isUserCreator && <Button onClick={handleEditClick}>Edit project</Button>}
          </Flex>
          <Text color='yellow' weight='medium' mb='5'>
            Category: {task?.category}
          </Text>
          <Flex mb='5'>
            <TaskDescriptionDisplay description={task?.description || ''} />
          </Flex>
          <Flex align='center' direction='row' mb='2'>
            <TagsOutlined style={{ color: 'yellow', marginRight: '8px' }} />
            <Text weight='medium' size='5'>
              Tags:{' '}
              {task?.tags && task?.tags.map((tag, index) => (
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
            {task?.tasks && task?.tasks.map((subtask, index) => (
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
            <Flex align='center' mb='2'>
              <PushpinOutlined style={{ color: 'yellow', marginRight: '8px' }} />
              <Text weight='medium' size='5'>
                Attachments
              </Text>
            </Flex>
            {task?.files && task?.files.map((file, index) => (
              <AttachmentCard key={index} name={file} url={'/'} />
            ))}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ProjectPage;
