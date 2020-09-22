import { cacheExchange } from '@urql/exchange-graphcache';
import {
  LoginMutation,
  LogoutMutation,
  RegisterMutation,
  UserDocument,
  UserQuery
} from 'src/generated/graphql';
import { dedupExchange, fetchExchange } from 'urql';
import { betterUpdateQuery } from './betterUpdateQuery';

export const createUrqlClient = (ssrExchange: any) => ({
  url: 'http://localhost:4444/graphql',
  fetchOptions: {
    credentials: 'include' as const
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
    ssrExchange,
    fetchExchange
  ]
});
