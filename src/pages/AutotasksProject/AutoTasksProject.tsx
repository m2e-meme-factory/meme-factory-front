import React from 'react';
import fallbackBanner from '../../shared/imgs/fallbackBanner.png';
import { Badge, Card, Flex, Heading, Text } from '@radix-ui/themes';
import styles from '../ProjectPage/ProjectPage.module.css';
import TaskDescriptionDisplay from '../ProjectPage/components/Description/DescriptionSection';
import { TagsOutlined, TeamOutlined, UnorderedListOutlined } from '@ant-design/icons';
import AutotaskCard from '../PublicProjectsPage/components/AutoTask/AutoTask';

const AutoTasksProject = () => {
  const [autoTaskDone, setAutoTaskDone] = React.useState(false);
  console.log('AutoTasksProject');

  return (
    <Flex direction='column'>
      <Flex className={styles.bannerContainer}>
        <img src={fallbackBanner} alt='banner' className={styles.bannerImage} />
      </Flex>
      <Flex className={styles.content} direction='column'>
        <Flex m='4' direction='column'>
          <Heading weight='medium'>Points for activity</Heading>
          <Text color='yellow' weight='medium' mb='5'>
            Category: Platform tasks
          </Text>
          <Flex mb='5'>
            <TaskDescriptionDisplay
              description={`<p>Earn rewards by inviting your friends to join our app! Simply share your unique referral link with your friends, and when they sign up using your link, both of you will receive bonus points. It\'s easy and a great way to enjoy the app together while earning extra rewards. Start sharing and watch your points grow as your friends join the fun!</p>`}
            />
          </Flex>
          <Flex align='center' direction='row' mb='2'>
            <TagsOutlined style={{ color: 'yellow', marginRight: '8px' }} />
            <Text weight='medium' size='5'>
              Tags:{' '}
              {['partnership', 'socials'].map((tag, index) => (
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
                  Meme factory
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
            <AutotaskCard
              setAutoTaskDone={setAutoTaskDone}
              title='Points for friends!'
              description={`Earn rewards by inviting your friends to join our app! Simply share your unique referral link with your friends, and when they sign up using your link, both of you will receive bonus points. It's easy and a great way to enjoy the app together while earning extra rewards. Start sharing and watch your points grow as your friends join the fun!`}
              price={1337}
            />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default AutoTasksProject;
