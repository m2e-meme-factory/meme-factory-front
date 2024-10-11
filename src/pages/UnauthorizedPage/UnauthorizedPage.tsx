import { Flex, Heading, Text } from '@radix-ui/themes';

const UnauthorizedPage = () => {
  return (
    <Flex width='100vw' height='100vh' direction='column' align='center' justify='center'>
      <Heading color='red'>Unauthorized</Heading>
      <Text weight='medium' align='center'>Sorry, authorization failed. Try again later.</Text>
    </Flex>
  );
};

export default UnauthorizedPage;
