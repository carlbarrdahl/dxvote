import {
  HashRouter,
  Route,
  Switch,
  useHistory,
  Redirect,
} from 'react-router-dom';
import { EtherSWRConfig } from 'ether-swr';
import { ThemeProvider } from 'styled-components';

import { Container } from './components/Guilds/common/Layout';
import Header from './components/Guilds/Header';
import GuildsPage from './pages/Guilds/Guilds';
import ProposalPage from './pages/Guilds/Proposal';
import CreateProposalPage from 'pages/Guilds/CreateProposal';
import GlobalStyle from './theme/GlobalTheme';
import theme from './theme/light.json';
import { GuildsContextProvider, TransactionsProvider } from 'contexts/Guilds';
import WalletWeb3Manager from './components/Guilds/Web3Manager/WalletWeb3Manager';
import GlobalErrorBoundary from './components/Guilds/ErrorBoundary/GlobalErrorBoundary';
import useJsonRpcProvider from 'hooks/Guilds/web3/useJsonRpcProvider';
import ERC20GuildContract from 'contracts/ERC20Guild.json';

import ProposalTypes from 'components/Guilds/ProposalTypes';
import { ProposalTypesConfig } from 'configs/proposalTypes';

import ToastNotificationContainer from './components/Guilds/ToastNotifications/ToastNotificationContainer';
import loggerMiddleware from './hooks/Guilds/ether-swr/middleware/logger';

const GuildsApp = () => {
  const history = useHistory();

  const isTestingEnv = !window.location?.hostname?.startsWith('dxvote.eth');
  const provider = useJsonRpcProvider();

  if (!isTestingEnv) {
    history.push('/');
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <HashRouter basename="/guilds">
        <GlobalErrorBoundary>
          <WalletWeb3Manager>
            <TransactionsProvider>
              <GuildsContextProvider>
                <GlobalStyle />
                <Header />
                <Container>
                  <Switch>
                    <Redirect
                      exact
                      from="/"
                      to="/rinkeby/0x9cdc16b5f95229b856cba5f38095fd8e00f8edef"
                    />
                    <Redirect
                      exact
                      from="/:chain_name"
                      to="/:chain_name/0x9cdc16b5f95229b856cba5f38095fd8e00f8edef"
                    />
                    <Route exact path="/:chain_name/:guild_id">
                      <EtherSWRConfig
                        value={{
                          web3Provider: provider,
                          ABIs: new Map([
                            [
                              // we can move this probably to a hook to reduce repeat ourselves in each route.
                              '0x9cdc16b5f95229b856cba5f38095fd8e00f8edef',
                              ERC20GuildContract.abi,
                            ],
                          ]),
                          refreshInterval: 30000,
                          use: [loggerMiddleware],
                        }}
                      >
                        <GuildsPage />
                      </EtherSWRConfig>
                    </Route>
                    <Route exact path="/:chain_name/:guild_id/proposalType">
                      <EtherSWRConfig
                        value={{
                          web3Provider: provider,
                          ABIs: new Map([
                            [
                              // we can move this probably to a hook to reduce repeat ourselves in each route.
                              '0x9cdc16b5f95229b856cba5f38095fd8e00f8edef',
                              ERC20GuildContract.abi,
                            ],
                          ]),
                          refreshInterval: 30000,
                        }}
                      >
                        <ProposalTypes data={ProposalTypesConfig} />
                      </EtherSWRConfig>
                    </Route>
                    <Route path="/:chain_name/:guild_id/proposal/:proposal_id">
                      <EtherSWRConfig
                        value={{
                          web3Provider: provider,
                          ABIs: new Map([
                            [
                              '0x9cdc16b5f95229b856cba5f38095fd8e00f8edef',
                              ERC20GuildContract.abi,
                            ],
                          ]),
                          refreshInterval: 0,
                          use: [loggerMiddleware],
                        }}
                      >
                        {' '}
                        <ProposalPage />
                      </EtherSWRConfig>
                    </Route>
                    <Route path="/:chain_name/:guild_id/create/:proposal_type">
                      <CreateProposalPage />
                    </Route>
                  </Switch>
                </Container>
              </GuildsContextProvider>
            </TransactionsProvider>
          </WalletWeb3Manager>
        </GlobalErrorBoundary>
      </HashRouter>

      <ToastNotificationContainer autoClose={10000} limit={4} />
    </ThemeProvider>
  );
};

export default GuildsApp;
