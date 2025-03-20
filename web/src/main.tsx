import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import "./index.css";

import Profile from "./pages/Profile.tsx";

import Register from "./pages/Register.tsx";
import LoginPage from "./pages/Login.tsx";

import EventsPage from "./pages/Events.tsx";
import EventPage from "./pages/EventDetailsPage.tsx";

import Help from "./pages/help/Help.tsx";
import HelpDetails from "./pages/help/HelpDetails.tsx";

import { Navbar } from "./components/common/Navbar.tsx";
import ProtectedRoutes from "./utils/ProtectedRoutes.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="help" />} />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/event" element={<EventsPage />} />
        <Route path="/event/:id" element={<EventPage />} />

        <Route path="/help/" element={<Help />} />
        <Route path="/help-requests/:id" element={<HelpDetails />} />

        <Route element={<ProtectedRoutes />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
