import {Grid, List} from "semantic-ui-react";
import Activity from "../../../app/models/activity";
import {FC} from "react";

interface Props {
    activities: Activity[];
}

const ActivityDashboard: FC<Props> = ({activities}) => {
    const renderActivities = () => (
        <List>
            {activities.map((activity) => (
                <List.Item key={activity.id}>{activity.title}</List.Item>
            ))}
        </List>
    );

    return (
        <Grid>
            <Grid.Column width='10'>
                {renderActivities()}
            </Grid.Column>
        </Grid>
    );
};

export default ActivityDashboard;