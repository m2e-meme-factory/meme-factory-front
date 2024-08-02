import { Card, Flex, Heading, Text } from '@radix-ui/themes';
import { FC } from 'react';
import { ArrowDownIcon } from '@radix-ui/react-icons';

interface TransactionCardProps {
  sender: string;
  receiver: string;
  projectId: string;
  taskTitle: string;
  value: number;
}

const TransactionCard: FC<TransactionCardProps> = ({
  sender,
  receiver,
  projectId,
  taskTitle,
  value,
}) => {
  return (
    <Card mt='3'>
      <Heading size='5' mb='3'>
        Task: {taskTitle}
      </Heading>
      <Card>
        <Flex align='center' justify='between'>
          <Flex direction='column' align='center'>
            <Text weight='medium'>{sender}</Text>
            <Flex>
              <ArrowDownIcon fontSize='30' />
            </Flex>
            <Text weight='medium'>{receiver}</Text>
          </Flex>
          <Heading>$25 094</Heading>
        </Flex>
      </Card>
    </Card>
  );
};

export default TransactionCard;
