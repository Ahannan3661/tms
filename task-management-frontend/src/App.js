import TaskList from './tasks/TaskList';
import UpdateTask from './tasks/UpdateTask';
import Signup from './tasks/Signup';
import Signin from './tasks/Signin.js';
import Overview from './overview/Overview';
import './App.css';
import Navigation from './navigation/Navigation';
import React from 'react';
import PublicRoute from "./tasks/PublicRoute";
import PrivateRoute from "./tasks/PrivateRoute";
import AdminHome from "./tasks/AdminHome";
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
//<Route path ="/" element={<PublicRoute component={Signin}/>}/>
function App() {
  return (
    <>
    <div className="App">
    <Router>
      <Navigation/>
      <Switch>
          <PublicRoute restricted={false} component={Signup} path="/signup" exact />
          <PublicRoute restricted={false} component={Signin} path="/" exact />
          <PrivateRoute component={AdminHome} path="/adminhome" exact />
          <PrivateRoute component={TaskList} path="/home" exact />
          <PrivateRoute component={Overview} path="/overview" exact />
          <PrivateRoute component={UpdateTask} path="/update/:taskId" exact />
      </Switch>
    </Router>
    </div>
    </>
  );
}

export default App;
