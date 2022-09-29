import {Button, Item, Label} from "semantic-ui-react";
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
        <Item key={activity.id}>
            <Item.Content>
                <Item.Header as={NavLink} to={activity.id}>{activity.title}</Item.Header>
                <Item.Meta>{activity.date}</Item.Meta>
                <Item.Description>
                    <div>{activity.description}</div>
                    <div>{activity.city}, {activity.venue}</div>
                </Item.Description>
                <Item.Extra>
                    <Button floated='right'
                            content='delete'
                            negative
                            onClick={() => handleDelete(activity.id)}
                            loading={deleteBtnId === activity.id && operationsLoading}
                    />
                    <Button floated='right'
                            content='View'
                            positive
                            as={Link}
                            to={activity.id}
                    />
                    <Label basic content={activity.category}/>
                </Item.Extra>
            </Item.Content>
        </Item>
    )
};

export default ActivityListItem;
