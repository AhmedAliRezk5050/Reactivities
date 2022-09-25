import {useEffect, useState} from 'react';
import axios from 'axios';
import Activity from "../models/activity";
import NavBar from "./NavBar/NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import {Container, Dimmer, Loader} from "semantic-ui-react";

const App = () => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [createMode, setCreateMode] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        axios
            .get<Activity[]>('http://localhost:5000/api/activities')
            .then(({data}) => setActivities(data));
    }, []);


    const onHideActivity = () => {
        setSelectedActivity(null);
    };



    const onActivitySelected = (id: string) => {
        const activity = activities.find(a => a.id === id);
        if (activity) {
            if(selectedActivity && selectedActivity.id === id) return;
            if(editMode)  return;
            if (createMode) return;
            setSelectedActivity(activity)
        }
    }

    const onCancelForm = (editing = false) => {
        if(editing) {
            setEditMode(false);
        } else {
            setCreateMode(false)
        }
    }

    const onShowForm = (id?: string) => {
        if(editMode || createMode) return;
        
        if(id) {
            setEditMode(true);
            setCreateMode(false);
        } else {
            setCreateMode(true);
            setEditMode(false);
        }
    }
    return (
        <>
            <NavBar onStartCreate={onShowForm}/>
            <div className="header-separator"></div>
            <Container>
                <Dimmer active={activities.length === 0}>
                    <Loader />
                </Dimmer>
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
                />}
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
