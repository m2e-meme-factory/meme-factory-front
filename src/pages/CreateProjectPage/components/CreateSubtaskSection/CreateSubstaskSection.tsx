import React, { Dispatch, FC, SetStateAction, useRef, useState } from 'react';
import { Button, Flex, Heading, IconButton, Separator, Card } from '@radix-ui/themes';
import { PlusIcon } from '@radix-ui/react-icons';
import { TaskInfo } from 'api';
import * as Form from '@radix-ui/react-form';
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from 'react-i18next';

import CreatedSubtaskV2 from '../Subtask/CreatedSubtaskV2';
import formStyles from '../Subtask/form.module.css';

import { LOCAL_TEXT } from '@shared/consts';

interface CreateSubtaskSectionProps {
  subtasks: TaskInfo[];
  setSubtasks: Dispatch<SetStateAction<TaskInfo[]>>;
}

type FormData = {
  id: string;
  title: string;
  description: string;
  price: number;
};

const CreateSubtaskSection: FC<CreateSubtaskSectionProps> = ({ subtasks, setSubtasks }) => {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const uuidString = uuidv4();
    const data: FormData = {
      id: uuidString,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
    };

    setSubtasks((prevSubtasks) => [...prevSubtasks, data as TaskInfo]);
    setModalOpen(false);
    formRef.current?.reset();
  };

  return (
    <Flex mb='3' mt='4' direction='column'>
      <Flex align='center' mt='3'>
        <Heading size='5' mr='3'>
          {t(LOCAL_TEXT.TASKS_CREATION)}
        </Heading>

        <IconButton loading={modalOpen} size='1' onClick={() => setModalOpen(true)}>
          <PlusIcon />
        </IconButton>
      </Flex>
      <Separator my='3' size='4' />
      <Flex direction='column' gap='2'>
        <Card style={{ display: modalOpen ? 'block' : 'none' }}>
          <Form.Root ref={formRef} className={formStyles.FormRoot} onSubmit={handleSubmit}>
            <Form.Field className='FormField' name='title'>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                }}
              >
                <Form.Label className={formStyles.FormLabel}>{t(LOCAL_TEXT.TITLE)}</Form.Label>
                <Form.Message className={formStyles.FormMessage} match='valueMissing'>
                  {t(LOCAL_TEXT.PLEASE_ENTER_TITLE)}
                </Form.Message>
              </div>
              <Form.Control asChild>
                <input className={formStyles.Input} type='text' required />
              </Form.Control>
            </Form.Field>

            <Form.Field
              className={formStyles.FormField}
              style={{ marginTop: '15px' }}
              name='description'
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                }}
              >
                <Form.Label className={formStyles.FormLabel}>
                  {t(LOCAL_TEXT.DESCRIPTION)}
                </Form.Label>
                <Form.Message className={formStyles.FormMessage} match='valueMissing'>
                  {t(LOCAL_TEXT.PLEASE_ENTER_DESCRIPTION)}
                </Form.Message>
              </div>
              <Form.Control asChild>
                <textarea className={formStyles.Textarea} required />
              </Form.Control>
            </Form.Field>

            <Form.Field className={formStyles.FormField} name='price'>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                }}
              >
                <Form.Label className={formStyles.FormLabel}>{t(LOCAL_TEXT.PRICE)}</Form.Label>
                <Form.Message className={formStyles.FormMessage} match='valueMissing'>
                  {t(LOCAL_TEXT.PLEASE_ENTER_PRICE)}
                </Form.Message>
                <Form.Message className={formStyles.FormMessage} match='typeMismatch'>
                  {t(LOCAL_TEXT.PLEASE_ENTER_VALID_PRICE)}
                </Form.Message>
              </div>
              <Form.Control asChild>
                <input className={formStyles.Input} type='number' required />
              </Form.Control>
            </Form.Field>

            <Form.Submit asChild>
              <Button style={{ marginTop: 10, width: '100%' }}>{t(LOCAL_TEXT.SAVE_CHANGES)}</Button>
            </Form.Submit>
          </Form.Root>
        </Card>

        {subtasks.length > 0 &&
          subtasks.map((subtask) => (
            <CreatedSubtaskV2
              key={subtask.id}
              id={subtask.id}
              setSubtask={setSubtasks}
              title={subtask.title}
              price={subtask.price}
              description={subtask.description}
            />
          ))}
      </Flex>
    </Flex>
  );
};

export default CreateSubtaskSection;
