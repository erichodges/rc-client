import { ColorModeProvider, CSSReset, ThemeProvider } from '@chakra-ui/core';
import { Cache, cacheExchange, QueryInput } from '@urql/exchange-graphcache';
import { createClient, dedupExchange, fetchExchange, Provider } from 'urql';
import {
  LoginMutation,
  LogoutMutation,
  RegisterMutation,
  UserDocument,
  UserQuery
} from '../generated/graphql';
import theme from '../theme';

function betterUpdateQuery<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: Result, q: Query) => Query
) {
  return cache.updateQuery(qi, (data) => fn(result, data as any) as any);
}

const client = createClient({
  url: 'http://localhost:4444/graphql',
  fetchOptions: {
    credentials: 'include'
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          logout: (_result, _args, cache, _info) => {
            betterUpdateQuery<LogoutMutation, UserQuery>(
              cache,
              { query: UserDocument },
              _result,
              () => ({ user: null })
            );
          },
          login: (_result, _args, cache, _info) => {
            betterUpdateQuery<LoginMutation, UserQuery>(
              cache,
              { query: UserDocument },
              _result,
              (result, query) => {
                if (result.login.errors) {
                  return query;
                } else {
                  return {
                    user: result.login.user
                  };
                }
              }
            );
          },
          register: (_result, _args, cache, _info) => {
            betterUpdateQuery<RegisterMutation, UserQuery>(
              cache,
              { query: UserDocument },
              _result,
              (result, query) => {
                if (result.register.errors) {
                  return query;
                } else {
                  return {
                    user: result.register.user
                  };
                }
              }
            );
          }
        }
      }
    }),
    fetchExchange
  ]
});

function MyApp({ Component, pageProps }: any) {
  return (
    <Provider value={client}>
      <ThemeProvider theme={theme}>
        <ColorModeProvider>
          <CSSReset />
          <Component {...pageProps} />
        </ColorModeProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default MyApp;
