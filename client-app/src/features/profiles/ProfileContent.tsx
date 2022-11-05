import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import { Tab } from 'semantic-ui-react';
import { Profile } from '../../app/models/profile';
import { useStore } from '../../app/stores/store';
import EditProfile from './EditProfile';
import ProfileFollowings from './ProfileFollowings';
import ProfilePhotos from './ProfilePhotos';

const ProfileContent = () => {
  const { profileStore } = useStore();
  console.log('ProfileContent', profileStore.profile);
  const panes = [
    { menuItem: 'About', render: () => <EditProfile /> },
    {
      menuItem: 'Photos',
      render: () => <ProfilePhotos />,
    },
    { menuItem: 'Events', render: () => <Tab.Pane>Events Content</Tab.Pane> },
    {
      menuItem: 'Followers',
      render: () => <ProfileFollowings />,
    },
    {
      menuItem: 'Following',
      render: () => <ProfileFollowings />,
    },
  ];
  return (
    <Tab
      menu={{ fluid: true, vertical: true }}
      menuPosition='right'
      panes={panes}
    />
  );
};

export default observer(ProfileContent);
