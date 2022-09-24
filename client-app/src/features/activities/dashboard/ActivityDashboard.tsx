import {Grid} from "semantic-ui-react";
import Activity from "../../../app/models/activity";
import {FC} from "react";
import ActivityList from "./ActivityList";

interface Props {
    activities: Activity[];
}

const ActivityDashboard: FC<Props> = ({activities}) => {
    return (
        <Grid>
            <Grid.Column width='10'>
                <ActivityList activities={activities} />
            </Grid.Column>
        </Grid>
    );
};

export default ActivityDashboard;