import { Form, Formik } from 'formik';
import { Button } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import AppTextInput from '../formik/AppTextInput';

const LoginForm = () => {
  const { authStore } = useStore();

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      onSubmit={(values, { setSubmitting }) => {
        authStore.login(values);
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
