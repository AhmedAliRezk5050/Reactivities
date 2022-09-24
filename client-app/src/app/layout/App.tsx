import {useEffect, useState} from 'react';
import axios from 'axios';
import Activity from "../models/activity";
import NavBar from "./NavBar/NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import {Container, Dimmer, Loader} from "semantic-ui-react";

const App = () => {
    const [activities, setActivities] = useState<Activity[]>([]);

    useEffect(() => {
        axios
            .get<Activity[]>('http://localhost:5000/api/activities')
            .then(({data}) => setActivities(data));
    }, []);


    return (
        <>
            <NavBar/>
            <div className="header-separator"></div>
            <Container>
                <Dimmer active={activities.length === 0}>
                    <Loader />
                </Dimmer>
                {activities.length > 0 && <ActivityDashboard activities={activities}/>}
            </Container>
        </>
    );
};

export default App;
