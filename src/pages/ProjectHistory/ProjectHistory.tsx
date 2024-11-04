import React, { useEffect, useState, useRef } from 'react';
import { Box, Button, Flex, Heading, IconButton, ScrollArea, TextArea } from '@radix-ui/themes';
import { PaperPlaneIcon } from '@radix-ui/react-icons';
import { CreateEventDto, Event, Project, ProjectProgress, User } from 'api';
import { EventType, getEventType } from '../../shared/utils/helpers/getEventType';
import LogMessage from './components/LogMessage';
import { useGetProgress } from '../../shared/utils/api/hooks/project/useGetProjectProgress';
import { useCreateEvent } from '../../shared/utils/api/hooks/event/useCreateEvent';
import { showErrorMessage } from '../../shared/utils/helpers/notify';
import { Role } from '../../shared/consts/userRoles';
import { shortenString } from '../../shared/utils/helpers/shortenString';
import { ResponsibleImageBox } from '../../shared/components/ResponsibleImageBox';
import Lottie from 'lottie-react';
import lottieAnimation from '../../shared/components/LottieIcons/Eyes/eyes.json';

const ProjectHistory = (props: {
  user?: User
  currentProject: Project,
}) => {
  
  const { user, currentProject } = props; 

  const { data, isLoading, refetch } = useGetProgress({
    projectId: currentProject.project.id ?? '',
    userId: user?.id ?? '1',
  });

  const [newEventCreated, setNewEventCreated] = useState(false);
  const createEventMutation = useCreateEvent(setNewEventCreated);
  const [userProgress, setUserProgress] = useState<ProjectProgress>();

  const [message, setMessage] = useState<string>('');
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data) {
      const progress = data.data[0];
      if (progress?.events?.length) {
        setUserProgress(progress);
        setEvents(progress.events);
      } else {
        setError('Error. No events found');
      }
    }
  }, [data]);

  useEffect(() => {
    if (newEventCreated) {
      refetch().then((response) => {
        const progress = response.data?.data[0];
        if (progress) {
          setUserProgress(progress);
          setEvents(progress.events);
          setNewEventCreated(false);
        }
      });
    }
  }, [newEventCreated, refetch]);

  const handleMessageSend = () => {
    window.scrollTo(0, 0);
    if (userProgress && user) {
      const newEvent: CreateEventDto = {
        projectId: userProgress.projectId,
        userId: userProgress.userId,
        role: user.role,
        eventType: EventType.USER_MESSAGE,
        progressProjectId: userProgress.id,
        message,
      };
      createEventMutation.mutate({ params: newEvent });
      setMessage('');
      setNewEventCreated(true);
      if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo(0, scrollAreaRef.current.scrollHeight);
      }
    } else {
      showErrorMessage('Something went wrong!');
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo(0, scrollAreaRef.current.scrollHeight);
    }
  }, [events])

  const handleMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  const handleBlur = () => {
    window.scrollTo(0, 0);
  };

  if (events.length === 0 && !isLoading) 
  return (
    <Flex direction="column" justify="center" align="center" height="100%">
      <ResponsibleImageBox>
        <Lottie style={{ height: "80%" }} animationData={lottieAnimation} loop={true} autoplay={true} />
        <Heading size="6" align="center">
          Looks like there is no history yet...
        </Heading>
      </ResponsibleImageBox>
    </Flex>
  );

  return (
      <>
      <ScrollArea style={{ height: '100%' }} ref={scrollAreaRef}>
        <Flex
          direction='column'
          style={{
            height: '100%',
            transition: 'height 0.3s ease',
          }}
          justify='between'
        >
            {events.map((event) => (
              <LogMessage
                key={event.id}
                currentUserRole={user?.role ?? Role.CREATOR}
                event={event}
                messageType={getEventType(event.eventType)}
                setNewEventCreated={setNewEventCreated}
                creatorName={
                  userProgress?.user.username
                    ? userProgress?.user.username
                    : `User ${userProgress?.user.telegramId}`
                }
                advertiserName={shortenString(
                  currentProject
                    ? currentProject.project.author.username
                      ? currentProject.project.author.username
                      : `User ${currentProject.project.author.telegramId}`
                    : 'Project host'
                )}
                allEvents={events}
              />
            ))}
        </Flex>
      </ScrollArea>
          <Flex
            p='4'
            // align='center'
            style={{
              backgroundColor: '#121212',
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
            }}
          >
            <Flex width='100%' justify='between' align='center' gapX='2'>
              <TextArea
                placeholder='Send a message…'
                onChange={handleMessageChange}
                value={message}
                style={{ width: '100%', height: "8vh"}}
                maxLength={500}
                onBlur={handleBlur}
              />
              <IconButton size='4' onClick={handleMessageSend}>
                <PaperPlaneIcon />
              </IconButton>
            </Flex>
          </Flex>
      </>
  );
};

export default ProjectHistory;
