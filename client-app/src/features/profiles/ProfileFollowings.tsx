import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Card, Grid, Header, TabPane } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import ProfileCard from './ProfileCard';

const ProfileFollowings = () => {
  const { profileStore } = useStore();

  useEffect(() => {
    profileStore.fetchFollowings('following');
  }, [profileStore]);
  return (
    <TabPane loading={profileStore.fetchFollowingsLoading}>
      <Grid>
        <Grid.Column width={16}>
          <Header
            floated='left'
            icon='user'
            content={`People following ${profileStore.profile?.displayName}`}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Card.Group itemsPerRow={4}>
            {profileStore.followings.map((profile) => (
              <ProfileCard key={profile.userName} profile={profile} />
            ))}
          </Card.Group>
        </Grid.Column>
      </Grid>
    </TabPane>
  );
};

export default observer(ProfileFollowings);
