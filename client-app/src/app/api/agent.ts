import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { appBrowserHistory } from '../../routing/AppRouter';
import Activity from '../models/activity';

axios.defaults.baseURL = 'http://localhost:5000/api';

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

const baseUrl = '/activities';

const makeActivityUrl = (id: string) => `${baseUrl}/${id}`;

export const activityApi = {
  list: () => axios.get<Activity[]>(baseUrl),
  details: (id: string) => axios.get<Activity>(makeActivityUrl(id)),
  add: (activity: ApiActivity) => axios.post(baseUrl, activity),
  edit: (activity: ApiActivity) =>
    axios.put(makeActivityUrl(activity.id), activity),
  remove: (id: string) => axios.delete(makeActivityUrl(id)),
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

interface ApiActivity extends Omit<Activity, 'date'> {
  date: Date;
}
