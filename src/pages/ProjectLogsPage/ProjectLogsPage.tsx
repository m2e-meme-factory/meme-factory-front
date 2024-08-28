import React, { useEffect, useState, useRef } from 'react';
import { Button, Flex, Heading, IconButton, ScrollArea, TextArea } from '@radix-ui/themes';
import { ArrowLeftIcon, PaperPlaneIcon } from '@radix-ui/react-icons';
import { useNavigate, useParams } from 'react-router-dom';
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
import { shortenString } from '../../shared/utils/helpers/shortenString';

const ProjectLogsPage = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);
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
  const [error, setError] = useState<string | null>(null);

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (projectResponse) {
      setCurrentProject(projectResponse.data);
    }
  }, [projectResponse]);

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

  useEffect(() => {
    if (error) {
      showErrorMessage(error);
      navigate(-1);
    }
  }, [error, navigate]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [events]);

  const handleMessageSend = () => {
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
    } else {
      showErrorMessage('Something went wrong!');
    }
  };

  const handleMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  const handleBackClick = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      if (user) {
        if (user.role === Role.CREATOR) {
          navigate('/profile?tab=myprojects');
        } else if (projectId) {
          navigate(`/projects/${projectId}/details`);
        } else {
          navigate('/projects');
        }
      } else {
        navigate('/projects');
      }
    }
  };

  if (isLoading || isProjectLoading) {
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
          <IconButton onClick={handleBackClick} size='3'>
            <ArrowLeftIcon />
          </IconButton>
          <Heading ml='3'>{shortenString(currentProject?.project.title, 20)}</Heading>
        </Flex>
        <Button onClick={() => navigate(`/projects/${projectId}`)}>To project page</Button>
      </Flex>
      <Flex m='4' direction='column' style={{ height: '73vh' }}>
        <ScrollArea scrollbars='vertical' ref={scrollAreaRef}>
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
