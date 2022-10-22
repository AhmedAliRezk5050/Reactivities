import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { appBrowserHistory } from '../../routing/AppRouter';
import Activity from '../models/activity';
import { LoginData, User } from '../models/user';

axios.defaults.baseURL = 'http://localhost:5000/api';

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (config.headers && token) {
    config.headers['Authorization'] = `Bearer ${localStorage.getItem('user')}`;
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
          const validationErrors = response.data.validationErrors;
          const errors: string[] = [];

          if (validationErrors) {
            for (const key in validationErrors) {
              errors.push(...validationErrors[key]);
            }
            throw errors;
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
  add: (activity: Activity) => axios.post(activitiesBaseUrl, activity),
  edit: (activity: Activity) =>
    axios.put(makeActivityUrl(activity.id), activity),
  remove: (id: string) => axios.delete(makeActivityUrl(id)),
};

export const authApi = {
  login: (loginData: LoginData) =>
    axios.post<User>(`${authBaseUrl}/login`, loginData),
};

interface ResponseData {
  validationErrors?: ValidationErrors;
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

export interface FetchedActivity extends Omit<Activity, 'date'> {
  date: string;
}
