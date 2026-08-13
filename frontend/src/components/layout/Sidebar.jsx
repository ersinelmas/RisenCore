import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";
import styles from "./MainLayout.module.css";
import { FiLogOut } from "react-icons/fi";
import { NAV_LINKS, ADMIN_LINK } from "./navLinks";
import logo from "../../assets/logo.png";
import Modal from "../common/Modal";
import { useModal } from "../../hooks/useModal";
import modalStyles from "../common/Modal.module.css";
import LanguageSwitcher from "../common/LanguageSwitcher";
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
    toast.success(t("sidebar.logoutSuccess"));
  };

  return (
    <>
      <aside className={styles.sidebar}>
        <Link to="/" className={styles.logoContainer}>
          <img src={logo} alt="RisenCore Logo" className={styles.logoImage} />
          <span className={styles.logoText}>RisenCore</span>
        </Link>

        <nav className={styles.nav}>
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => {
                  const classes = [styles.navLink];
                  if (isActive) classes.push(styles.active);
                  if (link.variant === "ai") classes.push(styles.aiLink);
                  return classes.join(" ");
                }}
              >
                <Icon className={styles.icon} /> <span>{t(link.labelKey)}</span>
              </NavLink>
            );
          })}
          {isAdmin && (
            <NavLink
              to={ADMIN_LINK.to}
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              <ADMIN_LINK.icon className={styles.icon} /> <span>{t(ADMIN_LINK.labelKey)}</span>
            </NavLink>
          )}
        </nav>

        <div className={styles.sidebarFooter}>
          <LanguageSwitcher />
          <button onClick={openLogoutModal} className={styles.logoutButton}>
            <FiLogOut className={styles.icon} /> <span>{t("sidebar.logout")}</span>
          </button>
        </div>
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
