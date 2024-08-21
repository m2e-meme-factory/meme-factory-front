import React, { useEffect, useState, useRef } from 'react';
import { Button, Flex, Heading, IconButton, ScrollArea, TextArea } from '@radix-ui/themes';
import { ArrowLeftIcon, PaperPlaneIcon } from '@radix-ui/react-icons';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { CreateEventDto, Event, Project, ProjectProgress } from 'api';
import { EventType, getEventType } from '../../shared/utils/helpers/getEventType';
import LogMessage from './components/LogMessage';
import { useGetProgress } from '../../shared/utils/api/hooks/project/useGetProjectProgress';
import { useCreateEvent } from '../../shared/utils/api/hooks/event/useCreateEvent';
import { useSelector } from 'react-redux';
import { RootState } from '../../shared/utils/redux/store';
import { showErrorMessage } from '../../shared/utils/helpers/notify';
import Loading from '../../shared/components/Loading';
import { Role } from '../../shared/consts/userRoles';
import { useGetProject } from '../../shared/utils/api/hooks/project/useGetProject';
import { ROUTES } from '../../shared/consts/routes';

const ProjectLogsPage = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);
  const location = useLocation();

  const { projectId, userId } = useParams();
  const { data, isLoading, refetch } = useGetProgress({
    projectId: projectId ?? '',
    userId: userId ?? '',
  });
  const { data: projectResponse, isLoading: isProjectLoading } = useGetProject(projectId);

  const [newEventCreated, setNewEventCreated] = useState(false);
  const createEventMutation = useCreateEvent(setNewEventCreated);

  const [currentProject, setCurrentProject] = useState<Project>();
  const [userProgress, setUserProgress] = useState<ProjectProgress>();
  const [message, setMessage] = useState<string>('');
  const [events, setEvents] = useState<Event[]>([]);

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (projectResponse) {
      setCurrentProject(projectResponse.data);
    }
  }, [projectResponse]);

  useEffect(() => {
    if (data) {
      setUserProgress(data.data[0]);
      if (data.data[0]?.events) {
        setEvents(data.data[0].events);
      } else {
        showErrorMessage('Error. No events found');
        navigate(-1);
      }
    }
  }, [data]);

  useEffect(() => {
    const refetchEvents = async () => {
      const response = await refetch();
      if (response.data?.data[0]) {
        setUserProgress(response.data?.data[0]);
        setEvents(response.data?.data[0].events);
        setNewEventCreated(false);
      }
    };

    if (newEventCreated) {
      refetchEvents();
    }
  }, [newEventCreated, refetch]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [events]);

  const handleMessageSend = () => {
    let newEvent: CreateEventDto;
    if (userProgress && user) {
      newEvent = {
        projectId: userProgress.projectId,
        userId: userProgress.userId,
        role: user?.role,
        eventType: EventType.USER_MESSAGE,
        progressProjectId: userProgress?.id,
        message: message,
      };
      createEventMutation.mutate({ params: newEvent });
    } else {
      showErrorMessage('Something went wrong!');
    }
    setMessage('');
    setNewEventCreated(false);
  };

  const handleMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Flex
        align='center'
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          backgroundColor: '#121212',
          padding: '10px',
        }}
        justify='between'
      >
        <Flex align='center'>
          <IconButton onClick={() => navigate(ROUTES.PROFILE)} size='3'>
            <ArrowLeftIcon></ArrowLeftIcon>
          </IconButton>
          <Heading ml='3'>{currentProject?.title}</Heading>
        </Flex>
        <Button onClick={() => navigate(`/projects/${projectId}`)}>To project page</Button>
      </Flex>
      <Flex m='4' direction='column' style={{ height: '73vh' }}>
        <ScrollArea scrollbars='vertical' ref={scrollAreaRef}>
          {events.length > 0 &&
            events.map((event) => (
              <LogMessage
                key={event.id} // Не забудьте добавить ключ для списка
                currentUserRole={user?.role ?? Role.CREATOR}
                event={event}
                messageType={getEventType(event.eventType)}
                setNewEventCreated={setNewEventCreated}
                creatorName={
                  userProgress?.user.username
                    ? userProgress?.user.username
                    : (`User ${userProgress?.user.telegramId}` ?? 'User')
                }
                advertiserName={currentProject ? currentProject.title : 'Project host'}
              />
            ))}
        </ScrollArea>
      </Flex>
      <Flex
        align='center'
        style={{
          position: 'sticky',
          bottom: 0,
          zIndex: 1000,
          backgroundColor: '#121212',
          padding: '10px',
        }}
      >
        <Flex width='100%' justify='between' align='center'>
          <TextArea
            placeholder='Send a message…'
            onChange={handleMessageChange}
            value={message}
            style={{ width: '80vw', height: '8vh' }}
          />
          <IconButton size='4' onClick={handleMessageSend}>
            <PaperPlaneIcon />
          </IconButton>
        </Flex>
      </Flex>
    </>
  );
};

export default ProjectLogsPage;
