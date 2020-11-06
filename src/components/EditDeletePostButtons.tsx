import { Box, IconButton, Link } from '@chakra-ui/core';
import NextLink from 'next/link';
import React from 'react';
import { useDeletePostMutation, useUserQuery } from "../generated/graphql";

interface EditDeletePostButtonsProps {
  id: number;
  creatorId: string;
}

export const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({
  id,
  creatorId
}) => {

  const [{ data: userData }] = useUserQuery();
  const [, deletePost ] = useDeletePostMutation();

  if (userData?.user?.id !== creatorId) {
    return null;
  }

    return (
      <Box>
        <NextLink href='/post/edit/[id]' as={`/post/edit/${id}`}>
          <IconButton as={Link} mr={4} icon='edit' aria-label='Edit Post' />
        </NextLink>
        <IconButton
          icon='delete'
          aria-label='Delete Post'
          onClick={() => {
            deletePost({ id });
          }}
        />
      </Box>
    );
}