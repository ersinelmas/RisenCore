import {
  FiGrid,
  FiCheckSquare,
  FiCreditCard,
  FiUser,
  FiShield,
  FiTrendingUp,
  FiActivity,
  FiCpu,
} from "react-icons/fi";

export const NAV_LINKS = [
  { to: "/", icon: FiGrid, labelKey: "sidebar.dashboard", end: true },
  { to: "/tasks", icon: FiCheckSquare, labelKey: "sidebar.tasks" },
  { to: "/habits", icon: FiTrendingUp, labelKey: "sidebar.habits" },
  { to: "/finance", icon: FiCreditCard, labelKey: "sidebar.finance" },
  { to: "/health", icon: FiActivity, labelKey: "sidebar.health" },
  { to: "/weekly-review", icon: FiCpu, labelKey: "sidebar.weeklyReview", variant: "ai" },
  { to: "/profile", icon: FiUser, labelKey: "sidebar.profile" },
];

export const ADMIN_LINK = { to: "/admin", icon: FiShield, labelKey: "sidebar.adminPanel" };
