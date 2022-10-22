import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { Button, Container, Header, Image, Segment } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';

const Home = () => {
  const { authStore } = useStore();

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
            <>auth</>
          </>
        )}
      </Container>
    </Segment>
  );
};

export default observer(Home);
