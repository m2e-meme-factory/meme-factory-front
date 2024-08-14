import { Flex, IconButton, ScrollArea, Table, Dialog, Button, Text } from '@radix-ui/themes';
import React from 'react';
import { CheckIcon, Cross2Icon } from '@radix-ui/react-icons';

const LONG_MESSAGE =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis consequat nisi id ex rhoncus, venenatis dignissim nisl egestas. Suspendisse eget magna sodales, tincidunt risus id, varius sem. Integer lorem mauris, pretium vitae nisl et, pharetra placerat tellus. Suspendisse vel lectus gravida, tincidunt sem ut, vulputate mauris. Suspendisse pellentesque justo non erat rutrum, vitae placerat tortor ultricies. In sit amet rhoncus turpis. Suspendisse vestibulum urna et condimentum mollis. Nullam fringilla, tortor nec sodales volutpat, massa ipsum porttitor nisl, ut tristique enim purus ut elit. Proin sollicitudin augue velit, vitae lobortis eros sodales id.';

const PendingApplications = () => {
  return (
    <ScrollArea type='always' scrollbars='vertical' style={{ height: 'fit-content' }}>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Username</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Message</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row>
            <Table.Cell>
              <Flex mt='2'>
                <Text>Danilo Sousa</Text>
              </Flex>
            </Table.Cell>
            <Table.Cell>
              <Dialog.Root>
                <Dialog.Trigger>
                  <Button mt='2' variant='ghost'>
                    Read message
                  </Button>
                </Dialog.Trigger>

                <Dialog.Content maxWidth='450px'>
                  <Dialog.Title>Application message</Dialog.Title>

                  <Flex direction='column' gap='3'>
                    <ScrollArea type='always' scrollbars='vertical'>
                      <Text>{LONG_MESSAGE}</Text>
                    </ScrollArea>
                  </Flex>

                  <Flex gap='3' mt='4' justify='end'>
                    <Dialog.Close>
                      <Button variant='soft' color='yellow'>
                        Close
                      </Button>
                    </Dialog.Close>
                  </Flex>
                </Dialog.Content>
              </Dialog.Root>
            </Table.Cell>
            <Table.Cell>
              <Flex>
                <IconButton mb='2'>
                  <CheckIcon />
                </IconButton>
                <IconButton mb='2' ml='2'>
                  <Cross2Icon />
                </IconButton>
              </Flex>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
    </ScrollArea>
  );
};

export default PendingApplications;
