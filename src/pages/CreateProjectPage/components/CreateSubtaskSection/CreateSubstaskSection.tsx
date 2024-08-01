import { Flex, Heading, IconButton, Separator } from '@radix-ui/themes';
import { Cross2Icon, PlusIcon } from '@radix-ui/react-icons';
import React, { useState } from 'react';
import CreatedSubtask from '../Subtask/CreatedSubtask';
import { Subtask } from '../../../../@types/api';
import * as Dialog from '@radix-ui/react-dialog';
import * as Form from '@radix-ui/react-form';

const CreateSubtaskSection = () => {
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);

  return (
    <Flex mb='3' direction='column'>
      <Flex align='center' mt='3'>
        <Heading size='5' mr='3'>
          Subtasks Creation
        </Heading>

        <Dialog.Root>
          <Dialog.Trigger asChild>
            <IconButton size='1'>
              <PlusIcon />
            </IconButton>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className='DialogOverlay' />
            <Dialog.Content className='DialogContent'>
              <Dialog.Title className='DialogTitle Accent'>Create Subtask</Dialog.Title>
              <Form.Root className='FormRoot'>
                <Form.Field className='FormField' name='email'>
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
                    <input className='Input' type='text' required />
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
                    <textarea className='Textarea' required />
                  </Form.Control>
                </Form.Field>
                <Form.Submit asChild>
                  <button className='Button' style={{ marginTop: 10 }}>
                    Post question
                  </button>
                </Form.Submit>
              </Form.Root>
              <Dialog.Close asChild>
                <button className='IconButton' aria-label='Close'>
                  <Cross2Icon />
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </Flex>
      <Separator my='3' size='4' />
      <Flex direction='column'>
        {subtasks.length > 0 &&
          subtasks.map((subtask, index) => (
            <CreatedSubtask
              id={subtask.id}
              title={subtask.title}
              price={subtask.price}
              description={subtask.description}
            />
          ))}
        <CreatedSubtask id={1} title='Some title' price={2} description='lorem ipsum 132' />
      </Flex>
    </Flex>
  );
};

export default CreateSubtaskSection;
