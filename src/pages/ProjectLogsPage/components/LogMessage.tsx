import React, { FC } from 'react';
import styled from 'styled-components';
import { Flex, Text } from '@radix-ui/themes';
import { Role } from '../../../shared/consts/userRoles';
import { getColorByType } from '../../../shared/utils/helpers/getMessageColor';

const MessageContainer = styled.div<{ color: string; side: 'left' | 'right' }>`
  background-color: ${({ color }) => color};
  border-radius: 16px;
  padding: 12px 16px;
  max-width: 60%;
  margin: 8px 0;
  ${({ side }) => (side === 'left' ? 'margin-right: 20vw;' : 'margin-left: 20vw;')};
`;

const MessageContainerRecolored = styled.div<{ color: string; side: 'left' | 'right' }>`
  border: 3px solid ${({ color }) => color};
  background-color: #121212;
  border-radius: 16px;
  padding: 12px 16px;
  max-width: 60%;
  margin: 8px 0;
  ${({ side }) => (side === 'left' ? 'margin-right: 20vw;' : 'margin-left: 20vw;')};
`;

interface MessageProps {
  message: string;
  role: Role;
  type: 'success' | 'failure' | 'info' | 'message';
  userId: string;
}

const LogMessage: FC<MessageProps> = ({ message, role, type, userId }) => {
  const color = getColorByType(type);
  const side = role === Role.CREATOR ? 'left' : 'right';

  return (
    <Flex justify={side === 'left' ? 'start' : 'end'} width='100%'>
      <MessageContainer color={color} side={side}>
        <Flex direction='column'>
          <Text align={side} size='1' color='gray'>
            Name Surname
          </Text>
          <Text align={side}>{message}</Text>
        </Flex>
      </MessageContainer>
    </Flex>
  );
};

export default LogMessage;
