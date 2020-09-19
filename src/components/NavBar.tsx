import { Box, Button, Flex, Link } from '@chakra-ui/core';
import NextLink from 'next/link';
import React from 'react';
import { useLogoutMutation, useUserQuery } from 'src/generated/graphql';
interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useUserQuery();
  let body = null;

  // data is loading
  if (fetching) {
    // user not logged in
  } else if (!data?.user) {
    body = (
      <>
        <Button fontSize="sm" mr={2} pt={1} variant="ghost">
          <NextLink href="/login">
            <Link _hover={{ textDecoration: 'none' }}>Login</Link>
          </NextLink>
        </Button>
      </>
    );
    // user logged in
  } else {
    body = (
      <Flex>
        <Box mr={2} fontSize="xl" mt={1}>
          {data.user.username}
        </Box>
        <Button
          onClick={() => {
            logout();
          }}
          isLoading={logoutFetching}
          fontSize="sm"
          variant="ghost"
        >
          logout
        </Button>
      </Flex>
    );
  }
  return (
    <Flex bg="grey" pr={4} pt={1} height="3rem">
      <Box ml="auto">{body}</Box>
    </Flex>
  );
};
