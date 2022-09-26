import {useEffect, useState} from 'react';
import {v4 as uuidv4} from 'uuid';
import axios from 'axios';
import Activity from "../models/activity";
import NavBar from "./NavBar/NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import {Container, Dimmer, Loader, Message} from "semantic-ui-react";
import ActivityForm from "../../features/activities/form/ActivityForm";
import {activityApi} from "../api/agent";

const App = () => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [createMode, setCreateMode] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [fetched, setFetched] = useState(false);
    useEffect(() => {
        activityApi.List().then(({data}) => {
            setActivities(data);
            setFetched(true);
        })
    }, []);


    const onHideActivity = () => {
        setSelectedActivity(null);
    };

    const onUpsertActivity = (upsertedActivity: Activity) => {
        if (upsertedActivity.id === '') {
            upsertedActivity.id = uuidv4();
            setActivities([...activities, upsertedActivity])
            setCreateMode(false);
        } else {
            setActivities(activities.map(activity =>
                activity.id === upsertedActivity.id ? upsertedActivity : activity))

            setSelectedActivity(upsertedActivity);
            setEditMode(false);

        }
    }

    const onActivitySelected = (id: string) => {
        const activity = activities.find(a => a.id === id);
        if (activity) {
            if (editMode) return;
            if (createMode) return;
            setSelectedActivity(activity)
        }
    }

    const onCancelForm = (editing = false) => {
        if (editing) {
            setEditMode(false);
        } else {
            setCreateMode(false)
        }
    }

    const onShowForm = (id?: string) => {
        if (editMode || createMode) return;

        if (id) {
            setEditMode(true);
            setCreateMode(false);
        } else {
            setCreateMode(true);
            setEditMode(false);
        }
    }

    const onDeleteActivity = (id: string) => {
        setActivities(activities.filter(a => a.id !== id));
        if (selectedActivity?.id === id) setSelectedActivity(null);

    }
    return (
        <>
            <NavBar onStartCreate={onShowForm}/>
            <div className="header-separator"></div>
            <Container>
                <Dimmer active={activities.length === 0 && !fetched}>
                    <Loader/>
                </Dimmer>
                {fetched && activities.length === 0 && <Message warning>
                    <Message.Header>No activities found</Message.Header>
                    <p>Add new activity.</p>
                </Message>}
                {activities.length > 0 &&
                    <ActivityDashboard
                        activities={activities}
                        selectedActivity={selectedActivity}
                        onActivitySelected={onActivitySelected}
                        onHideActivity={onHideActivity}
                        onStartEdit={onShowForm}
                        editMode={editMode}
                        onCancel={onCancelForm}
                        createMode={createMode}
                        onUpsertActivity={onUpsertActivity}
                        onDeleteActivity={onDeleteActivity}
                    />}

                {activities.length === 0 && !editMode && createMode && <ActivityForm
                    onCancel={() => onCancelForm(false)} activity={null} onUpsertActivity={onUpsertActivity}/>}
            </Container>
        </>
    );
};

export default App;

// show create form
//      -- edit form shown
// cancel create form

// show edit form
// cancel edit form


// view activity
//      edit form shown
//      create form shown
// hide activity
