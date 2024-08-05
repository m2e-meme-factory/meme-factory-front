import React, { useState } from 'react';
import { Avatar, Badge, Button, Card, Em, Flex, Heading, Text } from '@radix-ui/themes';
import { task } from '../../shared/consts/task-example';
import {
  DollarOutlined,
  PushpinOutlined,
  TagsOutlined,
  TeamOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import styles from './TaskPage.module.css';
import { shortenDescription } from '../../shared/utils/helpers/shortenDescription';
import avatarFallback from '../../shared/imgs/avatar-fallback.svg';
import AttachmentCard from './components/AttachmentCard/AttachmentCard';
import SubtaskCard from './components/SubtaskCard/SubtaskCard';
import TaskDescriptionDisplay from './components/Description/DescriptionSection';
import descriptionSection from './components/Description/DescriptionSection';

const IMAGE_URL =
  'https://cdna.artstation.com/p/assets/images/images/012/308/904/large/divya-jain-firewatch-dhj.jpg?1534140299';

const TaskPage = () => {
  const [isDescVisible, setIsDescVisible] = useState(false);
  const descriptionExample = "<h1>daffafdafdafsadf</h1><h3>sdfafasdf</h3><p>asdffsafdsafdfasfads</p>";
  const handleToggleDescription = () => {
    setIsDescVisible(!isDescVisible);
  };

  return (
    <Flex direction='column'>
      <Flex className={styles.bannerContainer}>
        <img src={IMAGE_URL} alt='banner' className={styles.bannerImage} />
      </Flex>
      <Flex className={styles.content} direction='column'>
        <Flex m='4' direction='column'>
          <Heading weight='medium'>{task.title}</Heading>
          <Text color='yellow' weight='medium' mb='5'>
            Category: {task.category}
          </Text>
          <Flex mb='5'>
            <TaskDescriptionDisplay description={descriptionExample}/>
          </Flex>
          <Flex align='center' direction='row' mb='2'>
            <TagsOutlined style={{ color: 'yellow', marginRight: '8px' }} />
            <Text weight='medium' size='5'>
              Tags:{' '}
              {task.tags.map((tag, index) => (
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
            <SubtaskCard
              id={task.id}
              description={task.description}
              price={typeof task.price !== 'number' ? task.price.min : task.price}
              title={task.title}
            />
          </Flex>
          <Flex direction='column'>
            <Flex align='center' mb='2'>
              <PushpinOutlined style={{ color: 'yellow', marginRight: '8px' }} />
              <Text weight='medium' size='5'>
                Attachments
              </Text>
            </Flex>
            {task.files &&
              task.files.map((file, index) => (
                <AttachmentCard name={file.filename} url={file.url} />
              ))}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default TaskPage;
