import RootLayout from "./RootLayout/RootLayout";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "../../features/home/Home";
import ActivityList from "../../features/activities/dashboard/ActivityList";


const App = () => {
    return (
        <BrowserRouter>
            <RootLayout>
                <Routes>
                    <Route path='/' element={<Home/>}/>
                    <Route path='/activities' element={<ActivityList/>}/>
                </Routes>
            </RootLayout>
        </BrowserRouter>
    )
};

export default App;


// routes
// get activity        =>   /activities/:id
// edit activity     =>  /activities/:id/edit
// create activity     =>  /activities/create
// list activity     =>  /activities
// home