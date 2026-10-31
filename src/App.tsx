import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home, Register, Login } from "./pages";
import { MainLayout } from "./layouts";

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
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
