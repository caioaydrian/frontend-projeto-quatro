import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { Home, Register, Login, Dashboard, Users, Drinks, Categories, Profile, Menu } from "./pages";
import { MainLayout, AdminLayout, ProtectedLayout, AuthRequiredLayout } from "./layouts";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "menu", element: <Menu /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
      {
        element: <AuthRequiredLayout />,
        children: [{ path: "profile", element: <Profile /> }],
      },
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
          { path: "profile", element: <Profile /> },
        ],
      },
    ],
  },
  { path: "/dashboard", element: <Navigate to="/admin" replace /> },
]);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
