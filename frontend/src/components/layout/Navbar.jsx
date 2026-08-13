import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";
import styles from "./Navbar.module.css";
import mainStyles from "./MainLayout.module.css";
import logo from "../../assets/logo.png";
import { FiMenu, FiX, FiLogOut } from "react-icons/fi";
import { NAV_LINKS, ADMIN_LINK } from "./navLinks";
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
          aria-label={t("sidebar.openMenu")}
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
            aria-label={t("sidebar.closeMenu")}
          >
            <FiX />
          </button>
        </div>

        <div className={styles.scrollableNav}>
          <nav className={mainStyles.nav} onClick={() => setIsMenuOpen(false)}>
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) => {
                    const classes = [mainStyles.navLink];
                    if (isActive) classes.push(mainStyles.active);
                    if (link.variant === "ai") classes.push(mainStyles.aiLink);
                    return classes.join(" ");
                  }}
                >
                  <Icon className={mainStyles.icon} /> <span>{t(link.labelKey)}</span>
                </NavLink>
              );
            })}
            {isAdmin && (
              <NavLink
                to={ADMIN_LINK.to}
                className={({ isActive }) =>
                  isActive
                    ? `${mainStyles.navLink} ${mainStyles.active}`
                    : mainStyles.navLink
                }
              >
                <ADMIN_LINK.icon className={mainStyles.icon} />{" "}
                <span>{t(ADMIN_LINK.labelKey)}</span>
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
