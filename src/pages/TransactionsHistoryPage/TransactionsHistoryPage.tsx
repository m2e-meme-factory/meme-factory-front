import { Button, Flex, Heading, ScrollArea, Table } from '@radix-ui/themes';
import React, { useEffect, useState } from 'react';
import { useGetTransactionsByUser } from '../../shared/utils/api/hooks/transactions/useGetTransactionsByUser';
import { useSelector } from 'react-redux';
import { RootState } from '../../shared/utils/redux/store';
import Loading from '../../shared/components/Loading';
import { Transaction } from 'api';
import { useNavigate } from 'react-router-dom';

const TransactionsHistoryPage = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const { data: txResponse, isLoading } = useGetTransactionsByUser({ userId: user?.id ?? '' });
  const [currentTransactions, setCurrentTransactions] = useState<Transaction[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (txResponse && txResponse.data.length > 0) {
      setCurrentTransactions(txResponse.data);
    }
  }, [txResponse]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Flex m='4' direction='column'>
      <Flex align='center'>
        <Heading>Transactions history</Heading>
      </Flex>
      <Flex direction='column'>
        <ScrollArea type='always' scrollbars='horizontal' style={{ height: 'fit-content' }}>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Tx Id</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>From</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>To</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Value</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {currentTransactions &&
                currentTransactions.map((transaction) => (
                  <Table.Row>
                    <Table.Cell>{transaction.id}</Table.Cell>
                    <Table.Cell>
                      {transaction.fromUser.username ?? '—'} ({transaction.fromUser.telegramId})
                    </Table.Cell>
                    <Table.Cell>
                      {transaction.toUser.username ?? '—'} ({transaction.toUser.telegramId})
                    </Table.Cell>
                    <Table.Cell>{transaction.amount}</Table.Cell>
                    <Table.Cell>
                      <Button
                        style={{ padding: '20px' }}
                        onClick={() =>
                          navigate(
                            `/projects/${transaction.projectId}/logs/${transaction.toUserId}`
                          )
                        }
                      >
                        To history
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table.Root>
        </ScrollArea>
      </Flex>
    </Flex>
  );
};

export default TransactionsHistoryPage;
