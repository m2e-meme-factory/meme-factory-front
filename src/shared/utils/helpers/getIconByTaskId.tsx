import React from 'react';
import {
  DiscordOutlined,
  FacebookOutlined,
  InstagramOutlined,
  LaptopOutlined,
  MediumOutlined,
  RocketOutlined,
  SendOutlined,
  TikTokOutlined,
  UserAddOutlined,
  XOutlined,
  YoutubeOutlined,
} from '@ant-design/icons';
import { ReactNode } from 'react';
import RadditOutlined from '../../imgs/RadditOutlined';
import { Flex } from '@radix-ui/themes';

type IconType = {
  [key: number]: ReactNode;
};

/*

export const tasks: Autotask[] = [
  {
    id: 7,
    title: 'Follow us on Instagram',
    description: `Follow MemeFactory on Instagram to stay updated with our latest posts, stories, and exclusive content. `,
    reward: 100,
    category: 'Instagram',
    url: 'https://www.instagram.com/m2e__pro/',
  },
  {
    id: 8,
    title: 'Visit our Raddit',
    description: `Show your support by liking our post on Raddit.`,
    reward: 100,
    category: 'Raddit',
    url: 'https://www.reddit.com/user/m2epro/',
  },
  {
    id: 9,
    title: 'Like our post on Medium',
    description: `Show your support by liking our post on Medium.`,
    reward: 100,
    category: 'Medium',
    url: 'https://medium.com/@mail_13487',
  },
  {
    id: 10,
    title: 'Join Discord',
    description: `Become a part of the Meme Factory community by joining our Discord channel.`,
    reward: 100,
    category: 'Discord',
    url: 'https://discord.com/channels/@me',
  },
];
*/
const icons: IconType = {
  1: (
    <UserAddOutlined
      style={{ color: 'var(--gray-10)', margin: '0 15px 0 10px', fontSize: '24px' }}
    />
  ),
  2: (
    <LaptopOutlined
      style={{ color: 'var(--gray-10)', margin: '0 15px 0 10px', fontSize: '24px' }}
    />
  ),
  3: <XOutlined style={{ color: 'var(--gray-10)', margin: '0 15px 0 10px', fontSize: '24px' }} />,
  4: (
    <SendOutlined style={{ color: 'var(--gray-10)', margin: '0 15px 0 10px', fontSize: '24px' }} />
  ),
  5: (
    <YoutubeOutlined
      style={{ color: 'var(--gray-10)', margin: '0 15px 0 10px', fontSize: '24px' }}
    />
  ),
  6: (
    <TikTokOutlined
      style={{ color: 'var(--gray-10)', margin: '0 15px 0 10px', fontSize: '24px' }}
    />
  ),
  7: (
    <InstagramOutlined
      style={{ color: 'var(--gray-10)', margin: '0 15px 0 10px', fontSize: '24px' }}
    />
  ),
  8: (
    <Flex justify='center' align='center'>
      <RadditOutlined 
        style={{ fill: 'var(--gray-10)', margin: '0 15px 0 10px', height: '24px' }} 
      />
    </Flex>
  ),
  9: (
    <MediumOutlined 
      style={{ color: 'var(--gray-10)', margin: '0 15px 0 10px', fontSize: '24px' }}
    />
  ),
  10: (
    <DiscordOutlined 
      style={{ color: 'var(--gray-10)', margin: '0 15px 0 10px', fontSize: '24px' }}
    />
  ),
};

export const getIconByTaskId = (id: number): ReactNode => {
  return icons[id] || <RocketOutlined />;
};
