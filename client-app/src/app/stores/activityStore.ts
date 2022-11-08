import { ActivityFormValues } from '../models/activity';
import { makeAutoObservable, runInAction, reaction } from 'mobx';
import Activity from '../models/activity';
import { activityApi, FetchedActivity } from '../api/agent';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { store } from './store';
import { UserProfile } from '../models/profile';
import { Pagination, PagingParams } from '../models/pagination';

interface Error {
  title: string;
  message: string;
}

export default class ActivityStore {
  activities: Map<string, Activity> = new Map();
  activity: Activity | null = null;
  activitiesLoading = true;
  activityLoading = true;
  toggleIsCanceledLoading = false;
  operationsLoading = false;
  attendanceLoading = false;
  error: Error | null = null;
  pagination: Pagination | null = null;
  pagingParams = new PagingParams();
  predicate = new Map().set('all', true);
  constructor() {
    makeAutoObservable(this);

    reaction(
      () => this.predicate.keys(),
      () => {
        this.activities.clear();
        this.setPagingParams(new PagingParams());
        this.fetchActivities();
      },
    );
  }

  fetchActivities = async () => {
    this.setActivitiesLoading(true);
    try {
      const response = await activityApi.list(this.axiosPagingParams);
      this.setActivities(response.data.data);
      this.setPagination(response.data.pagination);

      if (response.data.data.length === 0) {
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

  createActivity = async (formValues: ActivityFormValues) => {
    try {
      const newActivity = { ...formValues, id: uuidv4() };

      await activityApi.add(newActivity);

      const user = store.authStore.user!;
      const profile = new UserProfile(user);

      const dbCreatedActivity = {
        ...newActivity,
        date: newActivity.date!,
        hostUserName: user.userName,
        isHost: true,
        attendees: [profile],
        host: profile,
        isGoing: true,
      };

      this.addActivity({
        ...dbCreatedActivity,
      });

      runInAction(() => {
        this.activity = dbCreatedActivity;
      });
    } catch (e) {
      this.setError({
        title: 'Activities',
        message: 'Failed to create new activity',
      });
      throw e;
    }
  };

  updateActivity = async (formValues: ActivityFormValues) => {
    try {
      await activityApi.edit(formValues);
      const updateActivity = {
        ...this.activity!,
        ...formValues,
        date: formValues.date!,
      };
      this.editActivity(updateActivity);
    } catch (e) {
      this.setError({
        title: 'Activities',
        message: 'Failed to edit activity',
      });
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
      this.setActivity(fetchedActivity);
      this.setError(null);
      this.setActivityLoading(false);
      return this.activity;
    } catch (e) {
      this.setActivityLoading(false);
      this.setError({ title: 'Activity', message: 'Failed to fetch activity' });
    }
  };

  get activitiesByDate() {
    return Array.from(this.activities.values()).sort(
      (a, b) => b.date.getTime() - a.date.getTime(),
    );
  }

  updateAttendance = async () => {
    this.setAttendanceLoading(true);
    const user = store.authStore.user;

    try {
      await activityApi.attend(this.activity!.id);
      if (this.activity?.isGoing) {
        this.removeAttendee(user!.userName);
        this.setIsGoing(false);
      } else {
        this.addAttendee(new UserProfile(user!));
        this.setIsGoing(true);
      }
      this.editActivity(this.activity!);
    } catch (error) {
    } finally {
      this.setAttendanceLoading(false);
    }
  };

  cancelActivityToggle = async () => {
    this.setToggleIsCanceledLoading(true);
    try {
      await activityApi.attend(this.activity!.id);
      this.toggleActivityIsCancelled();
      this.editActivity(this.activity!);
    } catch (error) {
    } finally {
      this.setToggleIsCanceledLoading(false);
    }
  };

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
      this.activities.set(fetchedActivity.id, this.toActivity(fetchedActivity));
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
    this.activity = this.toActivity(fetchedActivity);
  };

  toActivity = (fetchedActivity: FetchedActivity) => {
    const user = store.authStore.user;
    const activity: Activity = {
      ...fetchedActivity,
      date: new Date(fetchedActivity.date + 'Z'),
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

  setAttendanceLoading = (state: boolean) => {
    this.attendanceLoading = state;
  };

  addAttendee = (profile: UserProfile) => {
    this.activity?.attendees?.push(profile);
  };

  removeAttendee = (username: string) => {
    this.activity!.attendees = this.activity?.attendees?.filter(
      (attendee) => attendee.userName !== username,
    );
  };

  setIsGoing = (state: boolean) => {
    this.activity!.isGoing = state;
  };

  toggleActivityIsCancelled = () => {
    this.activity!.isCancelled = !this.activity!.isCancelled;
  };

  setToggleIsCanceledLoading = (state: boolean) =>
    (this.toggleIsCanceledLoading = state);

  updateAttendeesFollowStatus = (username: string) => {
    this.activities.forEach((activity) => {
      activity.attendees?.forEach((attendee) => {
        if (attendee.userName === username) {
          attendee.isFollowing
            ? attendee.followersCount--
            : attendee.followersCount++;

          attendee.isFollowing = !attendee.isFollowing;
        }
      });
    });
  };

  setPagination = (pagination: Pagination) => (this.pagination = pagination);

  setPagingParams = (pagingParams: PagingParams) => {
    this.pagingParams = pagingParams;
  };

  get axiosPagingParams() {
    const params = new URLSearchParams();
    params.append('pageNumber', this.pagingParams.pageNumber.toString());
    params.append('pageSize', this.pagingParams.pageSize.toString());
    this.predicate.forEach((value, key) => {
      if (key === 'startDate') {
        params.append(key, (value as Date).toISOString());
      } else if (key !== 'all') {
        params.append(key, value);
      }
    });
    return params;
  }

  resetPredicate = () => {
    this.predicate.forEach((value, key) => {
      if (key !== 'startDate') {
        this.predicate.delete(key);
      }
    });
  };

  setPredicate = (key: string, value?: Date) => {
    switch (key) {
      case 'all':
        this.resetPredicate();
        this.predicate.set('all', true);
        break;
      case 'isGoing':
        this.resetPredicate();
        this.predicate.set('isGoing', true);
        break;
      case 'isHost':
        this.resetPredicate();
        this.predicate.set('isHost', true);
        break;
      case 'startDate':
        // delete to trigger change detection
        this.predicate.delete('startDate');
        this.predicate.set('startDate', value);
    }
  };
}
