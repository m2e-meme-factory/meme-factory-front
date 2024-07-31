import React, { useState } from 'react';
import * as Form from '@radix-ui/react-form';
import * as Dialog from '@radix-ui/react-dialog';
import './index.css';

const ModalSubtaskForm = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsDialogOpen(true);
  };

  const handleConfirm = () => {
    setIsFormSubmitted(true);
    setIsDialogOpen(false);
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      <Form.Root className='FormRoot' onSubmit={handleSubmit}>
        <Form.Field className='FormField' name='hour-price'>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <Form.Label className='FormLabel'>Your Hourly Price</Form.Label>
            <Form.Message className='FormMessage' match='valueMissing'>
              Please provide a valid number
            </Form.Message>
            <Form.Message className='FormMessage' match='typeMismatch'>
              Please provide a valid number
            </Form.Message>
          </div>
          <Form.Control asChild>
            <input className='Input' placeholder='0' type='number' required />
          </Form.Control>
        </Form.Field>
        <Form.Field className='FormField' name='hours-estimated'>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <Form.Label className='FormLabel'>Estimated Hours</Form.Label>
            <Form.Message className='FormMessage' match='valueMissing'>
              Please enter a valid amount of hours
            </Form.Message>
            <Form.Message className='FormMessage' match='typeMismatch'>
              Please provide a valid number
            </Form.Message>
          </div>
          <Form.Control asChild>
            <input className='Input' placeholder='2' type='number' required />
          </Form.Control>
        </Form.Field>
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
