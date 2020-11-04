import { Box, Heading } from '@chakra-ui/core';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import { Layout } from 'src/components/Layout';
import { usePostQuery } from 'src/generated/graphql';
import { createUrqlClient } from 'src/utils/createUrqlClient';

const Post = ({}) => {
  const router = useRouter();
  const intId =
    typeof router.query.id === 'string' ? parseInt(router.query.id) : -1;
    const [{ data, error, fetching }] = usePostQuery({
      pause: intId === -1,
      variables: {
        id: intId
      }
    });

    if (fetching) {
      return (
        <Layout>
          <div>Loading...</div>
        </Layout>
      );
    }

    if (error) {
      return <div>{error.message}</div>;
    }

    if (!data?.post) {
      return (
        <Layout>
          <Box>Could not find requested post</Box>
        </Layout>
      );
    };

    return (
      <Layout>
        <Heading mb={4}>{data.post.title}</Heading>
        {data.post.text}
      </Layout>
    );
};

export default withUrqlClient(createUrqlClient, {ssr: true})(Post);