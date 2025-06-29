import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store.js";
import Home from "./pages/Home.jsx";
import Signup from "./pages/Signup.jsx"
import Login from "./pages/Login.jsx";
import { AuthLayout } from "./components/index.js";
import AddAccount from "./pages/Admin/AddAccount.jsx";
import Dashboard from "./pages/Admin/Dashboard.jsx";
import AllAccounts from "./pages/Admin/AllAccounts.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home/>
      },
      {
        path: "/register",
        element: (
          <AuthLayout authentication={false}>
            <Signup/>
          </AuthLayout>
        )
      },
      {
        path: "/login",
        element: (
          <AuthLayout authentication={false}>
            <Login/>
          </AuthLayout>
        )
      },
      {
        path: "/add-account",
        element: (
          <AuthLayout authentication>
            <AddAccount/>
          </AuthLayout>
        )
      },
      {
        path: "/dashboard",
        element: (
          <AuthLayout authentication>
            <Dashboard/>
          </AuthLayout>
        )
      },
      {
        path: "/all-accounts",
        element: (
          <AuthLayout authentication>
            <AllAccounts/>
          </AuthLayout>
        )
      }
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
