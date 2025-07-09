import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import styles from './DashboardPage.module.css';
import Card from '../components/Card';

function DashboardPage() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className={styles.welcomeMessage}>
        Dashboard
      </h1>
      <p style={{ marginTop: 0, color: '#6b7280' }}>
        Welcome back, <strong>{user?.username || 'User'}</strong>!
      </p>

      <div style={{ marginTop: '2rem' }}>
        <Card>
            <h2 style={{marginTop: 0}}>Quick Access</h2>
            <p>Select a module from the sidebar to get started, or jump directly to your tasks.</p>
            <Link to="/tasks">
                <button className={styles.primaryButton}>
                  Go to My Tasks
                </button>
            </Link>
        </Card>
      </div>
    </div>
  );
}

export default DashboardPage;