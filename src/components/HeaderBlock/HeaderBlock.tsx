import React from 'react';

// Next
import Image from 'next/image';
import Link from 'next/link';

// Mantine UI
import { ColorSchemeToggle } from '../ColorSchemeToggle/ColorSchemeToggle';
import { Header, Flex } from '@mantine/core';

// Logo
import logo from 'public/logo.png';

const HeaderBlock = () => {
  return (
    <Header height={100} sx={{ borderBottom: 0 }} p={15}>
      <Flex
        mih={50}
        gap='lg'
        justify='space-between'
        align='center'
        direction='row'
        wrap='wrap'
      >
        <Link href='/'>
          <Image src={logo} height={40} width={40} alt='$TSTK Private Sale' />
        </Link>
        <Flex
          mih={50}
          gap='lg'
          justify='space-between'
          align='center'
          direction='row'
          wrap='nowrap'
        >
          <ColorSchemeToggle />
        </Flex>
      </Flex>
    </Header>
  );
};

export default HeaderBlock;
