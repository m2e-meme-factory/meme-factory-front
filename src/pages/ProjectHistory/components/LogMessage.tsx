import React, { Dispatch, FC, SetStateAction } from 'react';
import styled from 'styled-components';
import { Flex, Text } from '@radix-ui/themes';
import { Role } from '../../../shared/consts/userRoles';
import { getColorByType } from '../../../shared/utils/helpers/getMessageColor';
import RejectApproveTaskSection from './RejectApproveTaskSection';
import { Event } from 'api';
import RejectAcceptApplicationSection from './RejectApproveApplicationSection';
import { EventType } from '../../../shared/utils/helpers/getEventType';
import { isApplicationUnsubmitted } from '../../../shared/utils/helpers/isApplicationUnsubmitted';

const MessageContainer = styled.div<{ color: string; side: 'left' | 'right' }>`
  background-color: ${({ color }) => color};
  border-radius: ${({ side }) => (side === 'left' ? '16px 16px 16px 4px' : '16px 16px 4px 16px')};
  padding: 12px 16px;
  max-width: 60%;
  margin: 8px 8px;
  ${({ side }) => (side === 'left' ? 'margin-right: 20vw;' : 'margin-left: 20vw;')};
  word-wrap: break-word;
  overflow-wrap: break-word;
`;

interface MessageProps {
  event: Event;
  messageType: 'success' | 'failure' | 'info' | 'message';
  setNewEventCreated: Dispatch<SetStateAction<boolean>>;
  currentUserRole: Role;
  creatorName: string;
  advertiserName: string;
  allEvents: Event[];
}

const LogMessage: FC<MessageProps> = ({
  event,
  messageType,
  setNewEventCreated,
  currentUserRole,
  creatorName,
  advertiserName,
  allEvents,
}) => {
  const color = getColorByType(messageType);
  const side = event.role === currentUserRole ? 'right' : 'left';

  const hasTaskCompleted = allEvents.some(
    (e) => e.eventType === EventType.TASK_COMPLETED && e.details?.eventId === event.id
  );

  const applicationAccepted = allEvents.some((e) => e.eventType === EventType.APPLICATION_APPROVED);
  const applicationRejected = allEvents.some((e) => e.eventType === EventType.APPLICATION_REJECTED);
  const showApplicationButtons =
    !(applicationAccepted || applicationRejected) || isApplicationUnsubmitted(allEvents, event);

  const shouldShowButtons = !hasTaskCompleted;

  return (
    <Flex justify={side === 'left' ? 'start' : 'end'} width='100%' maxWidth='100%'>
      <MessageContainer color={color} side={side}>
        <Flex direction='column'>
          <Text align={side} size='1' color='gray'>
            {event.role === 'creator' ? creatorName : advertiserName}
          </Text>
          {event.message && (
            <Text as='p' wrap='balance' align={side} style={{ wordBreak: 'break-word' }}>
              {event.message}
            </Text>
          )}
          {event.eventType === EventType.TASK_SUBMIT &&
            currentUserRole === Role.ADVERTISER &&
            shouldShowButtons && (
              <RejectApproveTaskSection
                taskId={event.details?.taskId}
                setNewEventCreated={setNewEventCreated}
                userId={event.userId}
                eventId={event.id}
              />
            )}
          {event.eventType === EventType.APPLICATION_SUBMITTED &&
            currentUserRole === Role.ADVERTISER &&
            showApplicationButtons && (
              <RejectAcceptApplicationSection progressId={event.progressProjectId} />
            )}
        </Flex>
      </MessageContainer>
    </Flex>
  );
};

export default LogMessage;
