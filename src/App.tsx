import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home, Register, Login, Dashboard } from "./pages";
import { MainLayout, ProtectedLayout } from "./layouts";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
      {
        element: <ProtectedLayout />,
        children: [{ path: "dashboard", element: <Dashboard /> }],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
