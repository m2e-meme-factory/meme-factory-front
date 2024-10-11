import { Flex, Heading } from '@radix-ui/themes';
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
import NothingFound from '../../shared/components/NothingFound';
import TransactionCard from './components/TransactionCard';

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
        <div className='swiper-no-swiping'>
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
        </div>
      </Flex>

      {currentTransactions.length === 0 && !isLoading ? (
        <NothingFound />
      ) : (
        <Flex direction='column' justify='center' gapY='2'>
          {currentTransactions.map((transaction) => (
            <TransactionCard
              key={transaction.id}
              type={transaction?.type}
              fromUser={transaction?.fromUser}
              toUser={transaction?.toUser}
              sum={transaction?.amount}
              projectId={transaction?.projectId}
              currentUser={user}
            />
          ))}
        </Flex>
      )}
    </Flex>
  );
};

export default TransactionsHistoryPage;
