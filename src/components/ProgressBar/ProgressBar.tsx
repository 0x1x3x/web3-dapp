import React from 'react';
import { Box, Flex, Progress, Text } from '@mantine/core';

interface ProgressBarProps {
  currentStageSoldAmount: bigint | null;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStageSoldAmount,
}) => {
  const soldAmountValue =
    currentStageSoldAmount !== null ? currentStageSoldAmount.toString() : '0';
  const remainAmountValue =
    currentStageSoldAmount !== null
      ? (1000000n - currentStageSoldAmount).toString()
      : '1000000';
  const progressBarValue = Math.round(+soldAmountValue / 10000);

  return (
    <Box>
      <Progress color='lime' value={progressBarValue} animate mt={40} />
      <Flex justify='space-between' align='center' mt={10}>
        <Text size='sm'>{soldAmountValue}</Text>
        <Text size='sm'>{remainAmountValue}</Text>
      </Flex>
    </Box>
  );
};

export default ProgressBar;
