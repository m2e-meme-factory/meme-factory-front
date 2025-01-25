import { Flex, Heading, Text } from '@radix-ui/themes';
import { useTranslation } from 'react-i18next';

import { LOCAL_TEXT } from '@shared/consts';

const ErrorPage = () => {
  const { t } = useTranslation();

  return (
    <Flex width='100vw' height='100vh' direction='column' align='center' justify='center'>
      <Heading color='red'>{t(LOCAL_TEXT.INTERNAL_SERVER_ERROR)}</Heading>
      <Text weight='medium'>{t(LOCAL_TEXT.SORRY_SOMETHING_WENT_WRONG_WE_WORKING_ON_IT)}</Text>
    </Flex>
  );
};

export default ErrorPage;
