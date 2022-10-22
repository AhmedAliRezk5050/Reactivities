import { Form, Formik } from 'formik';
import { Button, Header } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import AppTextInput from '../formik/AppTextInput';
import * as Yup from 'yup';
import { RegisterData } from '../../app/models/user';

const LoginForm = () => {
  const { authStore } = useStore();

  const formValidationSchema: Yup.SchemaOf<RegisterData> = Yup.object().shape({
    displayName: Yup.string().required(),
    userName: Yup.string().required(),
    email: Yup.string().required(),
    password: Yup.string().required(),
  });

  return (
    <Formik
      initialValues={{ email: '', password: '', userName: '', displayName: '' }}
      onSubmit={(values) => authStore.register(values)}
      validationSchema={formValidationSchema}
    >
      {({ touched, isValid, isSubmitting }) => (
        <Form className='ui form'>
          <Header as='h2' content='Register' textAlign='center' />
          <AppTextInput name='email' placeholder='Email' type='email' />
          <AppTextInput name='userName' placeholder='Username' type='text' />
          <AppTextInput
            name='displayName'
            placeholder='Display name'
            type='text'
          />
          <AppTextInput
            name='password'
            placeholder='Password'
            type='password'
          />
          <Button
            content='register'
            type='submit'
            fluid
            loading={isSubmitting}
            disabled={
              !isValid ||
              isSubmitting ||
              (Object.keys(touched).length === 0 &&
                touched.constructor === Object)
            }
          />
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
