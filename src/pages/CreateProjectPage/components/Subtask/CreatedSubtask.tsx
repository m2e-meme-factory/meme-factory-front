import { Card, Flex, IconButton, Text } from '@radix-ui/themes';
import { RocketOutlined } from '@ant-design/icons';
import React, { Dispatch, FC, SetStateAction } from 'react';
import { TrashIcon } from '@radix-ui/react-icons';
import styles from './CreatedSubtask.module.css';
import { Subtask } from '../../../../@types/api';

interface SubtaskCardProps {
  id: string;
  title: string;
  price: number;
  setSubtask: Dispatch<SetStateAction<Subtask[]>>;
}

const CreatedSubtask: FC<SubtaskCardProps> = ({ title, price, id, setSubtask }) => {
  const handleDelete = () => {
    setSubtask((prevSubtasks) => prevSubtasks.filter((subtask) => subtask.id !== id));
  };

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
        <IconButton onClick={handleDelete}>
          <TrashIcon></TrashIcon>
        </IconButton>
      </Flex>
    </Card>
  );
};

export default CreatedSubtask;
