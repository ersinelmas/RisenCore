import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminPage from "./pages/AdminPage";
import TasksPage from "./pages/TasksPage";
import ProfilePage from "./pages/ProfilePage";
import FinancePage from "./pages/FinancePage";
import HabitsPage from "./pages/HabitsPage";
import WeeklyReviewPage from "./pages/WeeklyReviewPage";

function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{}} />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected User Routes (wrapped by MainLayout via ProtectedRoute) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/finance" element={<FinancePage />} />
          <Route path="/habits" element={<HabitsPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* 2. Yeni route'u korumalı alanın içine ekle */}
          <Route path="/weekly-review" element={<WeeklyReviewPage />} />
        </Route>

        {/* Protected Admin Routes (also wrapped by MainLayout) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>
        </Route>
      </Routes>
      <Analytics />
    </>
  );
}

export default App;
