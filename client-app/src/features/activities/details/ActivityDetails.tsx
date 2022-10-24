import { FC, useEffect, useState } from 'react';
import { Grid } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { Navigate, useParams } from 'react-router-dom';
import AppSpinner from '../../../app/layout/AppSpinner';
import ActivityDetailedHeader from './ActivityDetailedHeader';
import ActivityDetailedInfo from './ActivityDetailedInfo';
import ActivityDetailedChat from './ActivityDetailedChat';
import ActivityDetailedSidebar from './ActivityDetailedSidebar';

interface Props {}

const ActivityDetails: FC<Props> = () => {
  const [localLoading, setLocalLoading] = useState(true);
  const { activityStore } = useStore();
  const { id } = useParams<{ id: string }>();
  useEffect(() => {
    activityStore.fetchActivity(id!).finally(() => {
      setLocalLoading(false);
    });
  }, [activityStore, id]);

  if (activityStore.activityLoading || localLoading)
    return <AppSpinner active={activityStore.activityLoading} />;

  if (!activityStore.activity) return null;

  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityDetailedHeader activity={activityStore.activity} />
        <ActivityDetailedInfo activity={activityStore.activity} />
        <ActivityDetailedChat />
      </Grid.Column>
      <Grid.Column width={6}>
        <ActivityDetailedSidebar
          attendees={activityStore.activity.attendees!}
        />
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDetails);
