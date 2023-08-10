import React, { useEffect, useState } from 'react';
import {
  Anchor,
  Box,
  Text,
  NumberInput,
  Button,
  useMantineTheme,
} from '@mantine/core';
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useContractRead,
} from 'wagmi';

// Contract ABI and ethers
import { contractAbi } from '../../../abi/contractAbi';
import { ethers } from 'ethers';

// Components
import PresaleInfo from '../PresaleInfo/PresaleInfo';
import ProgressBar from '../ProgressBar/ProgressBar';
import MaticPrice from '../MaticPrice/MaticPrice';
import WalletBalance from '../WalletBalance/WalletBalance';

// App
const MintingDapp = () => {
  // Theme
  const theme = useMantineTheme();
  const isDarkMode = theme.colorScheme === 'dark';

  const maxTextColor = isDarkMode ? '#D8FD4E' : '#3B60F6';

  // useState
  const [value, setValue] = useState<number | ''>(0);
  const [inputError, setInputError] = useState<string | null>(null);

  // Important
  const myAccountAddress = '0xcaf49c36fe2be05b85045fd1f273580e14bbcd6c';

  const contractAddress = '0x20e33dFbCD41000C88A086397B840312aaf4D523'; // !! Important: contract address
  const qty = BigInt(value) * BigInt(10 ** 18); // !! Important: compiling qty into 18decimels

  // DATA: Current Stage Data
  const [currentStage, setCurrentStage] = useState<bigint | null>(null);
  const { data: currentStageData, error: stageDataError } = useContractRead({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'currentStage',
  });
  useEffect(() => {
    if (currentStageData !== undefined) {
      const stage = BigInt(currentStageData.toString());
      setCurrentStage(stage);
    }
  }, [currentStageData, stageDataError]);
  if (stageDataError) {
    console.error('Error fetching currentStageData', stageDataError);
  }
  console.log('Current stage:', currentStage);

  // DATA: Current Price Data
  const [currentPrice, setCurrentPrice] = useState<bigint | null>(null);
  const { data: currentPriceData, error: priceDataError } = useContractRead({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'currentStagePrice',
  });
  useEffect(() => {
    if (currentPriceData !== undefined) {
      const price = BigInt(currentPriceData.toString());
      setCurrentPrice(price);
    }
  }, [currentPriceData, priceDataError]);
  if (priceDataError) {
    console.error('Error fetching currentPriceData', priceDataError);
  }
  console.log('Current price:', currentPrice);

  // DATA: Current Stage Sold Amount
  const [currentStageSoldAmount, setCurrentStageSoldAmount] = useState<
    bigint | null
  >(null);
  const { data: currentStageSoldAmountData, error: soldAmountError } =
    useContractRead({
      address: contractAddress,
      abi: contractAbi,
      functionName: 'currentStageSoldAmount',
      args: [myAccountAddress],
    });
  useEffect(() => {
    if (currentStageSoldAmountData !== undefined && !soldAmountError) {
      const soldAmount = ethers.BigNumber.from(
        currentStageSoldAmountData.toString()
      );
      setCurrentStageSoldAmount(soldAmount.toBigInt() / BigInt(10 ** 18));
    }
  }, [currentStageSoldAmountData, soldAmountError]);
  if (soldAmountError) {
    console.error('Error fetching currentStageSoldAmount', soldAmountError);
  }
  console.log('Current sold amount:', currentStageSoldAmount);

  // DATA: Current Stage Block Start
  const [currentStageBlockStart, setStageBlockStart] = useState<bigint | null>(
    null
  );
  const { data: currentStageBlockStartData, error: blockStartError } =
    useContractRead({
      address: contractAddress,
      abi: contractAbi,
      functionName: 'currentStageBlockStart',
    });
  useEffect(() => {
    if (currentStageBlockStartData !== undefined) {
      const stageStart = BigInt(currentStageBlockStartData.toString());
      setStageBlockStart(stageStart);
    }
  }, [currentStageBlockStartData, blockStartError]);
  if (blockStartError) {
    console.error('Error fetching currentStageBlockStart', blockStartError);
  }
  console.log('Current stage block start:', currentStageBlockStart);

  // CALC: PayableAmount
  const payableAmountInWei = currentPrice ? currentPrice * qty : BigInt(0);
  const payableAmount = payableAmountInWei / BigInt(1e18);
  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'tokenSale',
    args: [qty],
    value: payableAmount,
  });

  // WRITE: Write Contract
  const { data, error, isError, write } = useContractWrite(config);
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  // HANDLE: Input
  const handleValueChange = (newValue: number | '') => {
    setValue(newValue);
    setInputError(null);
  };

  const handleMaxClick = () => {
    setValue(10000);
    setInputError(null);
  };

  const formattedPayableAmount = Number(payableAmount.toString()) / 1e18;
  const displayAmount = formattedPayableAmount.toFixed(5);

  return (
    <>
      <Box>
        <PresaleInfo
          currentStageBlockStart={currentStageBlockStart}
          currentStage={currentStage}
        />
        <ProgressBar currentStageSoldAmount={currentStageSoldAmount} />
        <MaticPrice currentPrice={currentPrice} />
        <NumberInput
          value={value}
          onChange={handleValueChange}
          min={1}
          max={10000}
          placeholder='0'
          label='AMOUNT'
          hideControls
          withAsterisk
          radius='md'
          size='md'
          fw={700}
          mt={30}
          mb={5}
          rightSection={
            <Button
              mr={20}
              size='md'
              variant='link'
              onClick={handleMaxClick}
              c={maxTextColor}
            >
              MAX
            </Button>
          }
        />
        <Text size='xs'>* min 1 max 10000 per wallet</Text>

        {currentPrice !== null && (
          <Text size='md' mt={10}>
            Total amount: {displayAmount} MATIC + gas
          </Text>
        )}

        <WalletBalance />

        <Button
          color='lime'
          radius='xl'
          uppercase
          disabled={!write || isLoading}
          onClick={() => write?.()}
          my={15}
        >
          {isLoading ? 'Minting...' : 'Mint'}
        </Button>
        {isSuccess && (
          <Text size='sm'>
            🎉 Tokens minted!
            <Text size='xs' mb={10}>
              <Anchor
                href={`https://mumbai.polygonscan.com/tx/${data?.hash}`}
                target='_blank'
              >
                Check on Polygonscan
              </Anchor>
            </Text>
          </Text>
        )}

        {(isPrepareError || isError) && (
          <Text
            size='xs'
            mb={15}
            style={{
              wordBreak: 'break-all',
              maxWidth: '100%',
              marginBottom: '15px',
            }}
          >
            Error: {(prepareError || error)?.message}
          </Text>
        )}
      </Box>
    </>
  );
};

export default MintingDapp;
