import {Button, Grid, Message} from "semantic-ui-react";
import React, {FC} from "react";
import ActivityList from "./ActivityList";
import {useStore} from "../../../app/stores/store";
import {observer} from "mobx-react-lite";
import AppSpinner from "../../../app/layout/AppSpinner";
import ActivityFilters from "./ActivityFilters";

interface Props {
}

const ActivityDashboard: FC<Props> = () => {

    const {activityStore: {activitiesLoading}} = useStore();

    return (
            <Grid>
                <AppSpinner active={activitiesLoading}/>
                <Grid.Column width='10'>
                    <ActivityList/>
                </Grid.Column>
                <Grid.Column width='6'>
                   <ActivityFilters />
                </Grid.Column>
            </Grid>

    );
};

export default observer(ActivityDashboard);