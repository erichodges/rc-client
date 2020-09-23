import { withUrqlClient } from 'next-urql';
import React from 'react';
import { usePostsQuery } from 'src/generated/graphql';
import { NavBar } from '../components/NavBar';
import { createUrqlClient } from '../utills/createUrqlClient';

const Index = () => {
  const [{ data }] = usePostsQuery();

  return (
    <>
      <NavBar />
      <div>
        <h1>Yo world</h1>
        <br />
        {!data ? (
          <div>Loading...</div>
        ) : (
          data.posts.map((p) => <div key={p.id}>{p.title}</div>)
        )}
      </div>
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
