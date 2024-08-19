import React, { Dispatch, FC, SetStateAction } from 'react';
import styled from 'styled-components';
import { Flex, Text } from '@radix-ui/themes';
import { Role } from '../../../shared/consts/userRoles';
import { getColorByType } from '../../../shared/utils/helpers/getMessageColor';
import { EventType } from '../../../shared/utils/helpers/getEventType';
import RejectApproveSection from './RejectApproveSection';
import { Event } from 'api';

const MessageContainer = styled.div<{ color: string; side: 'left' | 'right' }>`
  background-color: ${({ color }) => color};
  border-radius: 16px;
  padding: 12px 16px;
  max-width: 60%;
  margin: 8px 0;
  ${({ side }) => (side === 'left' ? 'margin-right: 20vw;' : 'margin-left: 20vw;')};
`;

interface MessageProps {
  event: Event;
  messageType: 'success' | 'failure' | 'info' | 'message';
  setNewEventCreated: Dispatch<SetStateAction<boolean>>;
  currentUserRole: Role;
}

const LogMessage: FC<MessageProps> = ({
  event,
  messageType,
  setNewEventCreated,
  currentUserRole,
}) => {
  const color = getColorByType(messageType);
  const side = event.role === Role.CREATOR ? 'left' : 'right';

  return (
    <Flex justify={side === 'left' ? 'start' : 'end'} width='100%'>
      <MessageContainer color={color} side={side}>
        <Flex direction='column'>
          <Text align={side} size='1' color='gray'>
            Name Surname
          </Text>
          <Text align={side}>Event description: {event.description}</Text>
          {event.message && <Text align={side}>User message: {event.message}</Text>}
          {event.eventType === EventType.TASK_SUBMIT && currentUserRole === Role.ADVERTISER && (
            <RejectApproveSection
              taskId={event.details?.taskId}
              setNewEventCreated={setNewEventCreated}
            />
          )}
        </Flex>
      </MessageContainer>
    </Flex>
  );
};

export default LogMessage;
