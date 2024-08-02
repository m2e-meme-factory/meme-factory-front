import { Button, Flex, Heading, Table } from '@radix-ui/themes';
import * as Form from '@radix-ui/react-form';
import * as Dialog from '@radix-ui/react-dialog';
import React from 'react';
import { Cross2Icon } from '@radix-ui/react-icons';

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
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Task</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>From</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>To</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Value</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            <Table.Row>
              <Table.Cell>
                Some big task title to check how cell size adjusts to text size
              </Table.Cell>
              <Table.Cell>Ilon Muskulistiy</Table.Cell>
              <Table.Cell>Kanye South</Table.Cell>
              <Table.Cell>$39284</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </Flex>
    </Flex>
  );
};

export default TransactionsHistoryPage;
