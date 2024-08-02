import { Flex, Heading, IconButton, Separator } from '@radix-ui/themes';
import { Cross2Icon, PlusIcon } from '@radix-ui/react-icons';
import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import CreatedSubtask from '../Subtask/CreatedSubtask';
import { Subtask } from '../../../../@types/api';
import * as Dialog from '@radix-ui/react-dialog';
import * as Form from '@radix-ui/react-form';
import { v4 as uuidv4 } from 'uuid';

interface CreateSubtaskSectionProps {
  subtasks: Subtask[];
  setSubtasks: Dispatch<SetStateAction<Subtask[]>>;
}

type FormData = {
  id: string;
  title: string;
  description: string;
  price: number;
};


const CreateSubtaskSection: FC<CreateSubtaskSectionProps> = ({subtasks, setSubtasks}) => {

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

    setSubtasks(prevSubtasks => [...prevSubtasks, data as Subtask]);
    setModalOpen(false);
    console.log(data);
  };


  return (
    <Flex mb='3' direction='column'>
      <Flex align='center' mt='3'>
        <Heading size='5' mr='3'>
          Subtasks Creation
        </Heading>

        <Dialog.Root open={modalOpen}>
          <Dialog.Trigger asChild>
            <IconButton size='1' onClick={() => setModalOpen(true)}>
              <PlusIcon />
            </IconButton>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className='DialogOverlay' />
            <Dialog.Content className='DialogContent'>
              <Dialog.Title className='DialogTitle Accent'>Create Subtask</Dialog.Title>
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
                    <input className='Input' type='number' required />
                  </Form.Control>
                </Form.Field>

                <Form.Submit asChild>
                  <button className='Button' style={{ marginTop: 10 }}>
                    Create subtask
                  </button>
                </Form.Submit>
              </Form.Root>
              <Dialog.Close asChild>
                <button className='IconButton' onClick={() => setModalOpen(false)} aria-label='Close'>
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
              setSubtask={setSubtasks}
              title={subtask.title}
              price={subtask.price}
            />
          ))}
      </Flex>
    </Flex>
  );
};

export default CreateSubtaskSection;
