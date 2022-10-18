import RootLayout from './RootLayout/RootLayout';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from '../../features/home/Home';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import NotFound from '../../features/errors/not-found/NotFound';

import { createBrowserHistory } from 'history';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/activities' element={<RootLayout />}>
          <Route index element={<ActivityDashboard />} />
          <Route path='create' element={<ActivityForm />} />
          <Route path='not-found' element={<NotFound />} />
          <Route path=':id' element={<ActivityDetails />} />
          <Route path=':id/edit' element={<ActivityForm />} />
        </Route>

        <Route
          path='*'
          element={<Navigate to='/activities/not-found' replace />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
