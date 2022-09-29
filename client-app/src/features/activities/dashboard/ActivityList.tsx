import {FC, useEffect} from "react";
import {Item, Segment} from "semantic-ui-react";
import React from "react";
import {useStore} from "../../../app/stores/store";
import {observer} from "mobx-react-lite";
import ActivityListItem from "./ActivityListItem";

interface Props {
}

const ActivityList: FC<Props> = () => {
    const {
        activityStore: {
            getActivitiesByDate,
            fetchActivities,
        }
    } = useStore();

    useEffect(() => {
        fetchActivities()
    }, [fetchActivities])


    if (getActivitiesByDate().length === 0) return null

    return <Segment>
        <Item.Group divided>
            {getActivitiesByDate().map(activity => (
               <ActivityListItem activity={activity} key={activity.id}/>
            ))}
        </Item.Group>
    </Segment>
};

export default observer(ActivityList);