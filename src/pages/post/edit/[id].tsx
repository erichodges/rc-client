import { withUrqlClient } from 'next-urql';
import React from 'react';
import { createUrqlClient } from 'src/utils/createUrqlClient';

const EditPost = ({}) => {
  return <div>working?</div>
};

export default withUrqlClient(createUrqlClient)(EditPost);