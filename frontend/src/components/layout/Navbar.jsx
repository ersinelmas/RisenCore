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
  FiActivity,
  FiCpu,
} from "react-icons/fi";
import Modal from "../common/Modal";
import { useModal } from "../../hooks/useModal";
import modalStyles from "../common/Modal.module.css";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../common/LanguageSwitcher";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout, isAdmin } = useAuth();
  const { t } = useTranslation();

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
    toast.success(t("sidebar.logoutMessage"));
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
              <FiGrid className={mainStyles.icon} /> <span>{t("sidebar.dashboard")}</span>
            </NavLink>
            <NavLink
              to="/tasks"
              className={({ isActive }) =>
                isActive
                  ? `${mainStyles.navLink} ${mainStyles.active}`
                  : mainStyles.navLink
              }
            >
              <FiCheckSquare className={mainStyles.icon} /> <span>{t("sidebar.tasks")}</span>
            </NavLink>
            <NavLink
              to="/habits"
              className={({ isActive }) =>
                isActive
                  ? `${mainStyles.navLink} ${mainStyles.active}`
                  : mainStyles.navLink
              }
            >
              <FiTrendingUp className={mainStyles.icon} /> <span>{t("sidebar.habits")}</span>
            </NavLink>
            <NavLink
              to="/finance"
              className={({ isActive }) =>
                isActive
                  ? `${mainStyles.navLink} ${mainStyles.active}`
                  : mainStyles.navLink
              }
            >
              <FiCreditCard className={mainStyles.icon} /> <span>{t("sidebar.finance")}</span>
            </NavLink>
            <NavLink
              to="/health"
              className={({ isActive }) =>
                isActive
                  ? `${mainStyles.navLink} ${mainStyles.active}`
                  : mainStyles.navLink
              }
            >
              <FiActivity className={mainStyles.icon} /> <span>{t("sidebar.health")}</span>
            </NavLink>
            <NavLink
              to="/weekly-review"
              className={({ isActive }) =>
                isActive
                  ? `${mainStyles.navLink} ${mainStyles.active} ${mainStyles.aiLink}`
                  : `${mainStyles.navLink} ${mainStyles.aiLink}`
              }
            >
              <FiCpu className={mainStyles.icon} /> <span>{t("sidebar.weeklyReview")}</span>
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive
                  ? `${mainStyles.navLink} ${mainStyles.active}`
                  : mainStyles.navLink
              }
            >
              <FiUser className={mainStyles.icon} /> <span>{t("sidebar.profile")}</span>
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
                <span>{t("sidebar.adminPanel")}</span>
              </NavLink>
            )}
          </nav>
        </div>

        <div className={styles.menuFooter}>
          <div style={{ marginBottom: '1rem' }}>
            <LanguageSwitcher />
          </div>
          <button
            onClick={handleLogoutClick}
            className={mainStyles.logoutButton}
          >
            <FiLogOut className={mainStyles.icon} /> <span>{t("sidebar.logout")}</span>
          </button>
        </div>
      </div>

      <Modal
        isOpen={isLogoutModalOpen}
        onClose={closeLogoutModal}
        title={t("sidebar.confirmLogout")}
        actions={
          <>
            <button
              className={modalStyles.actionButton}
              onClick={closeLogoutModal}
            >
              {t("sidebar.cancel")}
            </button>
            <button
              className={`${modalStyles.actionButton} ${modalStyles.confirmButton}`}
              onClick={handleLogoutConfirm}
            >
              {t("sidebar.logout")}
            </button>
          </>
        }
      >
        <p>{t("sidebar.logoutMessage")}</p>
      </Modal>
    </>
  );
}

export default Navbar;
