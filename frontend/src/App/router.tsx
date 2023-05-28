import {createBrowserRouter} from "react-router-dom";

import {PrivateRoute} from "./PrivateRoute";

import {User} from "../pages/user";
import {Login} from "../pages/login";
import {Admin} from "../pages/admin";
import {UploadData} from "../pages/uploadData";
import {OutOfRouter} from "./OutOfRouter";
import {Registration} from "../pages/registration";
import {Recommendation} from "../pages/recommendation";

import {ErrorModal} from "../shared/error";

const router = createBrowserRouter([
    {
        path: "/",
        element: <PrivateRoute/>,
        errorElement: <ErrorModal/>,
        children: [
            {
                path: '/recommendation',
                element: <User/>
            },
            {
                path: '/learn_model',
                element: <Admin/>
            },
            {
                path: '/learn-model/upload',
                element: <UploadData/>
            },
            {
                path: '/recommendation/:id',
                element: <Recommendation/>
            }
        ]
    },
    {
        path: '/registration',
        element: <Registration/>
    },
    {
        path: '/login',
        element: <Login/>
    },
    {
        path: '*',
        element: <OutOfRouter/>
    },
]);

export default router;