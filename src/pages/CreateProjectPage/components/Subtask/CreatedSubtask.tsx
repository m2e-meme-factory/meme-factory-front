import { Card, Flex, IconButton, Text } from '@radix-ui/themes';
import { RocketOutlined } from '@ant-design/icons';
import React, { FC } from 'react';
import { Cross2Icon, TrashIcon } from '@radix-ui/react-icons';
import styles from './CreatedSubtask.module.css';
import * as Form from '@radix-ui/react-form';
import * as Dialog from '@radix-ui/react-dialog';

interface SubtaskCardProps {
  id: number;
  title: string;
  description: string;
  price: number;
}

const CreatedSubtask: FC<SubtaskCardProps> = ({ id, title, description, price }) => {
  return (
    <Card className={styles.CreatedSubtask}>
      <Flex justify='between' align='center'>
        <Flex>
          <RocketOutlined style={{ color: 'yellow', marginRight: '15px' }} />
          <Flex direction='column'>
            <Text size='5' weight='medium'>
              {title}
            </Text>
            <Text weight='medium'>
              <Text color='yellow'>Price:</Text> {price}$
            </Text>
          </Flex>
        </Flex>
        <IconButton>
          <TrashIcon></TrashIcon>
        </IconButton>
      </Flex>
    </Card>
  );
};

export default CreatedSubtask;
