import { Flex, Spinner } from '@radix-ui/themes';
import React from 'react';

const Loading = () => {
  return(
    <Flex style={{height: '100vh'}} align='center' justify='center'>
      <Spinner size='3' />
    </Flex>
  );
}

export default Loading;