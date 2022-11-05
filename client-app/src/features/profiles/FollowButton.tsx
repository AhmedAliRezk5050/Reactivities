import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import { Button, Reveal } from 'semantic-ui-react';
import { Profile } from '../../app/models/profile';
import { useStore } from '../../app/stores/store';

interface Props {
  profile: Profile;
}

const FollowButton: FC<Props> = ({ profile }) => {
  const { profileStore, authStore } = useStore();

  if (authStore.user?.userName === profile.userName) {
    return null;
  }

  const handleFollow = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    username?: string,
  ) => {
    e.preventDefault();

    if (username) {
      profileStore.updateFollowStatus(username, !profile.isFollowing);
    }
  };

  return (
    <Reveal animated='move'>
      <Reveal.Content visible style={{ width: '100%' }}>
        <Button
          fluid
          content={profile.isFollowing ? 'Following' : 'Not following'}
        />
      </Reveal.Content>
      <Reveal.Content hidden style={{ width: '100%' }}>
        <Button
          fluid
          basic
          color={profile.isFollowing ? 'red' : 'green'}
          content={profile.isFollowing ? 'Unfollow' : 'Follow'}
          onClick={(e) => handleFollow(e, profile.userName)}
          loading={profileStore.updateFollowStatusLoading}
        />
      </Reveal.Content>
    </Reveal>
  );
};

export default observer(FollowButton);
