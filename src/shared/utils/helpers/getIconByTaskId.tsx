import React from 'react';
import {
  FacebookOutlined,
  InstagramOutlined,
  LaptopOutlined,
  RocketOutlined,
  SendOutlined,
  UserAddOutlined,
  XOutlined,
  YoutubeOutlined,
} from '@ant-design/icons';
import { ReactNode } from 'react';

type IconType = {
  [key: number]: ReactNode;
};

const icons: IconType = {
  1: <UserAddOutlined style={{ color: 'yellow', margin: '0 15px 0 10px', fontSize: '24px' }} />,
  2: <LaptopOutlined style={{ color: 'yellow', margin: '0 15px 0 10px', fontSize: '24px' }} />,
  3: <XOutlined style={{ color: 'yellow', margin: '0 15px 0 10px', fontSize: '24px' }} />,
  4: <SendOutlined style={{ color: 'yellow', margin: '0 15px 0 10px', fontSize: '24px' }} />,
  5: <YoutubeOutlined style={{ color: 'yellow', margin: '0 15px 0 10px', fontSize: '24px' }} />,
  6: <InstagramOutlined style={{ color: 'yellow', margin: '0 15px 0 10px', fontSize: '24px' }} />,
  7: <FacebookOutlined style={{ color: 'yellow', margin: '0 15px 0 10px', fontSize: '24px' }} />,
};

export const getIconByTaskId = (id: number): ReactNode => {
  return icons[id] || <RocketOutlined />;
};
