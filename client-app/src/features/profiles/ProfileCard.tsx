import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Card, Icon, Image } from 'semantic-ui-react';

import { UserProfile } from '../../app/models/profile';
import FollowButton from './FollowButton';

interface Props {
  profile: UserProfile;
}

const ProfileCard: FC<Props> = ({ profile }) => {
  const bio = profile.bio;
  return (
    <Card as={Link} to={`/profiles/${profile.userName}`}>
      <Image src={profile.image ?? '/assets/user.png'} />
      <Card.Content>
        <Card.Header>{profile.displayName}</Card.Header>
        <Card.Description>{bio && bio.slice(0, 30)}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Icon name='user' />
        {profile.followersCount} followers
      </Card.Content>
      <FollowButton profile={profile} />
    </Card>
  );
};

export default observer(ProfileCard);
