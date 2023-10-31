import {AppLayout, AuthLayout} from "./pages/layouts";
import { Navigate, Outlet } from 'react-router-dom';
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/Signup";
import {Home} from "./pages/app";

const routes = (isLoggedIn: boolean, isOrgAdmin: boolean) => [
    {
        path: '/app',
        element: isLoggedIn ? <AppLayout isOrgAdmin={isOrgAdmin}/> : <Navigate to={'/login'}/>,
        children: [
            {path: '/app/home', element: isOrgAdmin ? <Home/> : <Navigate to={'/app/files/'}/>},
            // {path: '/app/files/:folder', element: <Files/>}
        ]
    },{
        path: '/',
        element: !isLoggedIn ? <AuthLayout/> : <Navigate to={'/app/home'}/>,
        children: [
            {path: 'login', element: <Login/>},
            {path: 'signup', element: <SignUp/>},
            {path: '/', element: <Navigate to={'/login'}/>}
        ]
    }
]

export default routes;
