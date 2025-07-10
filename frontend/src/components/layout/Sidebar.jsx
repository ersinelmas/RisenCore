import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import styles from './MainLayout.module.css';
import { FiGrid, FiCheckSquare, FiCreditCard, FiUser, FiShield, FiLogOut } from 'react-icons/fi';
import logo from '../../assets/logo.png';

function Sidebar() {
  const { logout, isAdmin } = useAuth();

  return (
    <aside className={styles.sidebar}>
      <Link to="/" className={styles.logoContainer}>
        <img src={logo} alt="RisenCore Logo" className={styles.logoImage} />
        <span className={styles.logoText}>RisenCore</span>
      </Link>
      
      <nav className={styles.nav}>
        {/* NavLink is used instead of Link to get an automatic 'active' class */}
        <NavLink to="/" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink} end>
          <FiGrid className={styles.icon} /> <span>Dashboard</span>
        </NavLink>
        <NavLink to="/tasks" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
          <FiCheckSquare className={styles.icon} /> <span>Tasks</span>
        </NavLink>
        <NavLink to="/finance" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
          <FiCreditCard className={styles.icon} /> <span>Finance</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
          <FiUser className={styles.icon} /> <span>Profile</span>
        </NavLink>
        {isAdmin && (
          <NavLink to="/admin" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
            <FiShield className={styles.icon} /> <span>Admin Panel</span>
          </NavLink>
        )}
      </nav>

      <button onClick={logout} className={styles.logoutButton}>
        <FiLogOut className={styles.icon} /> <span>Logout</span>
      </button>
    </aside>
  );
}

export default Sidebar;