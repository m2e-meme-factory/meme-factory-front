import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Flex, Heading, Text } from '@radix-ui/themes';

const NotFoundPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  return(
    <Flex direction="column" m='4'>
      <Heading>404: Page Not Found</Heading>
      <Text>{location.pathname}</Text>
      <Button mt='3' onClick={() => navigate('/projects')}>To main</Button>
    </Flex>
  );
}
export default NotFoundPage;