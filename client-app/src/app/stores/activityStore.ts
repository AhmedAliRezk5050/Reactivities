import {makeAutoObservable} from "mobx";
import Activity from "../models/activity";
import {activityApi} from "../api/agent";
import {v4 as uuidv4} from 'uuid';

interface Error {
    title: string;
    message: string
}


export default class ActivityStore {
    activities: Map<string, Activity> = new Map();
    selectedActivity: Activity | null = null;
    activitiesLoading: boolean = true;
    operationsLoading: boolean = false;
    error: Error | null = null;
    formVisibility = false;


    constructor() {
        makeAutoObservable(this)
    }

    fetchActivities = async () => {
        this.setActivitiesLoading(true);
        this.setError(null);
        try {
            const {data: activitiesFromDb} = await activityApi.getAll();
            this.setActivities(activitiesFromDb)

            if (activitiesFromDb.length === 0) {
                this.setError({title: 'Activities', message: 'No activities found'});
            }
        } catch (e: any) {
            this.setError({title: 'Activities', message: 'Failed to load activities'});
        }
        this.setActivitiesLoading(false);
    }

    upsertActivity = async (activity: Activity) => {
        let createMode = true;
        this.setOperationsLoading(true);

        try {
            if (!activity.id) {
                const newActivity = {...activity, id: uuidv4()}
                await activityApi.create(newActivity);
                this.addActivity(newActivity);
            } else {
                createMode = false;
                await activityApi.update(activity.id, activity);
                this.editActivity(activity);
                this.setSelectedActivity(activity.id);
            }
            this.setError(null);
            this.setFormVisibility(false);

        } catch (e: any) {
            this.setError({
                title: 'Activities',
                message: createMode ? 'Failed to create new activity' : 'Failed to edit activity'
            })
        }
        this.setOperationsLoading(false);
    }

    deleteActivity = async (id: string) => {
        this.setOperationsLoading(true);
        try {
            await activityApi.delete(id);
            this.removeActivity(id);
            if (this.selectedActivity) this.setSelectedActivity(null);
            if (this.formVisibility) this.setFormVisibility(false);
            this.setError(null);
        } catch (e: any) {
            this.setError({title: 'Activities', message: 'Failed to delete activity'})
        }
        this.setOperationsLoading(false)
    }

    getActivitiesByDate = () => {
        return Array.from(this.activities.values())
            .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
    }

    setActivities = (activities: Activity[]) => {
        activities.forEach(activity => {
            activity.date = activity.date.split('T')[0];
            this.activities.set(activity.id, activity)
        })
    }

    addActivity = (activity: Activity) => {
        this.activities.set(activity.id, activity);
    }

    removeActivity = (id: string) => {
        this.activities.delete(id);
    }

    editActivity = (activity: Activity) => {
        this.activities.set(activity.id, activity);
    }

    setActivitiesLoading = (state: boolean) => {
        this.activitiesLoading = state;
    }

    setOperationsLoading = (state: boolean) => {
        this.operationsLoading = state;
    }

    setError = (err: Error | null) => {
        this.error = err
    }

    setSelectedActivity = (id: string | null) => {
        if (!id) this.selectedActivity = null;
        this.selectedActivity = this.activities.get(id!) ?? null;
    }

    setFormVisibility = (status: boolean) => {
        this.formVisibility = status;
    }
}