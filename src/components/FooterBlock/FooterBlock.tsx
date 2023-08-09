import React from 'react';
import {
  createStyles,
  Flex,
  Text,
  Group,
  ActionIcon,
  rem,
  Footer,
} from '@mantine/core';

// Tabler icons
import {
  IconBrandTwitterFilled,
  IconBrandGithubFilled,
} from '@tabler/icons-react';

const useStyles = createStyles((theme) => ({
  footer: {
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
  },
}));

const FooterBlock = () => {
  const { classes } = useStyles();

  return (
    <Footer height={50} px={15} className={classes.footer}>
      <Flex
        mih={50}
        gap='lg'
        justify='space-between'
        align='center'
        direction='row'
        wrap='nowrap'
      >
        <Text size={10}>
          Disclaimer: BEINCRYPTO will never endorse or encourage that you invest
          <br />
          in any of the projects listed and therefore.
        </Text>

        <Group spacing='xs' position='right' noWrap>
          <ActionIcon
            size='lg'
            variant='default'
            radius='xl'
            component='a'
            target='blank'
            href='https://github.com/0x1x3x/'
          >
            <IconBrandGithubFilled size='1.2rem' stroke={1.5} />
          </ActionIcon>
          <ActionIcon
            size='lg'
            variant='default'
            radius='xl'
            component='a'
            target='blank'
            href='https://twitter.com/0x1x3x'
          >
            <IconBrandTwitterFilled size='1.2rem' stroke={1.5} />
          </ActionIcon>
        </Group>
      </Flex>
    </Footer>
  );
};

export default FooterBlock;
