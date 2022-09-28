import {FC, useEffect, useState} from "react";
import {Button, Item, Label, Segment} from "semantic-ui-react";
import React from "react";
import {useStore} from "../../../app/stores/store";
import {observer} from "mobx-react-lite";
import {Link, NavLink} from "react-router-dom";

interface Props {
}

const ActivityList: FC<Props> = () => {
    const {
        activityStore: {
            getActivitiesByDate,
            deleteActivity,
            operationsLoading,
            fetchActivities,
        }
    } = useStore();

    const [deleteBtnId, setDeleteBtnId] = useState('');


    const handleDelete = (id: string) => {
        setDeleteBtnId(id);
        deleteActivity(id)
    }


    useEffect(() => {
        fetchActivities()
    }, [fetchActivities])


    if (getActivitiesByDate().length === 0) return null

    return <Segment>
        <Item.Group divided>
            {getActivitiesByDate().map(activity => (
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
            ))}
        </Item.Group>
    </Segment>
};

export default observer(ActivityList);