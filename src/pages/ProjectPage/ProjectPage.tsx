import React from 'react';
import { Avatar, Badge, Card, Flex, Heading, Text } from '@radix-ui/themes';
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
import { useParams } from 'react-router-dom';

const IMAGE_URL =
  'https://cdna.artstation.com/p/assets/images/images/012/308/904/large/divya-jain-firewatch-dhj.jpg?1534140299';

const ProjectPage = () => {
  const id = useParams().toString();
  const {data} = useGetProject(id);
  const task = data?.data;

  return (
    <Flex direction='column'>
      <Flex className={styles.bannerContainer}>
        <img src={IMAGE_URL} alt='banner' className={styles.bannerImage} />
      </Flex>
      <Flex className={styles.content} direction='column'>
        <Flex m='4' direction='column'>
          <Heading weight='medium'>{task?.title}</Heading>
          <Text color='yellow' weight='medium' mb='5'>
            Category: {task?.category}
          </Text>
          <Flex mb='5'>
            <TaskDescriptionDisplay description={ task?.description ? task?.description : '' } />
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
                id={subtask.id}
                description={subtask.description}
                price={subtask.price}
                title={subtask.title}
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
            {task?.attachedFiles &&
              task?.attachedFiles.map((file, index) => (
                <AttachmentCard name={file} url={'/'} />
              ))}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ProjectPage;
