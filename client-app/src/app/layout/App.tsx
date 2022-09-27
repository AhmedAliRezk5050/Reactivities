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
    const {activityStore: {fetchActivities, activitiesLoading, error}} = useStore();

    useEffect(() => {
        fetchActivities()
    }, [fetchActivities]);


    return (
        <>
            <NavBar/>

            <div className="header-separator"></div>

            <AppSpinner active={activitiesLoading}/>

            {error && <Message warning>
                <Message.Header>{error.title}</Message.Header>
                <p>{error.message}</p>
            </Message>}


            <Container>
                <ActivityDashboard/>
            </Container>
        </>
    );
};

export default observer(App);
