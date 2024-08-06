import * as React from 'react';
import { Grid, Flex, TextField, Heading, Box, Card, Callout } from '@radix-ui/themes';
import { CrossCircledIcon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';
import * as z from 'zod';
import { transformPhoneNumber } from '../../shared/utils/helpers/transformPhoneNumber';
import { formDataSchema } from '../../shared/utils/helpers/formDataScheme';
import { useTelegram } from '../../shared/hooks/useTelegram';
import { useVerifyUser } from '../../shared/utils/api/hooks/useVerifyUser';

export default function VerifyForm() {
  const { user, webApp } = useTelegram();
  const tg = webApp;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const [formError, setFormError] = useState<
    | z.ZodFormattedError<
        {
          name: string;
          email: string;
          phone: string;
        },
        string
      >
    | undefined
  >();

  const [focusedInputs, setFocusedInputs] = useState<string[]>([]);

  const mutateVerifyUser = useVerifyUser();

  const onSendData = async () => {
    const query_id = webApp?.initDataUnsafe.query_id;

    if (validate()) {
      if (!query_id || !user) return;

      const phoneNumber = transformPhoneNumber(phone);

      if (!phoneNumber) return;

      const payload = {
        query_id,
        userId: user.id.toString(),
        name,
        phoneNumber,
        email,
      };

      mutateVerifyUser.mutate(
        {
          params: {
            queryId: '',
            userData: payload,
          },
        },
        {
          onSuccess: (data) => {
            console.log(data);
          },
        }
      );
    }
  };

  const validate = () => {
    const formData = formDataSchema.safeParse({
      name,
      phone,
      email,
    });

    if (formData.success) {
      setFormError(undefined);

      const phoneNumber = transformPhoneNumber(phone);

      if (!phoneNumber) return;

      return true;
    } else {
      setFormError(formData.error.format());
    }

    return;
  };

  useEffect(() => {
    if (!tg) return;

    tg.MainButton.show();

    if (!validate()) {
      tg.MainButton.setParams({
        color: '#8fc600',
      });
      tg.MainButton.disable();
    } else {
      tg.MainButton.enable();
      tg.MainButton.setParams({
        color: tg.themeParams.button_color,
      });
    }
  }, [phone, email, name, focusedInputs]);

  useEffect(() => {
    if (!tg) return;

    tg.MainButton.setParams({
      text: 'Заполнить данные',
    });
  }, [tg]);

  useEffect(() => {
    if (!tg) return;

    // @ts-ignore
    tg.onEvent('mainButtonClicked', onSendData);
    return () => {
      // @ts-ignore
      tg.offEvent('mainButtonClicked', onSendData);
    };
  }, [onSendData]);

  return (
    <Grid minHeight={'80vh'} align='center' justify={'center'}>
      <Box m='4' pt='4'>
        <Card
          size='3'
          style={{
            contain: 'unset',
            overflow: 'unset',
          }}
        >
          <Heading size='3'>Заполните ваши данные</Heading>
          <Flex mt='4' direction='column' gap='2'>
            <TextField.Root
              onBlur={(e) => setFocusedInputs(['name', ...focusedInputs])}
              size='3'
              placeholder='Введите имя'
              onChange={(e) => setName(e.target.value)}
            ></TextField.Root>
            {focusedInputs.includes('name') &&
              formError?.name?._errors?.map((item) => (
                <Callout.Root variant='surface' size={'1'} color='red'>
                  <Callout.Icon>
                    <CrossCircledIcon />
                  </Callout.Icon>
                  <Callout.Text>{item}</Callout.Text>
                </Callout.Root>
              ))}
            <TextField.Root
              onBlur={(e) => setFocusedInputs(['phone', ...focusedInputs])}
              size='3'
              placeholder='Ваш телефон'
              onChange={(e) => setPhone(e.target.value)}
            />
            {focusedInputs.includes('phone') &&
              formError?.phone?._errors?.map((item) => (
                <Callout.Root variant='surface' size={'1'} color='red'>
                  <Callout.Icon>
                    <CrossCircledIcon />
                  </Callout.Icon>
                  <Callout.Text>{item}</Callout.Text>
                </Callout.Root>
              ))}
            <TextField.Root
              onBlur={(e) => setFocusedInputs(['email', ...focusedInputs])}
              size='3'
              placeholder='Ваш Email'
              type='email'
              onChange={(e) => setEmail(e.target.value)}
            />
            {focusedInputs.includes('email') &&
              formError?.email?._errors?.map((item) => (
                <Callout.Root variant='surface' size={'1'} color='red'>
                  <Callout.Icon>
                    <CrossCircledIcon />
                  </Callout.Icon>
                  <Callout.Text>{item}</Callout.Text>
                </Callout.Root>
              ))}
          </Flex>
        </Card>
      </Box>
    </Grid>
  );
}
