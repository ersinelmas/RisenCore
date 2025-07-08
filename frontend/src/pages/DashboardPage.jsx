import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import styles from './DashboardPage.module.css';
import TaskWidget from '../features/tasks/TaskWidget';

function DashboardPage() {
  const { user, logout, isAdmin } = useAuth();

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