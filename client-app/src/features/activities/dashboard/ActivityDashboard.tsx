import { Button, Grid } from "semantic-ui-react";
import React, { FC, useState } from "react";
import ActivityList from "./ActivityList";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import AppSpinner from "../../../app/layout/AppSpinner";
import ActivityFilters from "./ActivityFilters";
import { PagingParams } from "../../../app/models/pagination";

interface Props {}

const ActivityDashboard: FC<Props> = () => {
  const { activityStore } = useStore();
  const [moreActivitiesLoading, setMoreActivitiesLoading] = useState(false);
  const loadNextActivities = () => {
    setMoreActivitiesLoading(true);
    if (activityStore.pagination) {
      activityStore.setPagingParams(
        new PagingParams(activityStore.pagination.currentPage + 1)
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
        text="Activities loading"
      />
      <Grid.Column width="10">
        <ActivityList />
        <Button
          onClick={loadNextActivities}
          content="Load more"
          loading={moreActivitiesLoading}
          disabled={
            activityStore.pagination?.totalPages ===
            activityStore.pagination?.currentPage
          }
        />
      </Grid.Column>
      <Grid.Column width="6">
        <ActivityFilters />
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDashboard);
