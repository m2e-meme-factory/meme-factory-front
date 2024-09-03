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
    title: 'Follow X',
    description: `Follow Meme Factory on X`,
    reward: 100,
  },
  {
    id: 4,
    title: 'Join Telegram',
    description: `Join Meme Factory Telegram channel`,
    reward: 100,
  },
  {
    id: 5,
    title: 'Subscribe Youtube',
    description: `Subscribe our Youtube channel`,
    reward: 100,
  },
  {
    id: 6,
    title: 'Follow us on Instagram',
    description: `Follow MemeFactory instagram account to get points`,
    reward: 100,
  },
  {
    id: 7,
    title: 'Like our post on Facebook',
    description: `Like our post on Facebook to get free points`,
    reward: 100,
  },
];
