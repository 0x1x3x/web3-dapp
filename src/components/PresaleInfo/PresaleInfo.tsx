import React, { useState, useEffect } from 'react';
import { Title, Text, useMantineTheme } from '@mantine/core';
import { ethers } from 'ethers';

interface PresaleInfoProps {
  currentStageBlockStart: bigint | null;
  currentStage: bigint | null;
}

const PresaleInfo: React.FC<PresaleInfoProps> = ({
  currentStageBlockStart,
  currentStage,
}) => {
  // Theme
  const theme = useMantineTheme();
  const isDarkMode = theme.colorScheme === 'dark';

  const presaleTextColor = isDarkMode ? '#D8FD4E' : '#3B60F6';

  // useState
  const [remainingBlocks, setRemainingBlocks] = useState<bigint | null>(null);
  const [currentStageValue, setCurrentStageValue] = useState<bigint | null>(
    null
  );
  const [isDataReady, setIsDataReady] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());

  // Rpc
  const AlchemyRpc =
    'https://polygon-mumbai.g.alchemy.com/v2/Fmy838YXsK_O-6z8ahbh3Y6YcMzuyxZo';

  // CALC: Blocks and time
  const blocksInStage = BigInt(43200); // Blocks in stage

  const currentStageBlockEnds =
    currentStageBlockStart !== null
      ? currentStageBlockStart + BigInt(blocksInStage)
      : 0n;

  async function getCurrentBlock() {
    try {
      const provider = new ethers.providers.JsonRpcProvider(AlchemyRpc);
      const blockNumber = await provider.getBlockNumber();
      console.log('current block:', blockNumber);
      return BigInt(blockNumber);
    } catch (error) {
      console.error('Error fetching current block:', error);
      return null;
    }
  }

  const fetchData = async () => {
    try {
      const stageStart = currentStageBlockStart ?? 0n;
      const currentBlock = await getCurrentBlock();
      const remainingBlocks =
        currentStageBlockEnds !== null && currentBlock !== null
          ? currentStageBlockEnds - currentBlock
          : 0n;

      setRemainingBlocks(remainingBlocks);
      setIsDataReady(true);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const updateCounter = () => {
    setLastUpdate(Date.now());
  };

  useEffect(() => {
    const updateInterval = setInterval(() => {
      fetchData();
      updateCounter();
    }, 1000);

    fetchData();

    return () => {
      clearInterval(updateInterval);
    };
  }, [currentStageBlockStart, currentStageBlockEnds]);

  useEffect(() => {
    if (currentStage !== null) {
      setCurrentStageValue(currentStage);
    }
  }, [currentStage]);

  const convertBlocksToTime = (
    remainingBlocks: bigint
  ): { hours: number; minutes: number } => {
    const blocksInHour = 1800n;
    const blocksInMinute = 30n;

    const totalHours = Number(remainingBlocks / blocksInHour);
    const totalMinutes = Number(remainingBlocks / blocksInMinute);

    const hours = Math.floor(totalHours);
    const minutes = Math.floor(totalMinutes - hours * 60);

    return { hours, minutes };
  };

  const { hours: remainingHours, minutes: remainingMinutes } =
    convertBlocksToTime(remainingBlocks ?? 0n);

  if (!isDataReady) {
    return <Text>Loading...</Text>;
  }

  return (
    <>
      <Title align='center' c={presaleTextColor} size='30'>
        PRESALE ENDING SOON!
      </Title>
      <Title align='center' mt={15} mb={5} size='27'>
        {currentStageValue !== null
          ? `STAGE ${currentStageValue.toString()} ENDS IN`
          : 'STAGE N/A'}
      </Title>
      <Title align='center' size='27'>
        {remainingBlocks !== null && remainingBlocks >= 0 ? (
          <>
            {remainingHours.toString().padStart(2, '0')}:
            {remainingMinutes.toString().padStart(2, '0')}
          </>
        ) : (
          'Loading...'
        )}
      </Title>
    </>
  );
};

export default PresaleInfo;
