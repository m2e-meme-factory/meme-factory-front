import * as Dialog from '@radix-ui/react-dialog';
import { Button, Flex, Text } from '@radix-ui/themes';
import { task } from '../../../../shared/consts/task-example';
import { shortenDescription } from '../../../../shared/utils/helpers/shortenDescription';
import React, { FC, useState } from 'react';

interface ModalInfoProps {
  id: number;
  title: string;
  description: string;
  price: number;
}

const ModalSubtaskInfo: FC<ModalInfoProps> = ({ id, title, description, price }) => {
  const [isDescVisible, setDescVisible] = useState(false);

  const handleToggleDescription = () => {
    setDescVisible(!isDescVisible);
  };

  return (
    <>
      <Dialog.Description>
        <Flex direction='column'>
          <Text className='TextAccent'>Description:</Text>
          <Text className='Description'>
            {isDescVisible ? task.description : shortenDescription(task.description)}
            <Button
              variant='ghost'
              onClick={handleToggleDescription}
              style={{ marginLeft: '8px', color: '#fecf0a' }}
            >
              {isDescVisible ? 'View Less' : 'View More'}
            </Button>
          </Text>
          <Text className='Price'>
            <span className='TextAccent'>Price:</span> {price}$
          </Text>
        </Flex>
      </Dialog.Description>
    </>
  );
};

export default ModalSubtaskInfo;