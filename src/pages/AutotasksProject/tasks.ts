import { ReactNode } from 'react';

export interface Autotask {
  id: number;
  title: string;
  description: string;
  reward: number;
  category: string;
  url?: string;
  children?: ReactNode;
  icon?: ReactNode;
}

export const tasks: Autotask[] = [
  {
    id: 1,
    title: 'Points for friends',
    description: `Invite friend to claim 100 M2E 💸`,
    reward: 100,
    category: 'referral',
  },
  {
    id: 2,
    title: 'Visit our website',
    description: `Get rewarded for simply visiting our website!`,
    reward: 100,
    category: 'M2E.PRO',
    url: 'https://m2e.pro/',
  },
  {
    id: 3,
    title: 'Follow X',
    description: `Stay updated with the latest news and updates by following Meme Factory on X.`,
    reward: 100,
    category: 'X',
    url: 'https://x.com/',
  },
  {
    id: 4,
    title: 'Join Telegram',
    description: `Become a part of the Meme Factory community by joining our Telegram channel.`,
    reward: 100,
    category: 'Telegram',
    url: 'https://t.me/miniapped_bot/',
  },
  {
    id: 5,
    title: 'Subscribe Youtube',
    description: `Subscribe to our YouTube channel and be a part of our growing audience.`,
    reward: 100,
    category: 'Youtube',
    url: 'https://www.youtube.com/',
  },
  {
    id: 6,
    title: 'Follow us on Instagram',
    description: `Follow MemeFactory on Instagram to stay updated with our latest posts, stories, and exclusive content. `,
    reward: 100,
    category: 'Instagram',
    url: 'https://www.instagram.com/',
  },
  {
    id: 7,
    title: 'Like our post on Facebook',
    description: `Show your support by liking our post on Facebook.`,
    reward: 100,
    category: 'Facebook',
    url: 'https://www.facebook.com/',
  },
];
