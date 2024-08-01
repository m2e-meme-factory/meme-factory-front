import { Button, Flex, Heading } from '@radix-ui/themes';
import * as Form from '@radix-ui/react-form';
import * as Dialog from '@radix-ui/react-dialog';
import React from 'react';
import { Cross2Icon } from '@radix-ui/react-icons';
import TransactionCard from './components/TransactionCard';

const TransactionsHistoryPage = () => {
  return (
    <Flex m='4' direction='column'>
      <Flex align='center'>
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <Flex>
              <Heading mr='3'>Transactions</Heading>
              <Button variant='soft'>Filters</Button>
            </Flex>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className='DialogOverlay' />
            <Dialog.Content className='DialogContent'>
              <Dialog.Title className='DialogTitle'>Filters</Dialog.Title>
              <Form.Root className='FormRoot'>

                <Form.Field className='FormField' name='sender'>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Form.Label className='FormLabel'>Sender</Form.Label>
                  </div>
                  <Form.Control asChild>
                    <input className='Input' type='text' required />
                  </Form.Control>
                </Form.Field>

                <Form.Field className='FormField' name='receiver'>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Form.Label className='FormLabel'>Receiver</Form.Label>
                  </div>
                  <Form.Control asChild>
                    <input className='Input' type='text' required />
                  </Form.Control>
                </Form.Field>

                <Form.Field className='FormField' name='project-id'>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Form.Label className='FormLabel'>Project Id</Form.Label>
                  </div>
                  <Form.Control asChild>
                    <input className='Input' type='text' required />
                  </Form.Control>
                </Form.Field>

                <Form.Submit asChild>
                  <button className='Button' style={{ marginTop: 10 }}>
                    Find
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
      <Flex direction='column'>
        <TransactionCard sender='Some sender' receiver='Some receiver' projectId='312' value={26323} taskTitle='Create react app'></TransactionCard>
      </Flex>
    </Flex>)
}

export default TransactionsHistoryPage;