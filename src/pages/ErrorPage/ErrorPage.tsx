import { Flex, Heading, Text } from '@radix-ui/themes';

const ErrorPage = () => {
  return (
    <Flex width='100vw' height='100vh' direction='column' align='center' justify='center'>
      <Heading color='red'>Internal server error</Heading>
      <Text weight='medium'>Sorry, something went wrong. We're working on it.</Text>
    </Flex>
  );
};

export default ErrorPage;
