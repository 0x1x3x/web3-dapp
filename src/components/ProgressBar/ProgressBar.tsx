import React, { useState, useEffect } from 'react';
import { Flex, Progress, Text } from '@mantine/core';

interface ProgressBarProps {
  currentStageSoldAmount: bigint | null;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStageSoldAmount,
}) => {
  const [soldAmount, setSoldAmount] = useState<bigint | null>(
    currentStageSoldAmount
  );

  // Updating soldAmount every second
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        setSoldAmount(currentStageSoldAmount);
        console.log('Sold now:', currentStageSoldAmount);
      } catch (error) {
        console.error('Error fetching sold amount:', error);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [currentStageSoldAmount]);

  const soldAmountValue = soldAmount !== null ? soldAmount.toString() : '0';

  const remainAmountValue =
    soldAmount !== null ? (1000000n - soldAmount).toString() : '1000000';

  const progressBarValue = Math.round(+soldAmountValue / 10000);
  return (
    <>
      <Progress color='lime' value={+progressBarValue} animate mt={40} />
      <Flex justify='space-between' align='center' mt={10}>
        <Text size='sm'>{soldAmountValue}</Text>
        <Text size='sm'>{remainAmountValue}</Text>
      </Flex>
    </>
  );
};

export default ProgressBar;
