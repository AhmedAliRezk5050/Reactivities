import { Profile } from './../models/profile';
import { ActivityFormValues } from './../models/activity';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { appBrowserHistory } from '../../routing/AppRouter';
import Activity from '../models/activity';
import { LoginData, RegisterData, User } from '../models/user';

axios.defaults.baseURL = 'http://localhost:5000/api';

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (config.headers && token) {
    config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
  }
  return config;
});

axios.interceptors.response.use(
  (response) => response,
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
          errorMessage = 'Unauthorized';
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
  list: () => axios.get<FetchedActivity[]>(activitiesBaseUrl),
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
};

export const profilesApi = {
  get: (username: string) => axios.get<Profile>(`/profiles/${username}`),
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
