import { cacheExchange, Resolver } from '@urql/exchange-graphcache';
import Router from 'next/router';
import {
  dedupExchange,
  Exchange,
  fetchExchange,
  stringifyVariables
} from 'urql';
import { pipe, tap } from 'wonka';
import {
  LoginMutation,
  LogoutMutation,
  RegisterMutation,
  UserDocument,
  UserQuery
} from '../generated/graphql';
import { betterUpdateQuery } from './betterUpdateQuery';

const errorExchange: Exchange = ({ forward }) => (ops$) => {
  return pipe(
    forward(ops$),
    tap(({ error }) => {
      if (error?.message.includes('not authenticated')) {
        Router.replace('/login');
      }
    })
  );
};

const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;
    const allFields = cache.inspectFields(entityKey);
    console.log('allFields: ', allFields);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }

    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    const isItInTheCache = cache.resolve(
      cache.resolveFieldByKey(entityKey, fieldKey) as string,
      'posts'
    );
    info.partial = !isItInTheCache;
    let hasMore = true;
    const results: string[] = [];
    fieldInfos.forEach((fi) => {
      const key = cache.resolveFieldByKey(entityKey, fi.fieldKey) as string;
      const data = cache.resolve(key, 'posts') as string[];
      const _hasMore = cache.resolve(key, 'hasMore');
      console.log('_hasMore: ', _hasMore);
      if (!_hasMore) {
        hasMore = _hasMore as boolean;
      }
      results.push(...data);
    });

    return {
      __typename: 'PaginatedPosts',
      hasMore,
      posts: results
    };
  };
};

export const createUrqlClient = (ssrExchange: any) => ({
  url: 'http://localhost:4444/graphql',
  fetchOptions: {
    credentials: 'include' as const
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      keys: {
        PaginatedPosts: () => null
      },
      resolvers: {
        Query: {
          posts: cursorPagination()
        }
      },
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
    errorExchange,
    ssrExchange,
    fetchExchange
  ]
});
