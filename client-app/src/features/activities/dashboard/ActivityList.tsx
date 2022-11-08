import { FC, Fragment, useEffect } from 'react';
import { Header } from 'semantic-ui-react';
import React from 'react';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import ActivityListItem from './ActivityListItem';
import ActivityListItemPlaceholder from './ActivityListItemPlaceholder';

interface Props {}

const ActivityList: FC<Props> = () => {
  const { activityStore } = useStore();

  useEffect(() => {
    activityStore.fetchActivities();
  }, [activityStore]);

  if (activityStore.activitiesByDate.length === 0)
    return (
      <>
        <ActivityListItemPlaceholder />
        <ActivityListItemPlaceholder />
      </>
    );

  return (
    <>
      {activityStore.groupedActivities.map(([group, activities]) => (
        <Fragment key={group}>
          <Header sub>{group}</Header>
          {activities.map((activity) => (
            <ActivityListItem activity={activity} key={activity.id} />
          ))}
        </Fragment>
      ))}
    </>
  );
};

export default observer(ActivityList);
