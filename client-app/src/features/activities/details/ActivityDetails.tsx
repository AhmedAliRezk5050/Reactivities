import {FC, useEffect} from "react";
import {Button, Card, Grid, Image} from "semantic-ui-react";
import {useStore} from "../../../app/stores/store";
import {observer} from "mobx-react-lite";
import {Navigate, useNavigate, useParams} from "react-router-dom";
import AppSpinner from "../../../app/layout/AppSpinner";

interface Props {
}

const ActivityDetails: FC<Props> = () => {

    const {activityStore: {activity, fetchActivity, activityLoading}} = useStore();
    const params =  useParams();
    const navigate = useNavigate();
    useEffect(() => {
        fetchActivity(params['id'] ?? '')
    }, [fetchActivity, params])



    if(activityLoading) return <AppSpinner active={activityLoading} />;


    if(!activity)  {
        return <Navigate to='/not-found' />;
    }

    return (
        <Grid className='centered'>
            <Grid.Column width={7} >
                <Card fluid>
                    <Image src={`/assets/categoryImages/${activity.category}.jpg`}/>
                    <Card.Content>
                        <Card.Header>{activity.title}</Card.Header>
                        <Card.Meta>
                            <span className='date'>{activity.date}</span>
                        </Card.Meta>
                        <Card.Description>
                            {activity.description}
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <Button.Group widths='2'>
                            <Button basic color='yellow' content='Edit' />
                            <Button basic color='red' content='Cancel' onClick={() => navigate('/activities')}/>
                        </Button.Group>
                    </Card.Content>
                </Card>
            </Grid.Column>
        </Grid>
    );
};

export default observer(ActivityDetails);