import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { Home, Register, Login, Dashboard, Users, Drinks, Categories } from "./pages";
import { MainLayout, AdminLayout, ProtectedLayout } from "./layouts";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
    ],
  },
  {
    path: "/admin",
    element: <ProtectedLayout />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "users", element: <Users /> },
          { path: "drinks", element: <Drinks /> },
          { path: "categories", element: <Categories /> },
        ],
      },
    ],
  },
  { path: "/dashboard", element: <Navigate to="/admin" replace /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
