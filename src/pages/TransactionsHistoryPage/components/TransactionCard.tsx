import * as React from 'react';
import { Card, Text, Flex, Badge } from '@radix-ui/themes';
import { User } from 'api';

interface TransactionCardProps {
  currentUser?: User;
  toUser: User | null;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'SYSTEM' | 'PAYMENT';
  sum: number;
  fromUser: User | null;
  projectId: number | null;
}

const TransactionCard = ({
  currentUser,
  toUser,
  type,
  sum,
  fromUser,
  projectId,
}: TransactionCardProps) => {
  let sender = 'Sender';
  let receiver = 'Receiver';
  let amount = '';
  let isNegative = false;

  const getUserDisplayName = (user: User | null) => {
    if (!user) return 'Unknown User';
    return user.username ?? `User ${user.telegramId ?? 'ID'}`;
  };

  if (type === 'PAYMENT' || type === 'SYSTEM') {
    if (fromUser !== null) {
      sender = getUserDisplayName(fromUser);
      isNegative = !!(currentUser && fromUser?.id === currentUser.id);
      amount = isNegative ? `-${sum}` : `+${sum}`;
    } else {
      sender = 'Meme Factory';
      amount = `+${sum}`;
    }

    if (toUser !== null) {
      receiver = getUserDisplayName(toUser);
    }
  }

  if (type === 'DEPOSIT') {
    sender = '';
    amount = `+${sum}`;
    if (toUser !== null) {
      receiver = getUserDisplayName(toUser);
    }
  }

  if (type === 'WITHDRAWAL') {
    receiver = '';
    amount = `-${sum}`;
    if (fromUser !== null) {
      sender = getUserDisplayName(fromUser);
    }
  }

  return (
    <Card>
      <Flex direction='column' justify='between'>
        <Flex justify='between' align='start'>
          <Text size='5' weight='bold'>
            {sender}
          </Text>
          <Flex direction='row' align='center' gapX='2'>
            <Text size='6' weight='bold'>
              {amount}
            </Text>
            <Badge color='bronze'>M2E</Badge>
          </Flex>
        </Flex>
        <Flex justify='between' align='end' mt='2'>
          <Badge color={isNegative ? 'red' : 'green'}>{type}</Badge>
          <Text size='2' color='gray'>
            {receiver}
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
};

export default TransactionCard;
