import { Grid, Loader } from 'semantic-ui-react';
import React, { FC, useState } from 'react';
import ActivityList from './ActivityList';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import AppSpinner from '../../../app/layout/AppSpinner';
import ActivityFilters from './ActivityFilters';
import { PagingParams } from '../../../app/models/pagination';
import InfiniteScroll from 'react-infinite-scroller';

interface Props {}

const ActivityDashboard: FC<Props> = () => {
  const { activityStore } = useStore();
  const [moreActivitiesLoading, setMoreActivitiesLoading] = useState(false);
  const loadNextActivities = () => {
    console.log('loadNextActivities');
    setMoreActivitiesLoading(true);
    if (activityStore.pagination) {
      activityStore.setPagingParams(
        new PagingParams(activityStore.pagination.currentPage + 1),
      );
      activityStore
        .fetchActivities()
        .finally(() => setMoreActivitiesLoading(false));
    }
  };

  return (
    <Grid>
      <AppSpinner
        active={activityStore.activitiesLoading && !moreActivitiesLoading}
        text='Activities loading'
      />
      <Grid.Column width='10'>
        <InfiniteScroll
          pageStart={0}
          loadMore={loadNextActivities}
          hasMore={
            !moreActivitiesLoading &&
            !!activityStore.pagination &&
            activityStore.pagination.currentPage <
              activityStore.pagination.totalPages
          }
          initialLoad={false}
        >
          <ActivityList />
        </InfiniteScroll>
      </Grid.Column>
      <Grid.Column width='6'>
        <ActivityFilters />
      </Grid.Column>
      <Grid.Column width='10'>
        <Loader active={moreActivitiesLoading} />
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDashboard);
