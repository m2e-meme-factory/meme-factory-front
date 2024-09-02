import { ReactNode } from 'react';

export interface Autotask {
  id: number;
  title: string;
  description: string;
  reward: number;
  children?: ReactNode;
}

export const tasks: Autotask[] = [
  {
    id: 1,
    title: 'Points for friends',
    description: `Earn rewards by inviting your friends to join our app! Simply share your unique referral link with your friends, and when they sign up using your link, both of you will receive bonus points. It's easy and a great way to enjoy the app together while earning extra rewards. Start sharing and watch your points grow as your friends join the fun!`,
    reward: 10,
  },
  {
    id: 2,
    title: 'Visit our website',
    description: `Earn reward by visiting m2e.pro`,
    reward: 100,
  },
  {
    id: 3,
    title: 'Visit our socials',
    description: `vk.com/m2e`,
    reward: 100,
  },
  {
    id: 4,
    title: 'Visit our socials 2',
    description: `vk.com/m2e2`,
    reward: 100,
  },
  {
    id: 5,
    title: 'Visit our socials 3',
    description: `vk.com/m2e3`,
    reward: 100,
  },
  {
    id: 6,
    title: 'Visit our socials 4',
    description: `vk.com/m2e3`,
    reward: 100,
  },
  {
    id: 7,
    title: 'Visit our socials 5',
    description: `vk.com/m2e3`,
    reward: 100,
  },
  {
    id: 8,
    title: 'Visit our socials 3',
    description: `vk.com/m2e3`,
    reward: 100,
  },
  {
    id: 9,
    title: 'Visit our socials 4',
    description: `vk.com/m2e3`,
    reward: 100,
  },
  {
    id: 10,
    title: 'Visit our socials 5',
    description: `vk.com/m2e3`,
    reward: 100,
  },
];
