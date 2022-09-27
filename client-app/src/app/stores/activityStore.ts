import {makeAutoObservable} from "mobx";
import Activity from "../models/activity";
import {activityApi} from "../api/agent";

interface Error {
    title: string;
    message: string
}


export default class ActivityStore {
    activities: Activity[] = [];
    selectedActivity: Activity | null = null;
    activitiesLoading: boolean = true;
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
            this.setActivities(activitiesFromDb.map(a => {
                a.date = a.date.split('T')[0];
                return a;
            }))

            if (activitiesFromDb.length === 0) {
                this.setError({title: 'Activities', message: 'No activities found'});
            }
        } catch (e: any) {
            this.setError({title: 'Activities', message: 'Failed to load activities'});
        }
        this.setActivitiesLoading(false);
    }

    setActivities(activities: Activity[]) {
        this.activities = activities;
    }

    setActivitiesLoading = (state: boolean) => {
        this.activitiesLoading = state;
    }

    setError = (err: Error | null) => {
        this.error = err
    }

    setSelectedActivity = (id: string | null) => {
        if (!id) this.selectedActivity = null;
        this.selectedActivity = this.activities.find(a => a.id === id) ?? null;
    }


    setFormVisibility = (status: boolean) => {
        this.formVisibility = status;
    }
}