import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Flex, Heading, Badge, Select } from '@radix-ui/themes';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useWebApp } from '@vkruglikov/react-telegram-web-app';

import { RootState } from '@shared/utils/redux/store';
import { getLocalStorage, setLocalStorage } from '@shared/utils/helpers/local-storage';
import { LOCAL_STORAGE_CONSTANTS } from '@shared/consts/local-storage-constants';

function numberWithSpaces(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export const Header = () => {
  const { i18n } = useTranslation();

  const webApp = useWebApp();
  const userLanguage = webApp?.initDataUnsafe?.user?.language_code;

  const user = useSelector((state: RootState) => state.user.user);

  const initialLang = getLocalStorage(LOCAL_STORAGE_CONSTANTS.LANG) || userLanguage || 'en';
  const [lang, setLang] = useState(initialLang);

  const handleChangeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setLocalStorage(LOCAL_STORAGE_CONSTANTS.LANG, lang);
    setLang(lang);
  };

  return (
    <Flex justify='between' align='center'>
      <Link
        style={{
          cursor: 'pointer',
          textDecoration: 'none',
          color: 'inherit',
          display: 'flex',
          gap: '5px',
        }}
        to='/wallet'
      >
        <Heading align='center'>{numberWithSpaces(user ? Number(user.balance) : 0)}</Heading>
        <Badge size='3' color='gold' variant='soft' radius='full'>
          XP
        </Badge>
      </Link>
      <Select.Root
        onValueChange={(language) => handleChangeLanguage(language)}
        value={lang}
        size='2'
      >
        <Select.Trigger variant='soft' color='bronze' radius='full' />
        <Select.Content color='gray'>
          <Select.Item value='en'>EN</Select.Item>
          <Select.Item value='ru'>RU</Select.Item>
        </Select.Content>
      </Select.Root>
    </Flex>
  );
};
