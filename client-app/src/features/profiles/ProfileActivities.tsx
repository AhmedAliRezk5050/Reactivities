import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Tab, Grid, Header, Card, Image, TabProps } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { AppUserActivity } from "../../app/models/profile";
import { format } from "date-fns";
import { useStore } from "../../app/stores/store";

const panes = [
  { menuItem: "Future Events", pane: { key: "future" } },
  { menuItem: "Past Events", pane: { key: "past" } },
  { menuItem: "Hosting", pane: { key: "hosting" } },
];

const ProfileActivities = () => {
  const { profileStore } = useStore();
  const { fetchUserActivities } = profileStore;

  useEffect(() => {
    fetchUserActivities(profileStore.profile!.userName);
  }, [fetchUserActivities, profileStore]);

  const handleTabChange = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    data: TabProps
  ) => {
    fetchUserActivities(
      profileStore.profile!.userName,
      panes[data.activeIndex as number].pane.key
    );
  };

  return (
    <Tab.Pane loading={profileStore.userActivitiesLoading}>
      <Grid>
        <Grid.Column width={16}>
          <Header floated="left" icon="calendar" content={"Activities"} />
        </Grid.Column>
        <Grid.Column width={16}>
          <Tab
            panes={panes}
            menu={{ secondary: true, pointing: true }}
            onTabChange={(e, data) => handleTabChange(e, data)}
          />
          <br />
          <Card.Group itemsPerRow={4}>
            {profileStore.userActivities.map((activity: AppUserActivity) => (
              <Card
                as={Link}
                to={`/activities/${activity.id}`}
                key={activity.id}
              >
                <Image
                  src={`/assets/categoryImages/${activity.category}.jpg`}
                  style={{ minHeight: 100, objectFit: "cover" }}
                />
                <Card.Content>
                  <Card.Header textAlign="center">{activity.title}</Card.Header>
                  <Card.Meta textAlign="center">
                    <div>{format(activity.date, "do LLL")}</div>
                    <div>{format(activity.date, "h:mm a")}</div>
                  </Card.Meta>
                </Card.Content>
              </Card>
            ))}
          </Card.Group>
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default observer(ProfileActivities);
