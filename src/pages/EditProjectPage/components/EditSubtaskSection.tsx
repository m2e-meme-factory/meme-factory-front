import {
  Flex,
  Heading,
  IconButton,
  Separator,
  Button,
  TextField,
  TextArea,
  Dialog,
} from '@radix-ui/themes';
import { Cross2Icon, PlusIcon } from '@radix-ui/react-icons';
import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import { TaskInfo, UpdateTaskDTO } from 'api';
import * as Form from '@radix-ui/react-form';
import { v4 as uuidv4 } from 'uuid';
import EditedSubtask from './EditedSubtask';

interface CreateSubtaskSectionProps {
  subtasks: UpdateTaskDTO[];
  setSubtasks: Dispatch<SetStateAction<UpdateTaskDTO[]>>;
  setTasksToDelete: Dispatch<SetStateAction<string[]>>;
}

type FormData = {
  id: string;
  title: string;
  description: string;
  price: number;
};

const EditSubtaskSection: FC<CreateSubtaskSectionProps> = ({
  subtasks,
  setSubtasks,
  setTasksToDelete,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

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
  };

  return (
    <Flex mb='3' direction='column'>
      <Flex align='center' mt='3'>
        <Heading size='5' mr='3'>
          Tasks Creation
        </Heading>

        <Dialog.Root open={modalOpen}>
          <Dialog.Trigger>
            <IconButton size='1' onClick={() => setModalOpen(true)}>
              <PlusIcon />
            </IconButton>
          </Dialog.Trigger>
          <Dialog.Content>
            <Flex justify='between' align='center'>
              <Dialog.Title>Create Task</Dialog.Title>
              <Dialog.Close>
                <Button
                  mb='3'
                  onClick={() => setModalOpen(false)}
                  aria-label='Close'
                  variant='soft'
                >
                  <Cross2Icon />
                </Button>
              </Dialog.Close>
            </Flex>
            <Form.Root onSubmit={handleSubmit}>
              <Flex direction='column' gap='2'>
                <Form.Field name='title'>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Form.Label>Title</Form.Label>
                    <Form.Message style={{ color: 'red', fontSize: '12px' }} match='valueMissing'>
                      Please enter a title
                    </Form.Message>
                  </div>
                  <Form.Control asChild>
                    <TextField.Root maxLength={50} required />
                  </Form.Control>
                </Form.Field>

                <Form.Field name='description'>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Form.Label>Description</Form.Label>
                    <Form.Message style={{ color: 'red', fontSize: '12px' }} match='valueMissing'>
                      Please enter a description
                    </Form.Message>
                  </div>
                  <Form.Control asChild>
                    <TextArea required maxLength={200} />
                  </Form.Control>
                </Form.Field>

                <Form.Field name='price'>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Form.Label>Price</Form.Label>
                    <Form.Message style={{ color: 'red', fontSize: '12px' }} match='valueMissing'>
                      Please enter a price
                    </Form.Message>
                    <Form.Message style={{ color: 'red', fontSize: '12px' }} match='typeMismatch'>
                      Please enter a valid price
                    </Form.Message>
                  </div>
                  <Form.Control asChild>
                    <TextField.Root type='number' maxLength={50} required />
                  </Form.Control>
                </Form.Field>

                <Form.Submit asChild>
                  <Button style={{ marginTop: 10 }}>Create task</Button>
                </Form.Submit>
              </Flex>
            </Form.Root>
          </Dialog.Content>
        </Dialog.Root>
      </Flex>
      <Separator my='3' size='4' />
      <Flex direction='column'>
        {subtasks.length > 0 &&
          subtasks.map(
            (subtask) =>
              subtask.id && (
                <EditedSubtask
                  key={subtask.id}
                  setTasksToDelete={setTasksToDelete}
                  id={subtask.id}
                  setSubtask={setSubtasks}
                  title={subtask.title}
                  price={subtask.price}
                  description={subtask.description}
                />
              )
          )}
      </Flex>
    </Flex>
  );
};

export default EditSubtaskSection;
