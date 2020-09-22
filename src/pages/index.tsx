import { withUrqlClient } from 'next-urql';
import React from 'react';
import { NavBar } from '../components/NavBar';
import { createUrqlClient } from '../utills/createUrqlClient';

const Index = () => (
  <>
    <NavBar />
    <div>
      <h1>Yo world</h1>
    </div>
  </>
);

export default withUrqlClient(createUrqlClient)(Index);
