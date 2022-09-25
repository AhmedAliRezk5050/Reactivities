import {Grid} from "semantic-ui-react";
import Activity from "../../../app/models/activity";
import {FC, useEffect, useState} from "react";
import ActivityList from "./ActivityList";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";

interface Props {
    activities: Activity[];
    selectedActivity: Activity | null;
    onActivitySelected: (id: string) => void;
    onHideActivity: () => void;
    onStartEdit: () => void;
    onCancel: (editing: boolean) => void;
    editMode: boolean,
    createMode: boolean,
    onUpsertActivity: (activity: Activity) => void
}

const ActivityDashboard: FC<Props> = ({
                                          activities,
                                          selectedActivity,
                                          onActivitySelected,
                                          onHideActivity,
                                          onStartEdit,
                                          editMode,
                                          onCancel,
                                          createMode,
                                          onUpsertActivity
                                      }) => {

    return (
        <Grid>
            <Grid.Column width='10'>
                <ActivityList activities={activities} onActivitySelected={onActivitySelected}/>
            </Grid.Column>
            <Grid.Column width='6'>
                {selectedActivity && !editMode && !createMode &&
                    <ActivityDetails activity={selectedActivity} onHideActivity={onHideActivity}
                                     onStartEdit={onStartEdit}/>}
                {!createMode && editMode && <ActivityForm
                    onCancel={() => onCancel(true)} activity={selectedActivity} onUpsertActivity={onUpsertActivity}/>}

                {!editMode && createMode && <ActivityForm
                    onCancel={() => onCancel(false)} activity={null} onUpsertActivity={onUpsertActivity}/>}
            </Grid.Column>
        </Grid>
    );
};

export default ActivityDashboard;