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
    url: 'https://twitter.com/m2e_pro',
  },
  {
    id: 4,
    title: 'Join Telegram',
    description: `Become a part of the Meme Factory community by joining our Telegram channel.`,
    reward: 100,
    category: 'Telegram',
    url: 'https://t.me/m2e_pro',
  },
  {
    id: 5,
    title: 'Subscribe Youtube',
    description: `Subscribe to our YouTube channel and be a part of our growing audience.`,
    reward: 100,
    category: 'Youtube',
    url: 'https://www.youtube.com/channel/UCZ94hPs00bBTxWsZjGZp_gQ ',
  },
  {
    id: 6,
    title: 'Subscribe on Tik Tok',
    description: `Subscribe to our Tik Tok channel and be a part of our growing audience.`,
    reward: 100,
    category: 'Tik Tok',
    url: 'https://www.tiktok.com/@m2e_pro',
  },
  {
    id: 6,
    title: 'Follow us on Instagram',
    description: `Follow MemeFactory on Instagram to stay updated with our latest posts, stories, and exclusive content. `,
    reward: 100,
    category: 'Instagram',
    url: 'https://www.instagram.com/m2e__pro/',
  },
  {
    id: 7,
    title: 'Visit our Raddit',
    description: `Show your support by liking our post on Raddit.`,
    reward: 100,
    category: 'Raddit',
    url: 'https://www.reddit.com/user/m2epro/',
  },
  {
    id: 8,
    title: 'Like our post on Medium',
    description: `Show your support by liking our post on Medium.`,
    reward: 100,
    category: 'Medium',
    url: 'https://medium.com/@mail_13487',
  },
  {
    id: 9,
    title: 'Join Discord',
    description: `Become a part of the Meme Factory community by joining our Discord channel.`,
    reward: 100,
    category: 'Discord',
    url: 'https://discord.com/channels/@me',
  },
];
