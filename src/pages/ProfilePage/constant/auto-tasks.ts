import { AutoTaskType } from '../model/auto-task';

import { LOCAL_TEXT } from '@shared/consts';
import { CATEGORY_TASKS } from '@shared/consts/category-tasks';

export const AUTO_TASKS: AutoTaskType[] = [
  {
    title: LOCAL_TEXT.WELCOME_BONUS,
    description: '',
    category: CATEGORY_TASKS.WELCOME_BONUS,
  },
  {
    title: LOCAL_TEXT.CONNECT_WALLET,
    description: LOCAL_TEXT.SECURE_YOUR_ACCOUNT_CONNECTING_YOUR_WALLET_START_EARNING_REWARDS,
    category: CATEGORY_TASKS.WALLET,
  },
  {
    title: LOCAL_TEXT.DAILY_CHECK_IN,
    description: LOCAL_TEXT.LOG_IN_EVERY_DAY_CLAIM_YOUR_REWARD_AND_KEEP_YOUR_STREAK_ALIVE,
    category: CATEGORY_TASKS.CHECKIN,
  },
  {
    title: LOCAL_TEXT.SHARE_IN_STORIES,
    description: '',
    category: CATEGORY_TASKS.SHARE_IN_STORIES,
    isRef: true,
  },
  {
    title: LOCAL_TEXT.EDIT_ACCOUNT_INFO,
    description: '',
    category: CATEGORY_TASKS.ACCOUNT_BIO,
    isRef: true,
  },
  {
    title: LOCAL_TEXT.FOLLOW_X,
    description: LOCAL_TEXT.STAY_UPDATED_NEWS_ON_X,
    category: CATEGORY_TASKS.OPEN_X,
    webUrl: 'https://twitter.com/m2e_pro',
  },
  {
    title: LOCAL_TEXT.JOIN_TELEGRAM,
    description: LOCAL_TEXT.BECOME_PART_MEME_FACTORY_TELEGRAM_CHANNEL,
    category: CATEGORY_TASKS.OPEN_TG,
    webUrl: 'https://t.me/m2e_pro',
  },
  {
    title: LOCAL_TEXT.SUBSCRIBE_YOUTUBE,
    description: LOCAL_TEXT.SUBSCRIBE_YOUTUBE_CHANNEL_PART_GROWING_AUDIENCE,
    category: CATEGORY_TASKS.OPEN_YOUTUBE,
    webUrl: 'https://www.youtube.com/channel/UCZ94hPs00bBTxWsZjGZp_gQ',
  },
  {
    title: LOCAL_TEXT.SUBSCRIBE_TIKTOK,
    description: LOCAL_TEXT.SUBSCRIBE_TIKTOK_CHANNEL_PART_GROWING_AUDIENCE,
    category: CATEGORY_TASKS.OPEN_TIKTOK,
    webUrl: 'https://www.tiktok.com/@m2e_pro',
  },
  {
    title: LOCAL_TEXT.VISIT_REDDIT,
    description: LOCAL_TEXT.SHOW_YOUR_SUPPORT_LIKING_POST_REDDIT,
    category: CATEGORY_TASKS.OPEN_REDDIT,
    webUrl: 'https://www.reddit.com/user/m2epro/',
  },
  {
    title: LOCAL_TEXT.JOIN_DISCORD,
    description: LOCAL_TEXT.BECOME_PART_MEME_FACTORY_DISCORD_CHANNEL,
    category: CATEGORY_TASKS.OPEN_DISCORD,
    webUrl: 'https://discord.com/channels/@me',
  },
  {
    title: LOCAL_TEXT.VISIT_WEBSITE,
    description: LOCAL_TEXT.GET_REWARDED_VISITING_WEBSITE,
    category: CATEGORY_TASKS.WEB_URL,
    webUrl: 'https://m2e.pro/',
  },
];

