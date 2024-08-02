import { Avatar, Box, Callout, Card, Flex, Heading, IconButton, Text } from '@radix-ui/themes';
import React from 'react';
import { ArrowLeftIcon, InfoCircledIcon } from '@radix-ui/react-icons';
import { useNavigate } from 'react-router-dom';

const FreelancerLogsPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Card m='4'>
        <Flex align='center' justify='between'>
          <IconButton onClick={() => navigate(-1)} size='3'><ArrowLeftIcon></ArrowLeftIcon></IconButton>
          <Flex align='center' justify='start'>
            <Avatar mr='3' src='/' fallback='/'></Avatar>
            <Heading>Ilon Mosquito</Heading>
          </Flex>
        </Flex>
      </Card>
      <Flex m='4' direction='column'>
        <Callout.Root>
          <Callout.Icon>
            <InfoCircledIcon />
          </Callout.Icon>
          <Callout.Text>Заявка была принята</Callout.Text>
        </Callout.Root>

        <Flex justify='end' mt='3'>
          <Card>
            <Flex>
              <Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc rhoncus, nulla non
                egestas viverra, libero sem tincidunt nulla, sit amet volutpat velit purus rhoncus
                augue.{' '}
              </Text>
              <Avatar size='2' src='/' fallback='/'></Avatar>
            </Flex>
          </Card>
        </Flex>
      </Flex>
    </>
  );
};

export default FreelancerLogsPage;
