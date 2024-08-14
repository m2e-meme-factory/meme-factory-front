import {
  Avatar,
  Box,
  Callout,
  Card,
  Flex,
  Heading,
  IconButton,
  Text,
  TextArea,
} from '@radix-ui/themes';
import React from 'react';
import { ArrowLeftIcon, InfoCircledIcon, PaperPlaneIcon } from '@radix-ui/react-icons';
import { useNavigate } from 'react-router-dom';
import LogMessage from './components/LogMessage';
import { Role } from '../../shared/consts/userRoles';

const ProjectLogsPage = () => {
  const navigate = useNavigate();

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
      >
        <IconButton onClick={() => navigate(-1)} size='3'>
          <ArrowLeftIcon></ArrowLeftIcon>
        </IconButton>
        <Heading ml='3'>Name Surname</Heading>
      </Flex>
      <Flex m='4' direction='column'>
        <LogMessage
          type='success'
          message='Маленькое сообщение'
          role={Role.CREATOR}
          userId='1'
        ></LogMessage>
        <LogMessage
          type='failure'
          message='Сообщение чуть-чуть побольше'
          role={Role.CREATOR}
          userId='1'
        ></LogMessage>
        <LogMessage
          type='info'
          message='Вот это уже достойное сообщение, такое можно и прочитать'
          role={Role.ADVERTISER}
          userId='1'
        ></LogMessage>
        <LogMessage
          type='message'
          message='Капец какое большое сообщение, зачем такие большие сообщения писать, пока дочитаешь состаришься блин'
          role={Role.ADVERTISER}
          userId='1'
        ></LogMessage>
        <LogMessage
          type='success'
          message='Маленькое сообщение'
          role={Role.CREATOR}
          userId='1'
        ></LogMessage>
        <LogMessage
          type='failure'
          message='Сообщение чуть-чуть побольше'
          role={Role.CREATOR}
          userId='1'
        ></LogMessage>
        <LogMessage
          type='info'
          message='Вот это уже достойное сообщение, такое можно и прочитать'
          role={Role.ADVERTISER}
          userId='1'
        ></LogMessage>
        <LogMessage
          type='message'
          message='Капец какое большое сообщение, зачем такие большие сообщения писать, пока дочитаешь состаришься блин'
          role={Role.ADVERTISER}
          userId='1'
        ></LogMessage>
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
          <TextArea placeholder='Send a message…' style={{ width: '80vw', height: '8vh' }} />
          <IconButton size='4'>
            <PaperPlaneIcon />
          </IconButton>
        </Flex>
      </Flex>
    </>
  );
};

export default ProjectLogsPage;
