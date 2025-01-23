import { Flex, Text } from '@radix-ui/themes';
import EyesAnimated from './LottieIcons/Eyes/EyesAnimated';

const NothingFound = () => {
  return (
    <Flex minHeight='50vh' align='center' justify='center' direction='column'>
      <EyesAnimated />
      <Text align='center' wrap='balance'>
        Nothing was found...
      </Text>
    </Flex>
  );
};

export default NothingFound;
