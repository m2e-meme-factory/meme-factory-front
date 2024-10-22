import {
  Button,
  Flex,
  Heading,
  IconButton,
  Separator,
  TextArea,
  TextField,
  Dialog,
  Card,
} from '@radix-ui/themes';
import { Cross2Icon, PlusIcon } from '@radix-ui/react-icons';
import React, { Dispatch, FC, SetStateAction, useRef, useState } from 'react';
import CreatedSubtask from '../Subtask/CreatedSubtask';
import { TaskInfo } from 'api';
import * as Form from '@radix-ui/react-form';
import { v4 as uuidv4 } from 'uuid';
import CreatedSubtaskV2 from '../Subtask/CreatedSubtaskV2';
import formStyles from '../Subtask/form.module.css';

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
    <Flex mb='3' direction='column'>
      <Flex align='center' mt='3'>
        <Heading size='5' mr='3'>
          Tasks Creation
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
                <Form.Label className={formStyles.FormLabel}>Title</Form.Label>
                <Form.Message className={formStyles.FormMessage} match='valueMissing'>
                  Please enter a title
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
                <Form.Label className={formStyles.FormLabel}>Description</Form.Label>
                <Form.Message className={formStyles.FormMessage} match='valueMissing'>
                  Please enter a description
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
                <Form.Label className={formStyles.FormLabel}>Price</Form.Label>
                <Form.Message className={formStyles.FormMessage} match='valueMissing'>
                  Please enter a price
                </Form.Message>
                <Form.Message className={formStyles.FormMessage} match='typeMismatch'>
                  Please enter a valid price
                </Form.Message>
              </div>
              <Form.Control asChild>
                <input className={formStyles.Input} type='number' required />
              </Form.Control>
            </Form.Field>

            <Form.Submit asChild>
              <Button style={{ marginTop: 10, width: '100%' }}>Save changes</Button>
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
