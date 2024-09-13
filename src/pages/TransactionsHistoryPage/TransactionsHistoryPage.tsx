import { Button, Flex, Heading, ScrollArea, Table } from '@radix-ui/themes';
import React, { useEffect, useState } from 'react';
import { useGetTransactionsByUser } from '../../shared/utils/api/hooks/transactions/useGetTransactionsByUser';
import { useSelector } from 'react-redux';
import { RootState } from '../../shared/utils/redux/store';
import Loading from '../../shared/components/Loading';
import { Transaction } from 'api';
import { useNavigate } from 'react-router-dom';
import Select, { MultiValue } from 'react-select';
import { CUSTOM_SELECT_STYLES_MULTI } from '../../styles/customSelectStyles';
import makeAnimated from 'react-select/animated';
import { TX_TYPE_OPTIONS } from '../../shared/consts/txTypesOptions';
import { Option } from '../../@types/app';

const TransactionsHistoryPage = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const { data: txResponse, isLoading } = useGetTransactionsByUser({ userId: user?.id ?? '' });
  const [currentTransactions, setCurrentTransactions] = useState<Transaction[]>([]);
  const [selectedTxTypes, setSelectedTxTypes] = useState<Option[]>([]);
  const navigate = useNavigate();
  const animatedComponents = makeAnimated();

  useEffect(() => {
    if (txResponse && txResponse.data.length > 0) {
      filterTransactions(txResponse.data);
    }
  }, [txResponse, selectedTxTypes]);

  const filterTransactions = (transactions: Transaction[]) => {
    if (selectedTxTypes.length === 0) {
      setCurrentTransactions(transactions);
    } else {
      const selectedTypes = selectedTxTypes.map((option) => option.value);
      const filteredTransactions = transactions.filter((transaction) =>
        selectedTypes.includes(transaction.type)
      );
      setCurrentTransactions(filteredTransactions);
    }
  };

  const handleApplicationStatusChange = (selectedStatus: MultiValue<Option>) => {
    setSelectedTxTypes(selectedStatus as Option[]);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Flex m='4' direction='column'>
      <Flex align='center'>
        <Heading>Transactions history</Heading>
      </Flex>
      <Flex mt='2' mb='4' direction='column'>
        <Heading size='2' mb='2'>
          Tx type
        </Heading>
        <Select
          isSearchable={false}
          onChange={handleApplicationStatusChange}
          placeholder='Select tx type'
          closeMenuOnSelect={false}
          components={animatedComponents}
          options={TX_TYPE_OPTIONS}
          styles={CUSTOM_SELECT_STYLES_MULTI}
          isMulti={true}
          isClearable={true}
        />
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
                <Table.ColumnHeaderCell>Type</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {currentTransactions &&
                currentTransactions.map((transaction) => (
                  <Table.Row key={transaction.id}>
                    <Table.Cell>{transaction.id}</Table.Cell>
                    <Table.Cell>
                      {transaction.type === 'SYSTEM'
                        ? 'platform'
                        : transaction.type === 'DEPOSIT'
                          ? ''
                          : (transaction.fromUser?.username ?? '—') +
                            ` (${transaction.fromUser?.telegramId ?? '—'})`}
                    </Table.Cell>
                    <Table.Cell>
                      {transaction.type === 'WITHDRAWAL'
                        ? ''
                        : (transaction.toUser?.username ?? '—') +
                          ` (${transaction.toUser?.telegramId ?? '—'})`}
                    </Table.Cell>
                    <Table.Cell>{transaction.amount}</Table.Cell>
                    <Table.Cell>{transaction.type.toLowerCase()}</Table.Cell>
                    <Table.Cell>
                      {transaction.type == 'PAYMENT' && (
                        <Button
                          style={{ padding: '20px' }}
                          onClick={() =>
                            navigate(
                              `/projects/${transaction.projectId}/logs/${transaction.toUserId}?fromTab=transactions`
                            )
                          }
                        >
                          To history
                        </Button>
                      )}
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
