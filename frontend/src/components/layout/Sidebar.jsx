import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import styles from './MainLayout.module.css';

function Sidebar() {
  const { logout, isAdmin } = useAuth();

  return (
    <aside className={styles.sidebar}>
      <h1 className={styles.sidebarHeader}>RisenCore</h1>
      
      <nav className={styles.nav}>
        {/* NavLink is used instead of Link to get an automatic 'active' class */}
        <NavLink to="/" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink} end>
          Dashboard
        </NavLink>
        <NavLink to="/tasks" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
          Tasks
        </NavLink>
        <NavLink to="/finance" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
          Finance
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
          Profile
        </NavLink>
        {isAdmin && (
          <NavLink to="/admin" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
            Admin Panel
          </NavLink>
        )}
      </nav>

      <button onClick={logout} className={styles.logoutButton}>
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;