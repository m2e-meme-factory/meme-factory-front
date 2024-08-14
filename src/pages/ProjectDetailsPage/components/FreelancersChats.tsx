import { Card, Flex, Text } from '@radix-ui/themes';
import FreelancerChatCard from './FreelancerChatCard';

const FreelancersChats = () => {
  return (
    <Flex direction='column' mt='2'>
      <FreelancerChatCard id='1' name='Name Surname' avatarUrl='/' />
      <FreelancerChatCard id='1' name='Name Surname' avatarUrl='/' />
      <FreelancerChatCard id='1' name='Name Surname' avatarUrl='/' />
    </Flex>
  );
};

export default FreelancersChats;
