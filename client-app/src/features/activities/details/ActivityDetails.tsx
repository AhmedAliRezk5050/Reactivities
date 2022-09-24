import {FC} from "react";
import Activity from "../../../app/models/activity";
import {Button, Card, Image} from "semantic-ui-react";

interface Props {
    activity: Activity,
    onCancelEdit: () => void
}

const ActivityDetails: FC<Props> = ({activity, onCancelEdit}) => {
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
                    <Button basic color='yellow' content='Edit' />
                    <Button basic color='red' content='Cancel' onClick={() => onCancelEdit()}/>
                </Button.Group>
            </Card.Content>
        </Card>
    );
};

export default ActivityDetails;