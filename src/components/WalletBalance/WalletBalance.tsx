import React, { useEffect, useState } from 'react';
import { Text } from '@mantine/core';
import { useAccount, useBalance } from 'wagmi';

const WalletBalance = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const account = useAccount({
    onConnect({ address, connector, isReconnected }) {
      console.log('Connected');
    },
  });

  // DATA: Wallet Balance
  const { data, isLoading, isError } = useBalance({
    address: account.address,
    token: '0x1Ff1e80bBE4bb7c3AE68084D971B4174A52eaCAa',
  });

  const balanceInteger = data?.formatted?.split('.')[0] || '0';

  const balanceInfo = isError ? (
    'Error checking balance'
  ) : isLoading ? (
    'Loading balance...'
  ) : (
    <>
      Balance: {balanceInteger} {data?.symbol}
    </>
  );

  return <>{isClient && <Text mt={10}>{balanceInfo}</Text>}</>;
};

export default WalletBalance;
