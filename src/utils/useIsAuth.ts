import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useUserQuery } from '../generated/graphql';

export const useIsAuth = () => {
  const [{ data, fetching }] = useUserQuery();
  const router = useRouter();
  useEffect(() => {
    if (!fetching && !data?.user) {
      router.replace('/login?next=' + router.pathname);
    }
  }, [fetching, data, router]);
};
