import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import {Outlet} from 'react-router-dom'
import PrivateRoute from './components/Routing/PrivateRoute';
import Home from "./components/GeneralScreens/Home"
import LoginScreen from "./components/AuthScreens/LoginScreen"
import RegisterScreen from "./components/AuthScreens/RegisterScreen"
import AddStory from './components/StoryScreens/AddStory';
import DetailStory from './components/StoryScreens/DetailStory';
import Header from './components/GeneralScreens/Header';
import NotFound from './components/GeneralScreens/NotFound';
import EditStory from './components/StoryScreens/EditStory';

const App = () => {

      return (
            <Router>

                  <div className="App">

                        <Routes>
                              <Route path="/" element={<LayoutsWithHeader />}>

                                    <Route path='*' element={<NotFound />} />

                                    <Route exact path='/' element={<PrivateRoute />}>
                                          <Route exact path='/' element={<Home />} />
                                    </Route>

                                    <Route exact path="/story/:slug" element={<DetailStory />} />

                                    <Route exact path='/addstory' element={<PrivateRoute />}>
                                          <Route exact path='/addstory' element={<AddStory />} />
                                    </Route>

                                    

                                    

                                    <Route exact path='/story/:slug/like' element={<PrivateRoute />}>
                                          <Route exact path='/story/:slug/like' element={<DetailStory />} />
                                    </Route>

                                    <Route exact path='/story/:slug/edit' element={<PrivateRoute />}>
                                          <Route exact path='/story/:slug/edit' element={<EditStory />} />
                                    </Route>

                                    <Route exact path='/story/:slug/delete' element={<PrivateRoute />}>
                                          <Route exact path='/story/:slug/delete' element={<DetailStory />} />
                                    </Route>
                                    <Route exact path='/story/:slug/addComment' element={<PrivateRoute />}>
                                          <Route exact path='/story/:slug/addComment' element={<DetailStory />} />
                                    </Route>
                                   
                                    

                              </Route>

                              <Route exact path="/login" element={<LoginScreen />} />
                              <Route exact path="/register" element={<RegisterScreen />} />


                             


                        </Routes>

                  </div>

            </Router>

      );

}

const LayoutsWithHeader =() => {
      return (
            <>
                  <Header />
                  <Outlet />
            </>
      );
}

export default App;
