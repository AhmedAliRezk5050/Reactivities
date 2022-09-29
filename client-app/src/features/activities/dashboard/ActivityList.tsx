import {FC, Fragment, useEffect} from "react";
import {Header, Item, Segment} from "semantic-ui-react";
import React from "react";
import {useStore} from "../../../app/stores/store";
import {observer} from "mobx-react-lite";
import ActivityListItem from "./ActivityListItem";

interface Props {
}

const ActivityList: FC<Props> = () => {
    const {
        activityStore
    } = useStore();

    useEffect(() => {
        activityStore.fetchActivities()
    }, [activityStore])


    if (activityStore.activitiesByDate.length === 0) return null

    return (
        <>
            {
                activityStore.groupedActivities
                    .map(([group, activities]) =>
                        <Fragment key={group}>
                            <Header sub>{group}</Header>
                            <Segment>
                                <Item.Group divided>
                                    {activities.map(activity => (
                                        <ActivityListItem activity={activity} key={activity.id}/>
                                    ))}
                                </Item.Group>
                            </Segment>
                        </Fragment>)
            }
        </>
    )
};

export default observer(ActivityList);