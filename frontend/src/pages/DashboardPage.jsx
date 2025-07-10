import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import styles from './DashboardPage.module.css';
import Card from '../components/Card';
import PageLayout from '../components/layout/PageLayout';
import taskService from '../services/taskService';
import transactionService from '../services/transactionService';

function DashboardPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(() => {
    setLoading(true);
    // Send both API requests at the same time for better performance
    Promise.all([
      taskService.getAllTasks(),
      transactionService.getAllTransactions()
    ]).then(([taskResponse, transactionResponse]) => {
      // Get only the 3 most recent, incomplete tasks for the summary
      const pendingTasks = taskResponse.data.filter(t => !t.completed).slice(0, 3);
      setTasks(pendingTasks);
      setTransactions(transactionResponse.data);
    }).catch(error => {
      console.error("Failed to load dashboard data", error);
      // We can show a toast here if we want
    }).finally(() => {
      setLoading(false);
    });
  }, []);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const financialSummary = useMemo(() => {
    const income = transactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, balance: income - expense };
  }, [transactions]);
  
  if (loading) {
    return <PageLayout title="Loading Dashboard..."><div>Loading...</div></PageLayout>;
  }

  return (
    <PageLayout title={`Welcome back, ${user?.username || 'User'}!`}>
      <div className={styles.gridContainer}>
        {/* Financial Summary Widget */}
        <Card>
          <h3 className={styles.cardTitle}>Financial Snapshot</h3>
          <div className={styles.summaryItem}>
            <span>Total Income:</span>
            <span className={`${styles.amount} ${styles.income}`}>
              ${financialSummary.income.toFixed(2)}
            </span>
          </div>
          <div className={styles.summaryItem}>
            <span>Total Expense:</span>
            <span className={`${styles.amount} ${styles.expense}`}>
              ${financialSummary.expense.toFixed(2)}
            </span>
          </div>
          <hr className={styles.divider}/>
          <div className={styles.summaryItem}>
            <strong>Balance:</strong>
            <strong className={styles.amount}>
              ${financialSummary.balance.toFixed(2)}
            </strong>
          </div>
          <Link to="/finance" className={styles.viewAllLink}>
            Go to Finance
          </Link>
        </Card>

        {/* Recent Tasks Widget */}
        <Card>
          <h3 className={styles.cardTitle}>Recent Pending Tasks</h3>
          {tasks.length > 0 ? (
            <ul className={styles.quickTaskList}>
              {tasks.map(task => <li key={task.id}>{task.description}</li>)}
            </ul>
          ) : (
            <p>No pending tasks. Great job!</p>
          )}
          <Link to="/tasks" className={styles.viewAllLink}>View all tasks</Link>
        </Card>
      </div>
    </PageLayout>
  );
}

export default DashboardPage;