import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import styles from "./DashboardPage.module.css";
import Card from "../components/Card";
import PageLayout from "../components/layout/PageLayout";
import taskService from "../services/taskService";
import transactionService from "../services/transactionService";
import habitService from "../services/habitService";

function DashboardPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(() => {
    setLoading(true);
    Promise.all([
      taskService.getAllTasks(),
      transactionService.getAllTransactions(),
      habitService.getAllHabits(),
    ])
      .then(([taskResponse, transactionResponse, habitResponse]) => {
        const pendingTasks = taskResponse.data
          .filter((t) => !t.completed)
          .slice(0, 3);
        setTasks(pendingTasks);

        setTransactions(transactionResponse.data);

        setHabits(habitResponse.data);
      })
      .catch((error) => {
        console.error("Failed to load dashboard data", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const financialSummary = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "INCOME")
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, balance: income - expense };
  }, [transactions]);

  const getGreeting = () => {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
      return "Good morning";
    }
    if (currentHour >= 12 && currentHour < 18) {
      return "Good afternoon";
    }
    if (currentHour >= 18 && currentHour < 22) {
      return "Good evening";
    }
    // For late night hours (10 PM to 4:59 AM)
    return "Burning the midnight oil";
  };

  if (loading) {
    return (
      <PageLayout title="Loading Dashboard...">
        <div>Loading...</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title={`${getGreeting()}, ${user?.firstName || "User"}!`}>
      <div className={styles.gridContainer}>
        {/* Card 1: Today's Tasks */}
        <Card>
          <h3 className={styles.cardTitle}>Today's Focus Tasks</h3>
          {tasks.length > 0 ? (
            <ul className={styles.quickTaskList}>
              {tasks.map((task) => (
                <li key={task.id}>{task.description}</li>
              ))}
            </ul>
          ) : (
            <p className={styles.noItemsText}>
              No pending tasks. You're all clear!
            </p>
          )}
          <Link to="/tasks" className={styles.viewAllLink}>
            Manage all tasks
          </Link>
        </Card>

        {/* Card 2: Today's Habits */}
        <Card>
          <h3 className={styles.cardTitle}>Habits to Complete</h3>
          {habits.filter((h) => !h.completedToday).length > 0 ? (
            <ul className={styles.quickTaskList}>
              {habits
                .filter((h) => !h.completedToday)
                .slice(0, 3) // Show max 3 habits
                .map((habit) => (
                  <li key={habit.id}>{habit.name}</li>
                ))}
            </ul>
          ) : (
            <p className={styles.noItemsText}>
              All habits completed for today. Amazing!
            </p>
          )}
          <Link to="/habits" className={styles.viewAllLink}>
            Go to Habits
          </Link>
        </Card>

        {/* Card 3: Quick Balance */}
        <Card>
          <h3 className={styles.cardTitle}>Current Balance</h3>
          <div className={styles.balanceDisplay}>
            ${financialSummary.balance.toFixed(2)}
          </div>
          <p className={styles.balanceSubtitle}>
            <span className={styles.income}>
              ${financialSummary.income.toFixed(2)} Income
            </span>
            {" - "}
            <span className={styles.expense}>
              ${financialSummary.expense.toFixed(2)} Expense
            </span>
          </p>
          <Link to="/finance" className={styles.viewAllLink}>
            View financial details
          </Link>
        </Card>
      </div>
    </PageLayout>
  );
}

export default DashboardPage;
