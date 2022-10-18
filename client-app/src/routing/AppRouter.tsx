import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { FC } from 'react';

export const appBrowserHistory = createBrowserHistory({ window });

interface Props {
  children: React.ReactNode;
}

const AppRouter: FC<Props> = ({ children }) => (
  <HistoryRouter history={appBrowserHistory}>{children}</HistoryRouter>
);

export default AppRouter;
