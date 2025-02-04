import { LOCAL_TEXT } from '@shared/consts';

type CardFriends = {
  title: string;
  description: string;
};

export const CARD_CONSTANT: CardFriends[] = [
  {
    title: LOCAL_TEXT.INVITE_FRIENDS_LOWER,
    description: LOCAL_TEXT.COPY_LINK_SEND_YOUR_FRIEND,
  },
  { title: LOCAL_TEXT.YOUR_FRIEND_JOIN, description: LOCAL_TEXT.YOUR_FRIEND_JOIN_MEME_FACTORY },
  { title: LOCAL_TEXT.YOU_GET_REWARD, description: LOCAL_TEXT.YOU_GET_PER_EACH_FRIEND_HIS_INCOME },
];

