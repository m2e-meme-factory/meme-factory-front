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
import formStyles from '../../CreateProjectPage/components/Subtask/form.module.css';

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
  const [isEditing, setIsEditing] = useState(false);

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
    setIsEditing(false);
  };

  return (
    <Card className={styles.CreatedSubtask}>
      {!isEditing ? (
        <Flex justify='between' align='center'>
          <Flex>
            <RocketOutlined style={{ color: 'yellow', marginRight: '17px' }} />
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
            <IconButton mr='2' onClick={() => setIsEditing(true)}>
              <Pencil1Icon></Pencil1Icon>
            </IconButton>

            <IconButton onClick={handleDelete}>
              <TrashIcon></TrashIcon>
            </IconButton>
          </Flex>
        </Flex>
      ) : (
        <Flex>
          <Form.Root className={formStyles.FormRoot} onSubmit={handleSubmit}>
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
                <input className={formStyles.Input} defaultValue={title} type='text' required />
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
                <textarea className={formStyles.Textarea} defaultValue={description} required />
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
                <input className={formStyles.Input} type='number' defaultValue={price} required />
              </Form.Control>
            </Form.Field>

            <Form.Submit asChild>
              <Button style={{ marginTop: 10, width: '100%' }}>Save changes</Button>
            </Form.Submit>
          </Form.Root>
        </Flex>
      )}
    </Card>
  );
};

export default EditedSubtask;
