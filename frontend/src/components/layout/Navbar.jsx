import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import styles from './Navbar.module.css';
import mainStyles from './MainLayout.module.css';
import logo from '../../assets/logo.png';
import { FiMenu, FiX, FiGrid, FiCheckSquare, FiCreditCard, FiTrendingUp, FiUser, FiShield, FiLogOut } from 'react-icons/fi';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, isAdmin } = useAuth();

  const handleLogout = () => {
    setIsOpen(false);
    logout();
  };

  return (
    <>
      <header className={styles.navbar}>
        <Link to="/" className={styles.logoLink}>
          <img src={logo} alt="RisenCore Logo" className={styles.logoImage} />
          <span className={styles.logoText}>RisenCore</span>
        </Link>
        <button onClick={() => setIsOpen(true)} className={styles.hamburgerButton}>
          <FiMenu />
        </button>
      </header>
      
      {/* Off-canvas Mobile Menu */}
      <div className={`${styles.mobileMenu} ${isOpen ? styles.open : ''}`}>
        <button onClick={() => setIsOpen(false)} className={styles.closeButton}>
          <FiX />
        </button>
        <nav className={mainStyles.nav} onClick={() => setIsOpen(false)}>
          <NavLink to="/" className={({ isActive }) => isActive ? `${mainStyles.navLink} ${mainStyles.active}` : mainStyles.navLink} end>
            <FiGrid className={mainStyles.icon} /> <span>Dashboard</span>
          </NavLink>
          <NavLink to="/tasks" className={({ isActive }) => isActive ? `${mainStyles.navLink} ${mainStyles.active}` : mainStyles.navLink}>
            <FiCheckSquare className={mainStyles.icon} /> <span>Tasks</span>
          </NavLink>
          <NavLink to="/finance" className={({ isActive }) => isActive ? `${mainStyles.navLink} ${mainStyles.active}` : mainStyles.navLink}>
            <FiCreditCard className={mainStyles.icon} /> <span>Finance</span>
          </NavLink>
          <NavLink to="/habits" className={({ isActive }) => isActive ? `${mainStyles.navLink} ${mainStyles.active}` : mainStyles.navLink}>
            <FiTrendingUp className={mainStyles.icon} /> <span>Habits</span>
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => isActive ? `${mainStyles.navLink} ${mainStyles.active}` : mainStyles.navLink}>
            <FiUser className={mainStyles.icon} /> <span>Profile</span>
          </NavLink>
          {isAdmin && (
            <NavLink to="/admin" className={({ isActive }) => isActive ? `${mainStyles.navLink} ${mainStyles.active}` : mainStyles.navLink}>
              <FiShield className={mainStyles.icon} /> <span>Admin Panel</span>
            </NavLink>
          )}
        </nav>
        <button onClick={handleLogout} className={mainStyles.logoutButton}>
          <FiLogOut className={mainStyles.icon} /> <span>Logout</span>
        </button>
      </div>
    </>
  );
}

export default Navbar;