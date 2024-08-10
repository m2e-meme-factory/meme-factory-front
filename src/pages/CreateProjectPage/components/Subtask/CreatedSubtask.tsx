import { Card, Flex, IconButton, Text, Dialog, Button, TextField } from '@radix-ui/themes';
import { RocketOutlined } from '@ant-design/icons';
import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';
import styles from './CreatedSubtask.module.css';
import { SubtaskInfo } from 'api';
import * as Form from '@radix-ui/react-form';

interface SubtaskCardProps {
  id: string;
  title: string;
  price: number;
  description: string;
  setSubtask: Dispatch<SetStateAction<SubtaskInfo[]>>;
}

const CreatedSubtask: FC<SubtaskCardProps> = ({ title, price, id, setSubtask, description }) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const handleDelete = () => {
    setSubtask((prevSubtasks) => prevSubtasks.filter((subtask) => subtask.id !== id));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const updatedSubtask: SubtaskInfo = {
      id: id,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
    };

    console.log(updatedSubtask)

    setSubtask(prevSubtasks =>
      prevSubtasks.map(subtask =>
        subtask.id === updatedSubtask.id ? updatedSubtask : subtask
      )
    );

    setModalOpen(false);
  }

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

            <Dialog.Content maxWidth="450px">
              <Dialog.Title>Edit subtask</Dialog.Title>
              <Dialog.Description size="2" mb="4">
                Make changes to subtask
              </Dialog.Description>

              <Form.Root className='FormRoot' onSubmit={handleSubmit}>

                <Form.Field className='FormField' name='title'>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Form.Label className='FormLabel'>Title</Form.Label>
                    <Form.Message className='FormMessage' match='valueMissing'>
                      Please enter a title
                    </Form.Message>
                  </div>
                  <Form.Control asChild>
                    <input className='Input' defaultValue={title} type='text' required />
                  </Form.Control>
                </Form.Field>

                <Form.Field className='FormField' name='description'>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Form.Label className='FormLabel'>Description</Form.Label>
                    <Form.Message className='FormMessage' match='valueMissing'>
                      Please enter a description
                    </Form.Message>
                  </div>
                  <Form.Control asChild>
                    <textarea className='Textarea' defaultValue={description} required />
                  </Form.Control>
                </Form.Field>

                <Form.Field className='FormField' name='price'>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Form.Label className='FormLabel'>Price</Form.Label>
                    <Form.Message className='FormMessage' match='valueMissing'>
                      Please enter a price
                    </Form.Message>
                    <Form.Message className='FormMessage' match='typeMismatch'>
                      Please enter a valid price
                    </Form.Message>
                  </div>
                  <Form.Control asChild>
                    <input className='Input' type='number' defaultValue={price} required />
                  </Form.Control>
                </Form.Field>

                <Form.Submit asChild>
                  <button className='Button' style={{ marginTop: 10 }}>
                    Save changes
                  </button>
                </Form.Submit>

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

export default CreatedSubtask;
