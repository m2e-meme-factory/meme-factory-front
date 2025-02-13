import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button, Flex, Heading, IconButton, ScrollArea, TextArea } from '@radix-ui/themes';
import { PaperPlaneIcon } from '@radix-ui/react-icons';
import { useNavigate, useParams } from 'react-router-dom';
import { CreateEventDto, Event, Project, ProjectProgress } from 'api';

import { EventType, getEventType } from '@shared/utils/helpers/getEventType';
import LogMessage from './components/LogMessage';
import { useGetProgress } from '@shared/utils/api/hooks/project/useGetProjectProgress';
import { useCreateEvent } from '@shared/utils/api/hooks/event/useCreateEvent';
import { RootState } from '@shared/utils/redux/store';
import { showErrorMessage } from '@shared/utils/helpers/notify';
import Loading from '@shared/components/Loading';
import { Role } from '@shared/consts/userRoles';
import { useGetProject } from '@shared/utils/api/hooks/project/useGetProject';
import { shortenString } from '@shared/utils/helpers/shortenString';
import { LOCAL_TEXT } from '@shared/consts';

const ProjectLogsPage = () => {
  const { t } = useTranslation();
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
        setError(t(LOCAL_TEXT.ERROR_NO_EVENTS_FOUND));
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
      showErrorMessage(t(LOCAL_TEXT.SOMETHIMG_WENT_WRONG));
    }
  };

  const handleMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  const handleBlur = () => {
    window.scrollTo(0, 0);
  };

  if (isLoading || isProjectLoading) {
    return <Loading />;
  }

  return (
    <Flex
      direction='column'
      style={{
        height: '100vh',
        transition: 'height 0.3s ease',
      }}
      justify='between'
    >
      <Flex p='4' align='center' justify='between' style={{ backgroundColor: '#121212' }}>
        <Flex align='center'>
          <Heading>{shortenString(currentProject?.project.title, 20)}</Heading>
        </Flex>
        <Button onClick={() => navigate(`/projects/${projectId}`)}>VIEW</Button>
      </Flex>
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
      <Flex
        p='4'
        align='center'
        style={{
          backgroundColor: '#121212',
          position: 'sticky',
          bottom: 0,
        }}
      >
        <Flex width='100%' justify='between' align='center' gapX='2'>
          <TextArea
            placeholder='Send a message…'
            onChange={handleMessageChange}
            value={message}
            style={{ width: '100%', height: '8vh' }}
            maxLength={500}
            onBlur={handleBlur}
          />
          <IconButton size='4' onClick={handleMessageSend}>
            <PaperPlaneIcon />
          </IconButton>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ProjectLogsPage;
