import { observer } from "mobx-react-lite";
import { Tab } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import EditProfile from "./EditProfile";
import ProfileFollowings from "./ProfileFollowings";
import ProfilePhotos from "./ProfilePhotos";
import ProfileActivities from "./ProfileActivities";

const ProfileContent = () => {
  const { profileStore } = useStore();
  const panes = [
    { menuItem: "About", render: () => <EditProfile /> },
    {
      menuItem: "Photos",
      render: () => <ProfilePhotos />,
    },
    { menuItem: "Events", render: () => <ProfileActivities /> },
    {
      menuItem: "Followers",
      render: () => <ProfileFollowings />,
    },
    {
      menuItem: "Following",
      render: () => <ProfileFollowings />,
    },
  ];
  return (
    <Tab
      menu={{ fluid: true, vertical: true }}
      menuPosition="right"
      panes={panes}
      onTabChange={(x, y) => {
        profileStore.setActiveTab(y.activeIndex as number);
      }}
      activeIndex={profileStore.activeTab}
    />
  );
};

export default observer(ProfileContent);
