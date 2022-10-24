import { makeAutoObservable } from 'mobx';
import Activity from '../models/activity';
import { activityApi, FetchedActivity } from '../api/agent';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { store } from './store';

interface Error {
  title: string;
  message: string;
}

interface UpsertActivity extends Omit<Activity, 'id'> {
  id?: string;
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
      const { data: activitiesFromDb } = await activityApi.list();
      this.setActivities(activitiesFromDb);

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

  upsertActivity = async (activity: UpsertActivity) => {
    let createMode = true;
    this.setOperationsLoading(true);
    try {
      if (!activity.id) {
        const newActivity = { ...activity, id: uuidv4() };
        await activityApi.add(newActivity);
        this.addActivity(newActivity);
      } else {
        createMode = false;
        const updatedActivity = { ...activity, id: activity.id };
        await activityApi.edit(updatedActivity);
        this.editActivity(updatedActivity);
      }
      this.setError(null);
      this.setOperationsLoading(false);
    } catch (e: any) {
      this.setError({
        title: 'Activities',
        message: createMode
          ? 'Failed to create new activity'
          : 'Failed to edit activity',
      });
      this.setOperationsLoading(false);
      throw e;
    }
  };

  deleteActivity = async (id: string) => {
    this.setOperationsLoading(true);
    try {
      await activityApi.remove(id);
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
      const { data: fetchedActivity } = await activityApi.details(id);

      if (!fetchedActivity) throw new Error('Activity not found');

      this.setActivity(fetchedActivity);

      this.setError(null);
    } catch (e) {
      this.setError({ title: 'Activity', message: 'Failed to fetch activity' });
    }
    this.setActivityLoading(false);
  };

  get activitiesByDate() {
    return Array.from(this.activities.values()).sort(
      (a, b) => b.date.getTime() - a.date.getTime(),
    );
  }

  get groupedActivities() {
    return Object.entries(
      this.activitiesByDate.reduce(
        (prev: { [key: string]: Activity[] }, cur) => {
          const dateAsString = format(cur.date, 'dd MMM yyy');
          if (!prev[dateAsString]) {
            prev[dateAsString] = [];
          }

          prev[dateAsString].push(cur);
          return prev;
        },
        {},
      ),
    );
  }

  setActivities = (fetchedActivities: FetchedActivity[]) => {
    fetchedActivities.forEach((fetchedActivity) => {
      const x = this.foo(fetchedActivity);
      debugger;
      this.activities.set(fetchedActivity.id, x);
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

  setActivity = (fetchedActivity: FetchedActivity) => {
    this.activity = this.foo(fetchedActivity);
  };

  foo = (fetchedActivity: FetchedActivity) => {
    const user = store.authStore.user;

    const activity: Activity = {
      ...fetchedActivity,
      date: new Date(fetchedActivity.date),
    };

    if (user) {
      activity.isGoing = activity.attendees?.some(
        (attendee) => attendee.userName === user.userName,
      );
      activity.isHost = activity.hostUserName === user.userName;
      activity.host = activity.attendees?.find(
        (attendee) => attendee.userName === activity.hostUserName,
      );
    }
    return activity;
  };
}
