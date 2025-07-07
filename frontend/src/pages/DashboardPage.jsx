import { useAuth } from '../hooks/useAuth';
import styles from './DashboardPage.module.css';
import TaskWidget from '../features/tasks/TaskWidget';

function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h1 className={styles.welcomeMessage}>
          Welcome, <strong>{user?.username || 'User'}</strong>!
        </h1>
        <button onClick={logout} className={styles.logoutButton}>
          Logout
        </button>
      </header>

      <main>
        {/* The TaskWidget is the first feature on our dashboard. */}
        <TaskWidget />

        {/* In the future, new widgets can be added here easily. */}
        {/* <FinancialWidget /> */}
        {/* <HealthWidget /> */}
      </main>
    </div>
  );
}

export default DashboardPage;