import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import AppSpinner from '../../app/layout/AppSpinner';
import { useStore } from '../../app/stores/store';
import ProfileContent from './ProfileContent';
import ProfileHeader from './ProfileHeader';

const ProfilePage = () => {
  const { profileStore } = useStore();
  const { username } = useParams<{ username: string }>();
  useEffect(() => {
    profileStore.loadProfile(username!);
  }, [profileStore, username]);

  if (!profileStore.profile && profileStore.profileLoading) {
    return <AppSpinner text='Profile loading' />;
  }
  return (
    <Grid>
      <Grid.Column width={16}>
        <ProfileHeader profile={profileStore.profile!} />
        <ProfileContent />
      </Grid.Column>
    </Grid>
  );
};

export default observer(ProfilePage);
