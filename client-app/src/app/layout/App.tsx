import RootLayout from "./RootLayout/RootLayout";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Home from "../../features/home/Home";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
import NotFound from "../../features/not-found/NotFound";


const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<RootLayout/>}>
                    <Route index element={<Home/>}/>
                    <Route path='/activities' element={<ActivityDashboard/>}/>
                    <Route path='/activities/:id' element={<ActivityDetails />}/>
                    <Route path='/activities/create' element={<ActivityForm />}/>
                    <Route path='/not-found' element={<NotFound />}/>
                    <Route path='*' element={<Navigate to='/not-found'  replace/>}/>
                </Route>

            </Routes>
        </BrowserRouter>
    )
};

export default App;