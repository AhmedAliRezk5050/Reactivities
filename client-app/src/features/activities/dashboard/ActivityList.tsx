import {FC} from "react";
import Activity from "../../../app/models/activity";
import {Button, Item, Label, Segment} from "semantic-ui-react";

interface Props {
    activities: Activity[]
}

const ActivityList: FC<Props> = ({activities}) => {
    return <Segment>
        <Item.Group divided>
            {
                activities.map(activity => (
                    <Item key={activity.id}>
                        <Item.Content>
                            <Item.Header as='a'>{activity.title}</Item.Header>
                            <Item.Meta>{activity.date}</Item.Meta>
                            <Item.Description>
                                <div>{activity.description}</div>
                                <div>{activity.city}, {activity.venue}</div>
                            </Item.Description>
                            <Item.Extra>
                                <Button floated='right' content='view'/>
                                <Label basic content={activity.category}/>
                            </Item.Extra>
                        </Item.Content>
                    </Item>
                ))
            }
        </Item.Group>
    </Segment>
};

export default ActivityList;