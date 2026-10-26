import { Outlet, ScrollRestoration } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";

export function MainLayout() {
  return (
    <>
      <ScrollRestoration />
      <Header />

      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  );
}
