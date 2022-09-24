import {Grid} from "semantic-ui-react";
import Activity from "../../../app/models/activity";
import {FC, useState} from "react";
import ActivityList from "./ActivityList";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";

interface Props {
    activities: Activity[];
}

const ActivityDashboard: FC<Props> = ({activities}) => {
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
    const onActivitySelected = (id: string) => {
        const activity = activities.find(a => a.id === id);
        if (activity) {
            setSelectedActivity(activity)
        }
    }
    const onCancelEdit = () => {
        setSelectedActivity(null);
    };
    return (
        <Grid>
            <Grid.Column width='10'>
                <ActivityList activities={activities} onActivitySelected={onActivitySelected}/>
            </Grid.Column>
            <Grid.Column width='6'>
                {selectedActivity && <ActivityDetails activity={selectedActivity} onCancelEdit={onCancelEdit}/>}
                <ActivityForm/>
            </Grid.Column>
        </Grid>
    );
};

export default ActivityDashboard;