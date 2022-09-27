import {Grid} from "semantic-ui-react";
import {FC} from "react";
import ActivityList from "./ActivityList";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";
import {useStore} from "../../../app/stores/store";
import {observer} from "mobx-react-lite";

interface Props {
}

const ActivityDashboard: FC<Props> = () => {

    const {activityStore: {selectedActivity, formVisibility, getActivitiesByDate}} = useStore()
    return (
        <Grid>
            <Grid.Column width='10'>
                <ActivityList/>
                {getActivitiesByDate().length === 0 && formVisibility && <ActivityForm />}
            </Grid.Column>
            <Grid.Column width='6'>

                {selectedActivity && !formVisibility && <ActivityDetails activity={selectedActivity}/>}

                {getActivitiesByDate().length !== 0 && formVisibility && <ActivityForm />}

            </Grid.Column>
        </Grid>
    );
};

export default observer(ActivityDashboard);