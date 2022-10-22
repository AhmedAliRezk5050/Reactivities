import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import 'react-calendar/dist/Calendar.css';
import './app/layout/styles.css';
import App from './app/layout/App';
import { store, StoreContext } from './app/stores/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-datepicker/dist/react-datepicker.css';
import AppModal from './app/layout/modals/AppModal';

ReactDOM.render(
  <StoreContext.Provider value={store}>
    <App />
    <AppModal />
    <ToastContainer position='bottom-right' hideProgressBar />
  </StoreContext.Provider>,
  document.getElementById('root'),
);
