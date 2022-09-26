import {FC, MouseEvent, useState} from "react";
import Activity from "../../../app/models/activity";
import {Button, Item, Label, Segment} from "semantic-ui-react";
import React from "react";

interface Props {
    activities: Activity[],
    onActivitySelected: (id: string) => void;
    onDeleteActivity: (id: string) => void;
    formLoading: boolean;
}

const ActivityList: FC<Props> = ({activities, onActivitySelected, onDeleteActivity, formLoading}) => {
    const [foo, setFoo] = useState('')
    const handleDelete = (e: MouseEvent<HTMLButtonElement>, id: string) => {

        setFoo(id);
        onDeleteActivity(id)
    }

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

                                <Button floated='right'
                                        loading={formLoading && foo === activity.id}
                                        content='delete'
                                        negative
                                        onClick={(e) => handleDelete(e, activity.id)}/>
                                <Button floated='right'
                                        content='view'
                                        positive
                                        onClick={() => onActivitySelected(activity.id)}/>
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