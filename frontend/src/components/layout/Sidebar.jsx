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
  FiCpu,
} from "react-icons/fi";
import logo from "../../assets/logo.png";
import Modal from "../common/Modal";
import { useModal } from "../../hooks/useModal";
import modalStyles from "../common/Modal.module.css";
import { useTranslation } from "react-i18next";

function Sidebar() {
  const { logout, isAdmin } = useAuth();
  const { t } = useTranslation();
  const {
    isOpen: isLogoutModalOpen,
    openModal: openLogoutModal,
    closeModal: closeLogoutModal,
  } = useModal();

  const handleLogoutConfirm = () => {
    closeLogoutModal();
    logout();
    toast.success(t("sidebar.logoutMessage"));
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
            <FiGrid className={styles.icon} /> <span>{t("sidebar.dashboard")}</span>
          </NavLink>
          <NavLink
            to="/tasks"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            <FiCheckSquare className={styles.icon} /> <span>{t("sidebar.tasks")}</span>
          </NavLink>
          <NavLink
            to="/habits"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            <FiTrendingUp className={styles.icon} /> <span>{t("sidebar.habits")}</span>
          </NavLink>
          <NavLink
            to="/finance"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            <FiCreditCard className={styles.icon} /> <span>{t("sidebar.finance")}</span>
          </NavLink>
          <NavLink
            to="/health"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            <FiActivity className={styles.icon} /> <span>{t("sidebar.health")}</span>
          </NavLink>
          <NavLink
            to="/weekly-review"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active} ${styles.aiLink}` : `${styles.navLink} ${styles.aiLink}`
            }
          >
            <FiCpu className={styles.icon} /> <span>{t("sidebar.weeklyReview")}</span>
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            <FiUser className={styles.icon} /> <span>{t("sidebar.profile")}</span>
          </NavLink>
          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              <FiShield className={styles.icon} /> <span>{t("sidebar.adminPanel")}</span>
            </NavLink>
          )}
        </nav>

        <button onClick={openLogoutModal} className={styles.logoutButton}>
          <FiLogOut className={styles.icon} /> <span>{t("sidebar.logout")}</span>
        </button>
      </aside>

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

export default Sidebar;
