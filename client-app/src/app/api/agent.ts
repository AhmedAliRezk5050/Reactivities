import { Photo, Profile, FetchedUserActivity } from '../models/profile';
import { ActivityFormValues } from '../models/activity';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { appBrowserHistory } from '../../routing/AppRouter';
import Activity from '../models/activity';
import { LoginData, RegisterData, User } from '../models/user';
import { PaginatedResult } from '../models/pagination';
import { store } from '../stores/store';
axios.defaults.baseURL = process.env.REACT_APP_API_URL;

const sleep = (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (config.headers && token) {
    config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
  }
  return config;
});

axios.interceptors.response.use(
  async (response) => {
    if (process.env.NODE_ENV === 'development') await sleep(1000);
    const pagination = response.headers['pagination'];

    if (pagination) {
      response.data = new PaginatedResult(
        response.data,
        JSON.parse(pagination),
      );
      return response;
    }

    return response;
  },
  (error: AxiosError<ResponseData>) => {
    const { response } = error;
    const status = response?.status;
    let errorMessage = 'Unkown Error occured';
    if (response && status) {
      switch (status) {
        case 400:
          const { validationErrors, errors } = response.data;
          const errsArray: string[] = [];
          let errsObject: ValidationErrors | null = null;

          if (validationErrors) {
            errsObject = {};
            errsObject = { ...errsObject, ...validationErrors };
          }

          if (errors) {
            if (!errsObject) {
              errsObject = {};
            }
            errsObject = { ...errsObject, ...errors };
          }

          if (errsObject) {
            for (const key in errsObject) {
              errsArray.push(...errsObject[key]);
            }
            throw errsArray;
          }
          errorMessage = 'Bad request';
          break;
        case 401:
          if (response.headers['www-authenticate'].includes('invalid_token')) {
            store.authStore.logout();
            errorMessage = 'Session expired - please login again';
          } else {
            errorMessage = 'Unauthorized';
            appBrowserHistory.replace('/');
          }

          break;
        case 404:
          errorMessage = 'Not found';
          appBrowserHistory.replace('/not-found');
          break;
      }
    }
    toast.error(errorMessage);
    return Promise.reject(error);
  },
);

const activitiesBaseUrl = '/activities';

const authBaseUrl = '/account';

const makeActivityUrl = (id: string) => `${activitiesBaseUrl}/${id}`;

export const activityApi = {
  list: (params: URLSearchParams) =>
    axios.get<PaginatedResult<FetchedActivity[]>>(activitiesBaseUrl, {
      params,
    }),
  details: (id: string) => axios.get<FetchedActivity>(makeActivityUrl(id)),
  add: (activity: ActivityFormValues) =>
    axios.post(activitiesBaseUrl, activity),
  edit: (activity: ActivityFormValues) =>
    axios.put(makeActivityUrl(activity.id!), activity),
  remove: (id: string) => axios.delete(makeActivityUrl(id)),
  attend: (id: string) =>
    axios.post(`${makeActivityUrl(id)}/update-attendance`),
};

export const authApi = {
  login: (loginData: LoginData) =>
    axios.post<User>(`${authBaseUrl}/login`, loginData),
  register: (registerData: RegisterData) =>
    axios.post<User>(`${authBaseUrl}/register`, registerData),
  fbLogin: (accessToken: string) =>
    axios.post<User>(`${authBaseUrl}/fbLogin?accessToken=${accessToken}`),
  refreshToken: () => axios.post<User>(`${authBaseUrl}/refreshToken`),
};

export const profilesApi = {
  get: (username: string) => axios.get<Profile>(`/profiles/${username}`),
  uploadPhoto: (file: Blob) => {
    let formData = new FormData();
    formData.append('File', file);
    return axios.post<Photo>('/photos', formData);
  },
  setMainPhoto: (photoId: string) => axios.post(`/photos/${photoId}/setMain`),
  delete: (photoId: string) => axios.delete(`/photos/${photoId}`),
  update: (displayName: string, bio?: string) =>
    axios.put(`/profiles`, { displayName, bio }),
  updateFollowStatus: (username: string) => axios.post(`/follow/${username}`),
  listFollowings: (username: string, predicate: string) =>
    axios.get<Profile[]>(`/follow/${username}?predicate=${predicate}`),
  listActivities: (username: string, predicate?: string) =>
    axios.get<FetchedUserActivity[]>(`/profiles/${username}/activities`, {
      params: {
        predicate,
      },
    }),
};

interface ResponseData {
  validationErrors?: ValidationErrors;
  errors?: ValidationErrors;
  type?: string;
  title?: string;
  status?: number;
  traceId?: string;
  details?: string;
  statusCode?: number;
}

interface ValidationErrors {
  [key: string]: string[];
}

export interface FetchedActivity
  extends Omit<Activity, 'date' | 'isGoing' | 'isHost' | 'host'> {
  date: string;
}
