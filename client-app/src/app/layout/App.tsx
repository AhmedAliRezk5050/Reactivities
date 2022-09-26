import {useEffect, useReducer, useState} from 'react';
import {v4 as uuidv4} from 'uuid';
import Activity from "../models/activity";
import NavBar from "./NavBar/NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import {Button, Container, Message} from "semantic-ui-react";
import ActivityForm from "../../features/activities/form/ActivityForm";
import {activityApi} from "../api/agent";
import AppSpinner from "./AppSpinner";

type Actions = 'FETCH_START' | 'FETCH_SUCCESS' | 'FETCH_ERROR' | 'RESET';

interface Action {
    type: Actions,
    payload?: any
}

interface ActivitiesState {
    loading: boolean;
    error: string | null,
    activities: Activity[],
}

interface ActivityState {
    loading: boolean;
    error: string | null,
}

const activitiesInitialState: ActivitiesState = {loading: true, error: null, activities: []};

const activitiesReducer = (state = activitiesInitialState, action: Action): ActivitiesState => {
    switch (action.type) {
        case "FETCH_START":
            return {
                loading: true,
                error: null,
                activities: []
            };
        case "FETCH_SUCCESS":
            return {
                loading: false,
                error: null,
                activities: action.payload
            };
        case "FETCH_ERROR":
            return {
                loading: false,
                error: action.payload,
                activities: []
            };

        default:
            return state
    }
}

const activityInitialState: ActivityState = {loading: false, error: null};

const activityReducer = (state = activityInitialState, action: Action): ActivityState => {
    switch (action.type) {
        case "FETCH_START":
            return {
                loading: true,
                error: null,
            };
        case "FETCH_SUCCESS":
            return {
                loading: false,
                error: null
            };
        case "FETCH_ERROR":
            return {
                loading: false,
                error: action.payload,
            };
        case "RESET":
            return {
                loading: false,
                error: null,
            };

        default:
            return state
    }
}

const App = () => {
    //----------------
    const [activitiesState, activitiesDispatch] = useReducer(activitiesReducer, activitiesInitialState);
    const [activityState, activityDispatch] = useReducer(activityReducer, activityInitialState);
    //----------------


    const [createMode, setCreateMode] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        activitiesDispatch({type: 'FETCH_START'});
        activityApi.getAll().then(({data}) => {
            activitiesDispatch({
                type: 'FETCH_SUCCESS', payload: data.map(a => {
                    a.date = a.date.split('T')[0];
                    return a;
                })
            });
        }).catch(() => {
            activitiesDispatch({type: 'FETCH_ERROR', payload: 'Failed to fetch activities'})
        })
    }, []);


    const onHideActivity = () => {
        setSelectedActivity(null);
    };

    const onUpsertActivity = (upsertedActivity: Activity) => {
        if (upsertedActivity.id === '') {
            upsertedActivity.id = uuidv4();
            activityDispatch({type: 'FETCH_START'})
            activityApi.create(upsertedActivity).then(() => {
                activityDispatch({type: 'FETCH_SUCCESS'})
                activitiesDispatch({type: 'FETCH_SUCCESS', payload: [...activitiesState.activities, upsertedActivity]})
                setCreateMode(false);
            }).catch(() => {
                activityDispatch({type: 'FETCH_ERROR', payload: 'Creating new activity failed'})
                upsertedActivity.id = '';
            });

        } else {
            activityDispatch({type: 'FETCH_START'});
            activityApi.update(upsertedActivity.id, upsertedActivity)
                .then(() => {
                    activitiesDispatch({
                        type: 'FETCH_SUCCESS', payload: activitiesState.activities.map(activity =>
                            activity.id === upsertedActivity.id ? upsertedActivity : activity)
                    });
                    setSelectedActivity(upsertedActivity);
                    setEditMode(false);
                    activityDispatch({type: 'FETCH_SUCCESS'});
                })
                .catch(() => {
                    activityDispatch({type: 'FETCH_ERROR', payload: 'Failed to edit activity'});
                })

        }
    }

    const onActivitySelected = (id: string) => {
        const activity = activitiesState.activities.find(a => a.id === id);
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
        activityDispatch({type: 'FETCH_START'});
        activityApi.delete(id)
            .then(() => {
                activityDispatch({type: 'FETCH_SUCCESS'});
                activitiesDispatch({
                    type: 'FETCH_SUCCESS', payload: activitiesState.activities.filter(a => a.id !== id)
                });
            })
            .catch(() => {
                activityDispatch({type: 'FETCH_ERROR', payload: 'Failed to delete activity'});
            });

        if (selectedActivity?.id === id) setSelectedActivity(null);

    }


    return (
        <>
            <NavBar onStartCreate={onShowForm}/>
            <div className="header-separator"></div>
            <Container>
                <AppSpinner active={activitiesState.loading}/>

                {activityState.error &&
                    <Message warning>
                        <Message.Header>Failed operation</Message.Header>
                        <p>{activityState.error}</p>
                        <Button icon='close' className='msg-close' onClick={() => activityDispatch({type: 'RESET'})}/>
                    </Message>}


                {!activitiesState.error && !activitiesState.loading && activitiesState.activities.length === 0 &&
                    <Message warning>
                        <Message.Header>No activities found</Message.Header>
                        <p>Add new activity.</p>
                    </Message>}

                {activitiesState.error && <Message warning>
                    <Message.Header>Error Fetching activities</Message.Header>
                    <p>Try again later.</p>
                </Message>}


                {activitiesState.activities.length > 0 &&
                    <ActivityDashboard
                        activities={activitiesState.activities}
                        selectedActivity={selectedActivity}
                        onActivitySelected={onActivitySelected}
                        onHideActivity={onHideActivity}
                        onStartEdit={onShowForm}
                        editMode={editMode}
                        onCancel={onCancelForm}
                        createMode={createMode}
                        onUpsertActivity={onUpsertActivity}
                        onDeleteActivity={onDeleteActivity}
                        formLoading={activityState.loading}
                    />}

                {activitiesState.activities.length === 0 && !editMode && createMode && <ActivityForm
                    onCancel={() => onCancelForm(false)} activity={null} onUpsertActivity={onUpsertActivity}/>}
            </Container>
        </>
    );
};

export default App;
