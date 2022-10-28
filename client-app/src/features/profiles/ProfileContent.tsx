import { observer } from 'mobx-react-lite';
import { Tab } from 'semantic-ui-react';
import EditProfile from './EditProfile';
import ProfilePhotos from './ProfilePhotos';

const ProfileContent = () => {
  const panes = [
    { menuItem: 'About', render: () => <EditProfile /> },
    {
      menuItem: 'Photos',
      render: () => <ProfilePhotos />,
    },
    { menuItem: 'Events', render: () => <Tab.Pane>Events Content</Tab.Pane> },
    {
      menuItem: 'Followers',
      render: () => <Tab.Pane>Followers Content</Tab.Pane>,
    },
    {
      menuItem: 'Following',
      render: () => <Tab.Pane>Following Content</Tab.Pane>,
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
