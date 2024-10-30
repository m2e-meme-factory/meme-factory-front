import { Flex, Heading, IconButton, Separator, Button, Card } from '@radix-ui/themes';
import { PlusIcon } from '@radix-ui/react-icons';
import React, { Dispatch, FC, SetStateAction, useRef, useState } from 'react';
import { TaskInfo, UpdateTaskDTO } from 'api';
import * as Form from '@radix-ui/react-form';
import { v4 as uuidv4 } from 'uuid';
import formStyles from '../../CreateProjectPage/components/Subtask/form.module.css';
import EditedSubtaskV2 from './EditedSubtaskV2';

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
    formRef.current?.click();
  };

  return (
    <Flex mb='3' mt='4' direction='column'>
      <Flex align='center' mt='3'>
        <Heading size='5' mr='3'>
          Tasks Creation
        </Heading>

        <IconButton size='1' onClick={() => setModalOpen(true)}>
          <PlusIcon />
        </IconButton>
      </Flex>
      <Separator my='3' size='4' />
      <Flex direction='column'>
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
          subtasks.map(
            (subtask) =>
              subtask.id && (
                <EditedSubtaskV2
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
