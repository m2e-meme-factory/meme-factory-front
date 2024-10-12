import {
  Card,
  Flex,
  IconButton,
  Text,
  Dialog,
  TextField,
  TextArea,
  Button,
} from '@radix-ui/themes';
import { RocketOutlined } from '@ant-design/icons';
import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import { Cross2Icon, Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';
import styles from './EditedTask.module.css';
import { TaskInfo, UpdateTaskDTO } from 'api';
import * as Form from '@radix-ui/react-form';

interface SubtaskCardProps {
  id: string;
  title: string;
  price: number;
  description: string;
  setSubtask: Dispatch<SetStateAction<UpdateTaskDTO[]>>;
  setTasksToDelete: Dispatch<SetStateAction<string[]>>;
}

const EditedSubtask: FC<SubtaskCardProps> = ({
  setTasksToDelete,
  title,
  price,
  id,
  setSubtask,
  description,
}) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const handleDelete = () => {
    setSubtask((prevSubtasks) => prevSubtasks.filter((subtask) => subtask.id !== id));
    setTasksToDelete((prevState) => [...prevState, id]);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const updatedSubtask: TaskInfo = {
      id: id,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
    };
    setSubtask((prevSubtasks) =>
      prevSubtasks.map((subtask) => (subtask.id === updatedSubtask.id ? updatedSubtask : subtask))
    );

    setModalOpen(false);
  };

  return (
    <Card className={styles.CreatedSubtask}>
      <Flex justify='between' align='center'>
        <Flex>
          <RocketOutlined style={{ color: 'yellow', marginRight: '15px' }} />
          <Flex direction='column'>
            <Text size='5' weight='medium'>
              {title}
            </Text>
            <Text weight='medium'>
              <Text color='yellow'>Price:</Text> {price}$
            </Text>
          </Flex>
        </Flex>
        <Flex>
          <Dialog.Root open={modalOpen}>
            <Dialog.Trigger>
              <IconButton mr='2' onClick={() => setModalOpen(true)}>
                <Pencil1Icon></Pencil1Icon>
              </IconButton>
            </Dialog.Trigger>

            <Dialog.Content maxWidth='450px'>
              <Flex justify='between' align='center'>
                <Dialog.Title>Edit Task</Dialog.Title>
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
                      <TextField.Root defaultValue={title} type='text' required />
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
                      <Form.Label className='FormLabel'>Description</Form.Label>
                      <Form.Message style={{ color: 'red', fontSize: '12px' }} match='valueMissing'>
                        Please enter a description
                      </Form.Message>
                    </div>
                    <Form.Control asChild>
                      <TextArea defaultValue={description} required />
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
                      <TextField.Root type='number' defaultValue={price} required />
                    </Form.Control>
                  </Form.Field>

                  <Form.Submit asChild>
                    <Form.Submit asChild>
                      <Button style={{ marginTop: 10 }}>Save changes</Button>
                    </Form.Submit>
                  </Form.Submit>
                </Flex>
              </Form.Root>
            </Dialog.Content>
          </Dialog.Root>

          <IconButton onClick={handleDelete}>
            <TrashIcon></TrashIcon>
          </IconButton>
        </Flex>
      </Flex>
    </Card>
  );
};

export default EditedSubtask;
