import { Box, Button, Flex, Link } from '@chakra-ui/core';
import NextLink from 'next/link';
import React from 'react';
import { useUserQuery } from 'src/generated/graphql';
interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ data, fetching }] = useUserQuery();
  let body = null;

  // data is loading
  if (fetching) {
    // user not logged in
  } else if (!data?.user) {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2}>Login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>Register</Link>
        </NextLink>
      </>
    );
    // user logged in
  } else {
    body = (
      <Flex>
        <Box mr={2}>{data.user.username}</Box>
        <Button variant="link">Logout</Button>
      </Flex>
    );
  }
  return (
    <Flex bg="grey" p={4}>
      <Box ml="auto">{body}</Box>
    </Flex>
  );
};
