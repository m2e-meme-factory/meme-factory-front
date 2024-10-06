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
        <div className='desc-content'>{parse(description)}</div>
      </Flex>
    </Card>
  );
};

export default TaskDescriptionDisplay;
