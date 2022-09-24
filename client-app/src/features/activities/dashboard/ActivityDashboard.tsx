import {Grid} from "semantic-ui-react";
import Activity from "../../../app/models/activity";
import {FC} from "react";
import ActivityList from "./ActivityList";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";

interface Props {
    activities: Activity[];
}

const ActivityDashboard: FC<Props> = ({activities}) => {
    return (
        <Grid>
            <Grid.Column width='10'>
                <ActivityList activities={activities} />
            </Grid.Column>
            <Grid.Column width='6'>
                <ActivityDetails activity={activities[0]} />
                <ActivityForm />
            </Grid.Column>
        </Grid>
    );
};

export default ActivityDashboard;