import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";
import styles from "./MainLayout.module.css";
import {
  FiGrid,
  FiCheckSquare,
  FiCreditCard,
  FiUser,
  FiShield,
  FiLogOut,
  FiTrendingUp,
  FiActivity,
} from "react-icons/fi";
import logo from "../../assets/logo.png";
import Modal from "../common/Modal";
import { useModal } from "../../hooks/useModal";
import modalStyles from "../common/Modal.module.css";

function Sidebar() {
  const { logout, isAdmin } = useAuth();
  const {
    isOpen: isLogoutModalOpen,
    openModal: openLogoutModal,
    closeModal: closeLogoutModal,
  } = useModal();

  const handleLogoutConfirm = () => {
    closeLogoutModal();
    logout();
    toast.success("You have been logged out.");
  };

  return (
    <>
      <aside className={styles.sidebar}>
        <Link to="/" className={styles.logoContainer}>
          <img src={logo} alt="RisenCore Logo" className={styles.logoImage} />
          <span className={styles.logoText}>RisenCore</span>
        </Link>

        <nav className={styles.nav}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
            end
          >
            <FiGrid className={styles.icon} /> <span>Dashboard</span>
          </NavLink>
          <NavLink
            to="/tasks"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            <FiCheckSquare className={styles.icon} /> <span>Tasks</span>
          </NavLink>
          <NavLink
            to="/finance"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            <FiCreditCard className={styles.icon} /> <span>Finance</span>
          </NavLink>
          <NavLink
            to="/habits"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            <FiTrendingUp className={styles.icon} /> <span>Habits</span>
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            <FiUser className={styles.icon} /> <span>Profile</span>
          </NavLink>
          <NavLink
            to="/health"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            <FiActivity className={styles.icon} /> <span>Health</span>
          </NavLink>
          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              <FiShield className={styles.icon} /> <span>Admin Panel</span>
            </NavLink>
          )}
        </nav>

        <button onClick={openLogoutModal} className={styles.logoutButton}>
          <FiLogOut className={styles.icon} /> <span>Logout</span>
        </button>
      </aside>

      <Modal
        isOpen={isLogoutModalOpen}
        onClose={closeLogoutModal}
        title="Confirm Logout"
        actions={
          <>
            <button
              className={modalStyles.actionButton}
              onClick={closeLogoutModal}
            >
              Cancel
            </button>
            <button
              className={`${modalStyles.actionButton} ${modalStyles.confirmButton}`}
              onClick={handleLogoutConfirm}
            >
              Logout
            </button>
          </>
        }
      >
        <p>Are you sure you want to log out?</p>
      </Modal>
    </>
  );
}

export default Sidebar;
