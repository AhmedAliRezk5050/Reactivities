import {FC, MouseEvent, useState} from "react";
import Activity from "../../../app/models/activity";
import {Button, Item, Label, Segment} from "semantic-ui-react";
import React from "react";
import {useStore} from "../../../app/stores/store";
import {observer} from "mobx-react-lite";

interface Props {
}

const ActivityList: FC<Props> = () => {
    const {
        activityStore: {
            setSelectedActivity,
            activities,
            formVisibility,
            deleteActivity,
            operationsLoading
        }
    } = useStore();

    const [deleteBtnId, setDeleteBtnId] = useState('');


    const handleDelete = (id: string) => {
        setDeleteBtnId(id);
        deleteActivity(id)
    }


    if (activities.length === 0) return null;

    return <Segment>
        <Item.Group divided>
            {activities.map(activity => (
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
                                    content='delete'
                                    negative
                                    onClick={() => handleDelete(activity.id)}
                                    loading={deleteBtnId === activity.id && operationsLoading}
                            />
                            <Button floated='right'
                                    content='view'
                                    positive
                                    onClick={() => !formVisibility && setSelectedActivity(activity.id)}/>
                            <Label basic content={activity.category}/>
                        </Item.Extra>
                    </Item.Content>
                </Item>
            ))}
        </Item.Group>
    </Segment>
};

export default observer(ActivityList);