import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";
import styles from "./Navbar.module.css";
import mainStyles from "./MainLayout.module.css";
import logo from "../../assets/logo.png";
import {
  FiMenu,
  FiX,
  FiGrid,
  FiCheckSquare,
  FiCreditCard,
  FiTrendingUp,
  FiUser,
  FiShield,
  FiLogOut,
} from "react-icons/fi";
import Modal from "../common/Modal";
import { useModal } from "../../hooks/useModal";
import modalStyles from "../common/Modal.module.css";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout, isAdmin } = useAuth();

  const {
    isOpen: isLogoutModalOpen,
    openModal: openLogoutModal,
    closeModal: closeLogoutModal,
  } = useModal();

  const handleLogoutClick = () => {
    setIsMenuOpen(false);
    openLogoutModal();
  };

  const handleLogoutConfirm = () => {
    closeLogoutModal();
    logout();
    toast.success("You have been logged out.");
  };

  return (
    <>
      <header className={styles.navbar}>
        <Link to="/" className={styles.logoLink}>
          <img src={logo} alt="RisenCore Logo" className={styles.logoImage} />
          <span className={styles.logoText}>RisenCore</span>
        </Link>
        <button
          onClick={() => setIsMenuOpen(true)}
          className={styles.hamburgerButton}
        >
          <FiMenu />
        </button>
      </header>

      <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.open : ""}`}>
        <div className={styles.menuHeader}>
          <Link
            to="/"
            className={styles.logoLink}
            onClick={() => setIsMenuOpen(false)}
          >
            <img src={logo} alt="RisenCore Logo" className={styles.logoImage} />
            <span className={styles.logoText}>RisenCore</span>
          </Link>
          <button
            onClick={() => setIsMenuOpen(false)}
            className={styles.closeButton}
          >
            <FiX />
          </button>
        </div>

        <div className={styles.scrollableNav}>
          <nav className={mainStyles.nav} onClick={() => setIsMenuOpen(false)}>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? `${mainStyles.navLink} ${mainStyles.active}`
                  : mainStyles.navLink
              }
              end
            >
              <FiGrid className={mainStyles.icon} /> <span>Dashboard</span>
            </NavLink>
            <NavLink
              to="/tasks"
              className={({ isActive }) =>
                isActive
                  ? `${mainStyles.navLink} ${mainStyles.active}`
                  : mainStyles.navLink
              }
            >
              <FiCheckSquare className={mainStyles.icon} /> <span>Tasks</span>
            </NavLink>
            <NavLink
              to="/finance"
              className={({ isActive }) =>
                isActive
                  ? `${mainStyles.navLink} ${mainStyles.active}`
                  : mainStyles.navLink
              }
            >
              <FiCreditCard className={mainStyles.icon} /> <span>Finance</span>
            </NavLink>
            <NavLink
              to="/habits"
              className={({ isActive }) =>
                isActive
                  ? `${mainStyles.navLink} ${mainStyles.active}`
                  : mainStyles.navLink
              }
            >
              <FiTrendingUp className={mainStyles.icon} /> <span>Habits</span>
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive
                  ? `${mainStyles.navLink} ${mainStyles.active}`
                  : mainStyles.navLink
              }
            >
              <FiUser className={mainStyles.icon} /> <span>Profile</span>
            </NavLink>
            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  isActive
                    ? `${mainStyles.navLink} ${mainStyles.active}`
                    : mainStyles.navLink
                }
              >
                <FiShield className={mainStyles.icon} />{" "}
                <span>Admin Panel</span>
              </NavLink>
            )}
          </nav>
        </div>

        <div className={styles.menuFooter}>
          <button
            onClick={handleLogoutClick}
            className={mainStyles.logoutButton}
          >
            <FiLogOut className={mainStyles.icon} /> <span>Logout</span>
          </button>
        </div>
      </div>

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

export default Navbar;
