import { Avatar, Card, Flex, Text } from '@radix-ui/themes';
import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';

interface FreelancerChatCardProps {
  name: string;
  avatarUrl: string;
  id: string;
}

const FreelancerChatCard: FC<FreelancerChatCardProps> = ({ name, avatarUrl, id }) => {
  const navigate = useNavigate();

  return (
    <Card mb='3' onClick={() => navigate(`/projects/${id}/logs/1`)}>
      <Flex direction='row' justify='start' align='center'>
        <Avatar fallback={avatarUrl} />
        <Text weight='medium' ml='3'>
          {name}
        </Text>
      </Flex>
    </Card>
  );
};

export default FreelancerChatCard;
