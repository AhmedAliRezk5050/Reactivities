import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import {
  Button,
  Container,
  Divider,
  Header,
  Image,
  Segment,
} from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import RegisterForm from '../users/RegisterForm';
import LoginForm from '../users/LoginForm';

const Home = () => {
  const { authStore, modalStore } = useStore();

  return (
    <Segment inverted textAlign='center' vertical className='masthead'>
      <Container text>
        <Header as='h1' inverted>
          <Image
            size='massive'
            src='/assets/logo.png'
            alt='logo'
            style={{ marginBottom: '.75rem' }}
          />
          Reactivities
        </Header>
        <Header as='h2' inverted content='Welcome to Reactivities' />
        {authStore.authenticated ? (
          <Button as={Link} to='/activities' size='huge' inverted>
            Take me to the Activities
          </Button>
        ) : (
          <>
            <Button
              onClick={() => modalStore.openModal(<LoginForm />)}
              size='huge'
              inverted
            >
              Login
            </Button>
            <Button
              onClick={() => modalStore.openModal(<RegisterForm />)}
              size='huge'
              inverted
            >
              Register
            </Button>
            <Divider horizontal inverted>
              Or
            </Divider>
            <Button
              size='huge'
              inverted
              content='Login with Facebook'
              onClick={authStore.facebookLogin}
              loading={authStore.authLoading}
            ></Button>
          </>
        )}
      </Container>
    </Segment>
  );
};

export default observer(Home);
