import React from 'react';
import './App.css';
import {LocalStorageService} from "./services";
import {useRoutes} from "react-router-dom";
import routes from './routes';

function App() {
  const token = LocalStorageService.getToken();
  const role = LocalStorageService.get('role');
  const isOrgAdmin = !!(role === 'org_admin');
  const isLoggedIn = (token && token != '')?true:false;
  const routing = useRoutes(routes(isLoggedIn, isOrgAdmin));
  return (
      <React.Fragment>
        {routing}
      </React.Fragment>
  );
}

export default App;
