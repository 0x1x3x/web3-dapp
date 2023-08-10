import React, { useState, useEffect } from 'react';
import { Title, Text, useMantineTheme } from '@mantine/core';
import { ethers } from 'ethers';

// Constants
const BLOCKS_IN_STAGE = 43200n;
const BLOCKS_IN_HOUR = 1800n;
const BLOCKS_IN_MINUTE = 30n;
const ALCHEMY_RPC =
  'https://polygon-mumbai.g.alchemy.com/v2/Fmy838YXsK_O-6z8ahbh3Y6YcMzuyxZo';

interface PresaleInfoProps {
  currentStageBlockStart: bigint | null;
  currentStage: bigint | null;
}

const convertBlocksToTime = (
  remainingBlocks: bigint
): { hours: number; minutes: number } => {
  const totalHours = Number(remainingBlocks / BLOCKS_IN_HOUR);
  const totalMinutes = Number(remainingBlocks / BLOCKS_IN_MINUTE);

  const hours = Math.floor(totalHours);
  const minutes = Math.floor(totalMinutes - hours * 60);

  return { hours, minutes };
};

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

  const currentStageBlockEnds = currentStageBlockStart
    ? currentStageBlockStart + BLOCKS_IN_STAGE
    : 0n;

  async function getCurrentBlock() {
    try {
      const provider = new ethers.providers.JsonRpcProvider(ALCHEMY_RPC);
      const blockNumber = await provider.getBlockNumber();
      return BigInt(blockNumber);
    } catch (error) {
      console.error('Error fetching current block:', error);
      return null;
    }
  }

  const fetchData = async () => {
    try {
      const currentBlock = await getCurrentBlock();
      const remaining = currentStageBlockEnds - (currentBlock || 0n);
      setRemainingBlocks(remaining);
      setIsDataReady(true);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const updateCounter = () => {
    setLastUpdate(Date.now());
  };

  useEffect(() => {
    fetchData();
    const updateInterval = setInterval(() => {
      fetchData();
      updateCounter();
    }, 5000);

    return () => {
      clearInterval(updateInterval);
    };
  }, [currentStageBlockStart]);

  useEffect(() => {
    if (currentStage) {
      setCurrentStageValue(currentStage);
    }
  }, [currentStage]);

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
        {remainingBlocks !== null && remainingBlocks >= 0n
          ? `${remainingHours.toString().padStart(2, '0')}:${remainingMinutes
              .toString()
              .padStart(2, '0')}`
          : 'Loading...'}
      </Title>
    </>
  );
};

export default PresaleInfo;

