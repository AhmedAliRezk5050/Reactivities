import {FC, useEffect, useState} from "react";
import {Button, Card, Grid, Image} from "semantic-ui-react";
import {useStore} from "../../../app/stores/store";
import {observer} from "mobx-react-lite";
import {Link, Navigate, useNavigate, useParams} from "react-router-dom";
import AppSpinner from "../../../app/layout/AppSpinner";

interface Props {
}

const ActivityDetails: FC<Props> = () => {
    const [localLoading, setLocalLoading] = useState(true);
    const {activityStore} = useStore();
    const {id} = useParams<{id: string}>();
    const navigate = useNavigate();
    useEffect(() => {
        activityStore.fetchActivity(id!).finally(() => {
            setLocalLoading(false);
        })
    }, [activityStore, id])


    if (activityStore.activityLoading || localLoading) return <AppSpinner active={activityStore.activityLoading}/>;

    if (!activityStore.activity) {

        return <Navigate to='/not-found'/>;
    }


    return (
        <Grid className='centered'>
            <Grid.Column width={7}>
                <Card fluid>
                    <Image src={`/assets/categoryImages/${activityStore.activity!.category}.jpg`}/>
                    <Card.Content>
                        <Card.Header>{activityStore.activity!.title}</Card.Header>
                        <Card.Meta>
                            <span className='date'>{activityStore.activity!.date}</span>
                        </Card.Meta>
                        <Card.Description>
                            {activityStore.activity!.description}
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <Button.Group widths='2'>
                            <Button basic color='yellow' content='Edit' as={Link}
                                    to={`/activities/${activityStore.activity!.id}/edit`}/>
                            <Button basic color='red' content='Cancel' onClick={() => navigate('/activities')}/>
                        </Button.Group>
                    </Card.Content>
                </Card>
            </Grid.Column>
        </Grid>
    );
};

export default observer(ActivityDetails);