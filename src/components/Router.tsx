import { createBrowserRouter } from "react-router-dom";
import ApplicationsList from "../pages/AppLicationListPage/ApplicationsList";
import LoginForm from "../pages/Login";
import PrivateRoute from "./PrivateRoute";
import ApplicationDetails from "../pages/ApplicationDetails/ApplicationDetailsPage";
import EditAppForm from "../pages/editApplication/EditApp";
import AddAppForm from "../pages/addApplication/AddApp";






const router = createBrowserRouter(
    [
      {
        path: '/login',
        element: <LoginForm />,
        index: true
      },
      {
        element: <PrivateRoute  />,
        children: [
          {
            path: '/apps',
            element: <ApplicationsList />,
        },
        {
          path:"/apps/add",
          element: <AddAppForm />
      },
        {
            path:"/apps/:id",
            element: <ApplicationDetails/>
        },
        
        {
          path:"/apps/:id/edit",
          element: <EditAppForm/>
      },
          
          
          
           
        ]
      },
      {
        path: '*',
        element: <p>404 Error - Nothing here...</p>
      }
    ]
  );
  

  export default router;