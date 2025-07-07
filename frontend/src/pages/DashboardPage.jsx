import { useAuth } from '../hooks/useAuth';
import styles from './DashboardPage.module.css';
import TaskWidget from '../features/tasks/TaskWidget';
import { Link } from 'react-router-dom';

function DashboardPage() {
  const { user, logout } = useAuth();
  
  const isAdmin = user?.roles?.includes('ROLE_ADMIN');

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h1 className={styles.welcomeMessage}>
          Welcome, <strong>{user?.username || 'User'}</strong>!
        </h1>
        <div className={styles.headerActions}>
          {isAdmin && (
            <Link to="/admin" className={styles.adminLink}>
              Admin Panel
            </Link>
          )}
          <button onClick={logout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </header>

      <main>
        <TaskWidget />
      </main>
    </div>
  );
}

export default DashboardPage;