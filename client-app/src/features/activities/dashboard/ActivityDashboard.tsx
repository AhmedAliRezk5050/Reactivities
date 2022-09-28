import {Button, Grid, Message} from "semantic-ui-react";
import React, {FC} from "react";
import ActivityList from "./ActivityList";
import {useStore} from "../../../app/stores/store";
import {observer} from "mobx-react-lite";
import AppSpinner from "../../../app/layout/AppSpinner";

interface Props {
}

const ActivityDashboard: FC<Props> = () => {

    const {activityStore: {activitiesLoading, error, setError}} = useStore();

    return (
        <>
            {error && <Message warning className='message'>
                <Message.Header>{error.title}</Message.Header>
                <p>{error.message}</p>
                <Button icon='close' className='msg-close' onClick={() => setError(null)}/>
            </Message>}
            <Grid className='centered'>
                <AppSpinner active={activitiesLoading}/>

                <Grid.Column width='10'>
                    <ActivityList/>
                </Grid.Column>
            </Grid>
        </>

    );
};

export default observer(ActivityDashboard);