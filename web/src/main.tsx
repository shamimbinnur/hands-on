import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { BrowserRouter, Route, Routes } from "react-router";

import Profile from "./pages/Profile.tsx";
import Register from "./pages/Register.tsx";
import LoginPage from "./pages/Login.tsx";
import EventsPage from "./pages/Events.tsx";
import Home from "./pages/Home.tsx";

import ProtectedRoutes from "./utils/ProtectedRoutes.tsx";
import "./index.css";
import { Navbar } from "./components/common/Navbar.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/events" element={<EventsPage />} />

        <Route element={<ProtectedRoutes />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
