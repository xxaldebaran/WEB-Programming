import React from 'react';
import {BrowserRouter as Router,Route,Redirect,Switch} from 'react-router-dom';
import Users from './user/pages/Users';
import NewCertificate from 'D:/OneDrive/vu uni/web programming/front end/src/places/pages/NewCertificate.jsx';
import UserCertificates from 'D:/OneDrive/vu uni/web programming/front end/src/places/pages/UserCertificates.jsx';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import Auth from './user/pages/Auth';
import UpdateCertificate from 'D:/OneDrive/vu uni/web programming/front end/src/places/pages/UpdateCertificate.jsx';
import { AuthContext } from './shared/context/auth-context';
import {useAuth} from './shared/hooks/auth-hook';

//let logoutTimer;

// 
const App = () => {
  const { token, login, logout, userId } = useAuth();

  let routes;

  if (token) {
    //if the user is logged in, show these routes
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/certificates" exact>
          <UserCertificates />
        </Route>
        <Route path="/certificates/new" exact>
          <NewCertificate />
        </Route>
        <Route path="/certificates/:certificateId">
          <UpdateCertificate />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    //if the user is not logged in, show these routes
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/certificates" exact>
          <UserCertificates />
        </Route>
        <Route path="/auth">
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    //provide authentication context to child components
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout
      }}
    >
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;