import { makeAutoObservable } from 'mobx';
import Activity from '../models/activity';
import { activityApi } from '../api/agent';
import { v4 as uuidv4 } from 'uuid';
import { dateToString, stringToDate } from '../../utilities';

interface Error {
  title: string;
  message: string;
}

export default class ActivityStore {
  activities: Map<string, Activity> = new Map();
  activity: Activity | null = null;
  activitiesLoading = true;
  activityLoading = true;
  operationsLoading = false;
  error: Error | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  fetchActivities = async () => {
    this.setActivitiesLoading(true);
    try {
      const { data: activitiesFromDb } = await activityApi.getAll();
      this.setActivities(
        activitiesFromDb.map((a) => ({ ...a, date: dateToString(a.date) })),
      );

      if (activitiesFromDb.length === 0) {
        this.setError({ title: 'Activities', message: 'No activities found' });
      }
    } catch (e: any) {
      this.clearActivities();
      this.setError({
        title: 'Activities',
        message: 'Failed to load activities',
      });
    }
    this.setActivitiesLoading(false);
  };

  upsertActivity = async (activity: Activity) => {
    let createMode = true;
    this.setOperationsLoading(true);
    try {
      debugger;
      if (!activity.id) {
        const newActivity = { ...activity, id: uuidv4() };
        await activityApi.create({
          ...newActivity,
          date: stringToDate(newActivity.date),
        });
        this.addActivity(newActivity);
      } else {
        createMode = false;
        await activityApi.update(activity.id, {
          ...activity,
          date: stringToDate(activity.date),
        });
        this.editActivity(activity);
        // this.setSelectedActivity(activity.id);
      }
      this.setError(null);
    } catch (e: any) {
      this.setError({
        title: 'Activities',
        message: createMode
          ? 'Failed to create new activity'
          : 'Failed to edit activity',
      });
    }
    this.setOperationsLoading(false);
  };

  deleteActivity = async (id: string) => {
    this.setOperationsLoading(true);
    try {
      await activityApi.delete(id);
      this.removeActivity(id);
      this.setError(null);
    } catch (e: any) {
      this.setError({
        title: 'Activities',
        message: 'Failed to delete activity',
      });
    }
    this.setOperationsLoading(false);
  };

  fetchActivity = async (id: string) => {
    this.setActivityLoading(true);
    try {
      const localActivity = false;

      if (localActivity) {
        this.setActivity(localActivity);
      } else {
        const { data: fetchedActivity } = await activityApi.get(id);

        if (!fetchedActivity) throw new Error('Activity not found');

        this.setActivity({
          ...fetchedActivity,
          date: dateToString(fetchedActivity.date),
        });
      }
      this.setError(null);
    } catch (e) {
      this.setError({ title: 'Activity', message: 'Failed to fetch activity' });
    }
    this.setActivityLoading(false);
  };

  get activitiesByDate() {
    return Array.from(this.activities.values()).sort(
      (a, b) => Date.parse(b.date) - Date.parse(a.date),
    );
  }

  get groupedActivities() {
    return Object.entries(
      this.activitiesByDate.reduce(
        (prev: { [key: string]: Activity[] }, cur) => {
          if (!prev[cur.date]) {
            prev[cur.date] = [];
          }

          prev[cur.date].push(cur);
          return prev;
        },
        {},
      ),
    );
  }

  setActivities = (activities: Activity[]) => {
    activities.forEach((activity) => {
      this.activities.set(activity.id, activity);
    });
  };

  addActivity = (activity: Activity) => {
    this.activities.set(activity.id, activity);
  };

  removeActivity = (id: string) => {
    this.activities.delete(id);
  };

  editActivity = (activity: Activity) => {
    this.activities.set(activity.id, activity);
  };

  clearActivities = () => {
    this.activities.size > 0 && this.activities.clear();
  };

  setActivityLoading = (state: boolean) => {
    this.activityLoading = state;
  };

  setActivitiesLoading = (state: boolean) => {
    this.activitiesLoading = state;
  };

  setOperationsLoading = (state: boolean) => {
    this.operationsLoading = state;
  };

  setError = (err: Error | null) => {
    this.error = err;
  };

  setActivity = (activity: Activity | null) => {
    this.activity = activity;
  };
}
