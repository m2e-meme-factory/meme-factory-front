import React, { FC, useState } from 'react';
import parse from 'html-react-parser';
import { Button, Card, Flex } from '@radix-ui/themes';
import './index.css';

interface TaskDescriptionDisplayProps {
  description: string;
}

const TaskDescriptionDisplay: FC<TaskDescriptionDisplayProps> = ({ description }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card style={{ width: '100%' }}>
      <Flex direction='column' m='2'>
        <div className='desc-content'>
          {isExpanded
            ? parse(description)
            : parse(description.substring(0, 50) + (description.length > 50 ? '...' : ''))}
        </div>
        {description.length > 50 && (<Button mt='3' variant='ghost' onClick={toggleDescription} size='1'>
          {isExpanded ? 'Свернуть' : 'Развернуть'}
        </Button>)}
      </Flex>
    </Card>
  );
};

export default TaskDescriptionDisplay;
