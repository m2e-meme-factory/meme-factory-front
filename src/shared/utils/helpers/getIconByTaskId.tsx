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
  21: (
    <UserAddOutlined
      style={{ color: 'var(--gray-10)', margin: '0 15px 0 10px', fontSize: '24px' }}
    />
  ),
  23: (
    <LaptopOutlined
      style={{ color: 'var(--gray-10)', margin: '0 15px 0 10px', fontSize: '24px' }}
    />
  ),
  24: <XOutlined style={{ color: 'var(--gray-10)', margin: '0 15px 0 10px', fontSize: '24px' }} />,
  25: (
    <SendOutlined style={{ color: 'var(--gray-10)', margin: '0 15px 0 10px', fontSize: '24px' }} />
  ),
  26: (
    <YoutubeOutlined
      style={{ color: 'var(--gray-10)', margin: '0 15px 0 10px', fontSize: '24px' }}
    />
  ),
  27: (
    <TikTokOutlined
      style={{ color: 'var(--gray-10)', margin: '0 15px 0 10px', fontSize: '24px' }}
    />
  ),
  28: (
    <InstagramOutlined
      style={{ color: 'var(--gray-10)', margin: '0 15px 0 10px', fontSize: '24px' }}
    />
  ),
  29: (
    <Flex justify='center' align='center'>
      <RadditOutlined style={{ fill: 'var(--gray-10)', margin: '0 15px 0 10px', height: '24px' }} />
    </Flex>
  ),
  31: (
    <MediumOutlined
      style={{ color: 'var(--gray-10)', margin: '0 15px 0 10px', fontSize: '24px' }}
    />
  ),
  30: (
    <DiscordOutlined
      style={{ color: 'var(--gray-10)', margin: '0 15px 0 10px', fontSize: '24px' }}
    />
  ),
};

export const getIconByTaskId = (id: number): ReactNode => {
  return icons[id] || <RocketOutlined />;
};
