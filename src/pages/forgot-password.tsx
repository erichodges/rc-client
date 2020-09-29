import { Box, Button } from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
// import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { InputField } from 'src/components/inputField';
import { Wrapper } from 'src/components/Wrapper';
import { createUrqlClient } from 'src/utills/createUrqlClient';
// import { toErrorMap } from 'src/utills/toErrorMap';
// import login from './login';
import { useForgotPasswordMutation } from '../generated/graphql';

const ForgotPassword: React.FC<{}> = ({}) => {
  const [complete, setComplete] = useState(false);
  const [, forgotPassword] = useForgotPasswordMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: '' }}
        onSubmit={async (values) => {
          await forgotPassword(values);
          setComplete(true);
        }}
      >
        {({ isSubmitting }) =>
          complete ? (
            <Box>email sent!</Box>
          ) : (
            <Form>
              <InputField name="email" placeholder="email" label="email" />
              <Button
                type="submit"
                isLoading={isSubmitting}
                variantColor="teal"
                mt={4}
              >
                Forgot Password
              </Button>
            </Form>
          )
        }
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(ForgotPassword);
