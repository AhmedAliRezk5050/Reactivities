import { Form, Formik } from 'formik';
import { Button } from 'semantic-ui-react';
import AppTextInput from '../formik/AppTextInput';

const LoginForm = () => {
  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      onSubmit={(values, { setSubmitting }) => {
        console.log(values);
      }}
    >
      <Form className='ui form'>
        <AppTextInput name='email' placeholder='Email' type='email' />
        <AppTextInput name='password' placeholder='Password' type='password' />
        <Button content='login' type='submit' fluid />
      </Form>
    </Formik>
  );
};

export default LoginForm;
