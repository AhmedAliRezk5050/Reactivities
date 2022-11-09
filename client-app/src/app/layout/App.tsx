import RootLayout from "./RootLayout/RootLayout";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "../../features/home/Home";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
import NotFound from "../../features/errors/not-found/NotFound";
import AppRouter from "../../routing/AppRouter";
import ProfilePage from "../../features/profiles/ProfilePage";
import AppModal from "./modals/AppModal";
import { ToastContainer } from "react-toastify";
import React from "react";
import ScrollToTop from "./ScrollToTop";

const App = () => {
  return (
    <>
      <AppModal />
      <ToastContainer position="bottom-right" hideProgressBar />
      <AppRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/*" element={<RootLayout />}>
            <Route path="activities" element={<ActivityDashboard />} />
            <Route path="activities/create" element={<ActivityForm />} />
            <Route path="activities/not-found" element={<NotFound />} />
            <Route path="activities/:id" element={<ActivityDetails />} />
            <Route path="activities/:id/edit" element={<ActivityForm />} />
            <Route path="profiles/:username" element={<ProfilePage />} />
            <Route path="not-found" element={<NotFound />} />
            <Route path="*" element={<Navigate to="not-found" replace />} />
          </Route>
        </Routes>
      </AppRouter>
    </>
  );
};

export default App;
