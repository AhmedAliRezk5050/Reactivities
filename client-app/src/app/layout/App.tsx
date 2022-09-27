import {useEffect, useReducer, useState} from 'react';
import Activity from "../models/activity";
import NavBar from "./NavBar/NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import {Button, Container, Message} from "semantic-ui-react";
import ActivityForm from "../../features/activities/form/ActivityForm";
import AppSpinner from "./AppSpinner";
import {useStore} from "../stores/store";
import {observer} from "mobx-react-lite";


const App = () => {
    const {activityStore: {fetchActivities, activitiesLoading, error, setError}} = useStore();

    useEffect(() => {
        fetchActivities()
    }, [fetchActivities]);


    return (
        <>
            <NavBar/>

            <div className="header-separator"></div>

            <AppSpinner active={activitiesLoading}/>


            <Container>
                {error && <Message warning className='message'>
                    <Message.Header>{error.title}</Message.Header>
                    <p>{error.message}</p>
                    <Button icon='close' className='msg-close' onClick={() => setError(null)}/>
                </Message>}

                <ActivityDashboard/>
            </Container>
        </>
    );
};

export default observer(App);
