import React, { FC, useState } from 'react';
import * as Form from '@radix-ui/react-form';
import * as Dialog from '@radix-ui/react-dialog';
import './index.css';
import { ProjectProgress } from '../../../../shared/consts/unresolved';
import { showErrorMessage } from '../../../../shared/utils/helpers/notify';
import { useApplyTaskCompletion } from '../../../../shared/utils/api/hooks/task/useApplyTaskCompletion';

interface ModalSubtaskFormProps {
  closeDialog: () => void;
  progress: ProjectProgress | undefined;
  taskId: string;
}

const ModalSubtaskForm: FC<ModalSubtaskFormProps> = ({ closeDialog, progress, taskId }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState<string>();
  const applyTaskCompletionMutation = useApplyTaskCompletion();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    //todo: выяснить про hourPrice и hoursEstimated
    // const hourPrice = parseFloat(formData.get('hour-price') as string);
    // const hoursEstimated = parseFloat(formData.get('hours-estimated') as string);
    const coverLetter = formData.get('cover-letter') as string;

    setCoverLetter(coverLetter);
    setIsDialogOpen(true);
  };

  const handleConfirm = () => {
    if (coverLetter) {
      applyTaskCompletionMutation.mutate({ params: { taskId: taskId, message: coverLetter } });
      setIsDialogOpen(false);
      closeDialog();
    } else {
      showErrorMessage('Something went wrong!');
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      <Form.Root className='FormRoot' onSubmit={handleSubmit}>
        <Form.Field className='FormField' name='cover-letter'>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <Form.Label className='FormLabel'>Cover Letter</Form.Label>
          </div>
          <Form.Control asChild>
            <textarea className='Textarea' required />
          </Form.Control>
          <Form.Message className='FormMessage' match='valueMissing'>
            Please enter a cover letter
          </Form.Message>
          <Form.Message className='FormMessage' match={(value) => value.length <= 10}>
            Cover letter must be more than 10 characters
          </Form.Message>
        </Form.Field>
        <Form.Submit asChild>
          <button className='Button' style={{ marginTop: 10 }}>
            Submit
          </button>
        </Form.Submit>
      </Form.Root>

      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog.Overlay className='DialogOverlay' />
        <Dialog.Content className='DialogContent'>
          <Dialog.Title className='DialogTitle'>Are you sure?</Dialog.Title>
          <Dialog.Description className='DialogDescription'>
            Do you really want to submit the form?
          </Dialog.Description>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button className='Button' onClick={handleConfirm}>
              Yes
            </button>
            <button className='Button' onClick={handleCancel}>
              No
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
};

export default ModalSubtaskForm;
