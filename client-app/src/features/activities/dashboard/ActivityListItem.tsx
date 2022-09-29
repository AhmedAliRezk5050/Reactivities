import {Button, Icon, Item, Label, Segment} from "semantic-ui-react";
import {Link, NavLink} from "react-router-dom";
import React, {FC, useState} from "react";
import Activity from "../../../app/models/activity";
import {useStore} from "../../../app/stores/store";

interface Props {
    activity: Activity;
}

const ActivityListItem: FC<Props> = ({activity}) => {

    const {
        activityStore: {
            deleteActivity,
            operationsLoading,
        }
    } = useStore();

    const [deleteBtnId, setDeleteBtnId] = useState('');

    const handleDelete = (id: string) => {
        setDeleteBtnId(id);
        deleteActivity(id)
    }

    return (
        <Segment.Group>
            <Segment>
                <Item.Group>
                    <Item>
                        <Item.Image size='tiny' circular src='/assets/user.png'/>
                        <Item.Content>
                            <Item.Header as={Link} to={`/activities/${activity.id}`}>
                                {activity.title}
                            </Item.Header>
                            <Item.Description>Hosted by ahmed</Item.Description>
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <span>
                    <Icon name='clock'/> {activity.date}
                    <Icon name='marker'/> {activity.venue}
                </span>
            </Segment>
            <Segment secondary>
                Attendees go here
            </Segment>
            <Segment clearing>
                <span>{activity.description}</span>
                <Button as={Link} to={`/activities/${activity.id}`} floated='right' content='View'/>
            </Segment>
        </Segment.Group>
    )
};

export default ActivityListItem;
