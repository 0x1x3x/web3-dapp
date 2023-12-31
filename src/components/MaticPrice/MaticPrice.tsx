import React, { useState, useEffect } from 'react';
import { MediaQuery, Box, Text, Flex, rem } from '@mantine/core';
import { ethers } from 'ethers';

interface MaticPriceProps {
  currentPrice: bigint | null;
}

const MaticPrice: React.FC<MaticPriceProps> = ({ currentPrice }) => {
  const [tokenPrice, setTokenPrice] = useState<string>('0');

  const fetchTokenPrice = async () => {
    try {
      const tokenPriceInWei = BigInt(currentPrice ?? 0);
      const formattedPrice = currentPrice
        ? ethers.utils.formatUnits(tokenPriceInWei, 18)
        : '0';
      setTokenPrice(formattedPrice);
      console.log('Current price:', formattedPrice);
    } catch (error) {
      console.error('Error fetching token price:', error);
    }
  };

  useEffect(() => {
    fetchTokenPrice();
  }, [currentPrice]);

  return (
    <Box>
      <Flex justify='space-between' align='center' mt={10}>
        <MediaQuery
          query='(max-width: 62em) and (min-width: 36em)'
          styles={{ fontSize: rem(10) }}
        >
          <Text fw={700}>PRICE</Text>
        </MediaQuery>
        <Text fw={700}>1TSTK = {tokenPrice} MATIC</Text>
      </Flex>
    </Box>
  );
};

export default MaticPrice;

