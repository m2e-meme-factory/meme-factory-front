import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Box, Button, Flex, Heading, IconButton, ScrollArea, TextArea } from '@radix-ui/themes';
import { PaperPlaneIcon } from '@radix-ui/react-icons';
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
import { useWebApp } from '@vkruglikov/react-telegram-web-app';

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

  const webapp = useWebApp();

  const handleBack = useCallback(() => {
    navigate(-1);
    webapp.BackButton.hide();
  }, [navigate, webapp]);

  useEffect(() => {
    webapp.ready();
    webapp.BackButton.show();
    webapp.onEvent('backButtonClicked', handleBack);

    return () => {
      webapp.offEvent('backButtonClicked', handleBack);
      webapp.BackButton.hide();
    };
  }, [handleBack, webapp]);

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
    const searchParams = new URLSearchParams(window.location.search);
    const fromTab = searchParams.get('fromTab');

    if (fromTab) {
      navigate(`/projects`);
    } else {
      navigate(-1);
    }
  };

  if (isLoading || isProjectLoading) {
    return <Loading />;
  }

  return (
    <>
      <Flex height='100vh' position='relative' direction='column'>
        <Flex
          p='4'
          align='center'
          style={{
            position: 'sticky',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 2,
            backgroundColor: 'var(--gray-2)',
          }}
          justify='between'
        >
          <Flex align='center'>
            {/* <IconButton onClick={handleBackClick} size='3'>
              <ArrowLeftIcon />
            </IconButton> */}
            <Heading>{shortenString(currentProject?.project.title, 20)}</Heading>
          </Flex>
          <Button onClick={() => navigate(`/projects/${projectId}`)}>VIEW</Button>
        </Flex>
        <Box p='4' asChild>
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
        </Box>
        <Flex
          p='4'
          align='center'
          style={{
            position: 'sticky',
            bottom: 0,
            zIndex: 1000,
            backgroundColor: 'var(--gray-2)',
          }}
        >
          <Flex width='100%' justify='between' align='center'>
            <TextArea
              placeholder='Send a message…'
              onChange={handleMessageChange}
              value={message}
              style={{ width: '85%', height: '8vh' }}
            />
            <IconButton size='4' onClick={handleMessageSend}>
              <PaperPlaneIcon />
            </IconButton>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default ProjectLogsPage;
