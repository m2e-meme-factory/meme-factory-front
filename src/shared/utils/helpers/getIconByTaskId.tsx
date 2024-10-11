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

const icons: IconType = {
  0: (
    <UserAddOutlined
      style={{ color: 'var(--gray-10)', margin: '0 15px 0 10px', fontSize: '24px' }}
    />
  ),
  1: (
    <LaptopOutlined
      style={{ color: 'var(--gray-10)', margin: '0 15px 0 10px', fontSize: '24px' }}
    />
  ),
  2: <XOutlined style={{ color: 'var(--gray-10)', margin: '0 15px 0 10px', fontSize: '24px' }} />,
  3: (
    <SendOutlined style={{ color: 'var(--gray-10)', margin: '0 15px 0 10px', fontSize: '24px' }} />
  ),
  4: (
    <YoutubeOutlined
      style={{ color: 'var(--gray-10)', margin: '0 15px 0 10px', fontSize: '24px' }}
    />
  ),
  5: (
    <TikTokOutlined
      style={{ color: 'var(--gray-10)', margin: '0 15px 0 10px', fontSize: '24px' }}
    />
  ),
  6: (
    <InstagramOutlined
      style={{ color: 'var(--gray-10)', margin: '0 15px 0 10px', fontSize: '24px' }}
    />
  ),
  7: (
    <Flex justify='center' align='center'>
      <RadditOutlined style={{ fill: 'var(--gray-10)', margin: '0 15px 0 10px', height: '24px' }} />
    </Flex>
  ),
  8: (
    <MediumOutlined
      style={{ color: 'var(--gray-10)', margin: '0 15px 0 10px', fontSize: '24px' }}
    />
  ),
  9: (
    <DiscordOutlined
      style={{ color: 'var(--gray-10)', margin: '0 15px 0 10px', fontSize: '24px' }}
    />
  ),
};

export const getIconByTaskId = (id: number): ReactNode => {
  return icons[id] || <RocketOutlined />;
};
