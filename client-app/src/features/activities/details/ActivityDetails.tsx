import {FC} from "react";
import Activity from "../../../app/models/activity";
import {Button, Card, Image} from "semantic-ui-react";
import {useStore} from "../../../app/stores/store";
import {observer} from "mobx-react-lite";

interface Props {
    activity: Activity
}

const ActivityDetails: FC<Props> = ({activity}) => {

    const {activityStore: {setSelectedActivity, setFormVisibility}} = useStore();


    return (
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
                    <Button basic color='yellow' content='Edit' onClick={() => setFormVisibility(true)}/>
                    <Button basic color='red' content='Cancel' onClick={() => setSelectedActivity(null)}/>
                </Button.Group>
            </Card.Content>
        </Card>
    );
};

export default observer(ActivityDetails);