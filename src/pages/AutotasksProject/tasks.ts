import { ReactNode } from 'react';

export interface Autotask {
  id: number;
  title: string;
  description: string;
  reward: number;
  children?: ReactNode;
  icon?: ReactNode;
}

export const tasks: Autotask[] = [
  {
    id: 1,
    title: 'Points for friends',
    description: `Invite your friends to join our app and earn rewards! Share your unique referral link with them, and when they sign up and start using the app, both you and your friends will earn bonus points. This is a fantastic way to grow our community while getting rewarded for bringing your friends on board. The more friends you invite, the more rewards you can earn. Start sharing now and watch your points accumulate as your friends join the fun! 💸`,
    reward: 10,
  },
  {
    id: 2,
    title: 'Visit our website',
    description: `Get rewarded for simply visiting our website! Head over to m2e.pro and explore the features we offer. By visiting our site, you’ll not only learn more about what we have to offer but also earn a reward. It’s a quick and easy way to boost your points. Don’t miss out on this opportunity to earn rewards while learning more about our platform.`,
    reward: 100,
  },
  {
    id: 3,
    title: 'Follow X',
    description: `Stay updated with the latest news and updates by following Meme Factory on X. By following our account, you'll be the first to know about new features, promotions, and exclusive content. Plus, you’ll earn a reward just for following us! It’s a great way to stay connected and keep up with all things Meme Factory.`,
    reward: 100,
  },
  {
    id: 4,
    title: 'Join Telegram',
    description: `Become a part of the Meme Factory community by joining our Telegram channel. Engage with other users, get real-time updates, and be the first to know about special offers and announcements. By joining our Telegram channel, you'll earn points and stay connected with the community. Don’t miss out on the latest news and discussions happening in our Telegram group.`,
    reward: 100,
  },
  {
    id: 5,
    title: 'Subscribe Youtube',
    description: `Subscribe to our YouTube channel and be a part of our growing audience. By subscribing, you'll gain access to our latest video content, including tutorials, updates, and exclusive behind-the-scenes footage. Stay informed and entertained while earning points for your subscription. It’s a win-win situation – you get to enjoy our content, and we reward you for your support.`,
    reward: 100,
  },
  {
    id: 6,
    title: 'Follow us on Instagram',
    description: `Follow MemeFactory on Instagram to stay updated with our latest posts, stories, and exclusive content. By following our Instagram account, you’ll get a glimpse into our day-to-day activities, new releases, and special promotions. Plus, you’ll earn points as a reward for following us. Join our Instagram community and keep up with all the exciting updates.`,
    reward: 100,
  },
  {
    id: 7,
    title: 'Like our post on Facebook',
    description: `Show your support by liking our post on Facebook. Engage with our content and stay informed about our latest updates and promotions. By liking our post, you'll help us spread the word and earn points as a token of our appreciation. It’s a simple action with a great reward – like our post and boost your points today!`,
    reward: 100,
  },
];
