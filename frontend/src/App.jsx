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
import HealthPage from "./pages/HealthPage";

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{}}
        containerStyle={{
          top: "var(--toast-top)",
          // Align with the right edge of the page content column
          // (max-width 1200px, centered in the space after the sidebar)
          // instead of the raw viewport edge.
          right:
            "calc(var(--space-6) + max(0px, 100vw - var(--sidebar-width) - 64px - 1200px) / 2)",
        }}
      />
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
          <Route path="/health" element={<HealthPage />} />
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
