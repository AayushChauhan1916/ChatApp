import React from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import RegisterUser from "../pages/RegisterUser";
import CheckEmail from "../pages/CheckEmail";
import CheckPassword from "../pages/CheckPassword";
import Message from "../components/Message";
import Home from "../pages/Home";
import AuthLayout from "../Layout/AuthLayout";
import WrongPath from "../components/WrongPath";
import ProctectedRoute from "../helpers/ProctectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "register",
        element: (
          <AuthLayout>
            <RegisterUser></RegisterUser>
          </AuthLayout>
        ),
      },
      {
        path: "checkemail",
        element: (
          <AuthLayout>
            <CheckEmail></CheckEmail>
          </AuthLayout>
        ),
      },
      {
        path: "checkpassword",
        element: (
          <AuthLayout>
            <CheckPassword></CheckPassword>
          </AuthLayout>
        ),
      },
      {
        path: "/",
        element: (
          <ProctectedRoute>
            <Home></Home>
          </ProctectedRoute>
        ),
        children: [
          {
            path: ":userId",
            element: (
              <ProctectedRoute>
                <Message></Message>
              </ProctectedRoute>
            ),
          },
        ],
      },
      {
        path: "/wrong",
        element: <WrongPath />,
      },
    ],
  },
]);

export default router;
