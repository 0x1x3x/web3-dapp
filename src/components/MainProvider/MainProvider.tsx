import { Grid, Box } from '@mantine/core';

// Styles
import useStyles from './MainProvider.styles';

// Components
import MintingDapp from '../MintingDapp/MintingDapp';

// Wagmi
import { WagmiConfig, createConfig, configureChains } from 'wagmi';
import { polygonMumbai } from 'wagmi/chains';

// Wallets
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

// Providers
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

// ConnectKit
import { ConnectKitProvider, ConnectKitButton } from 'connectkit';

// Config
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [polygonMumbai],
  [
    alchemyProvider({ apiKey: 'Fmy838YXsK_O-6z8ahbh3Y6YcMzuyxZo' }),
    publicProvider(),
  ]
);
const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'wagmi',
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: 'aa1fb3bdc714613ebacdda4a60dc4a46',
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
});

// App
const MainProvider = () => {
  const { classes } = useStyles();

  return (
    <>
      <Box className={classes.wrapper}>
        <WagmiConfig config={config}>
          <ConnectKitProvider
            theme='auto'
            mode='light'
            customTheme={{
              '--ck-border-radius': 100,
            }}
          >
            <>
              <Grid justify='space-around' m={15}>
                <Grid.Col lg={4}>
                  <Box className={classes.boxBorder}>
                    <MintingDapp />
                    <ConnectKitButton />
                  </Box>
                </Grid.Col>
              </Grid>
            </>
          </ConnectKitProvider>
        </WagmiConfig>
      </Box>
    </>
  );
};

export default MainProvider;
