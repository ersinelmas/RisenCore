import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import styles from "./DashboardPage.module.css";
import Card from "../components/Card";
import PageLayout from "../components/layout/PageLayout";
import LoadingIndicator from "../components/common/LoadingIndicator";
import EmptyState from "../components/common/EmptyState";
import ErrorBoundary from "../components/common/ErrorBoundary";
import taskService from "../services/taskService";
import transactionService from "../services/transactionService";
import habitService from "../services/habitService";
import { useTranslation } from "react-i18next";

function DashboardPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [tasks, setTasks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(() => {
    setLoading(true);
    setError(null);
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
        setError(t("dashboard.loadError"));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [t]);

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
      return t("dashboard.goodMorning");
    }
    if (currentHour >= 12 && currentHour < 18) {
      return t("dashboard.goodAfternoon");
    }
    if (currentHour >= 18 && currentHour < 22) {
      return t("dashboard.goodEvening");
    }
    return t("dashboard.burningMidnightOil");
  };

  if (loading) {
    return (
      <PageLayout title={t("dashboard.loadingDashboard")}>
        <LoadingIndicator fullHeight messageKey="dashboard.loading" />
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title={t("dashboard.loadingDashboard")}>
        <EmptyState
          icon="⚠️"
          title={t("dashboard.loadErrorTitle")}
          description={error}
          actionLabel={t("common.retry")}
          onAction={fetchData}
        />
      </PageLayout>
    );
  }

  return (
    <ErrorBoundary>
      <PageLayout title={`${getGreeting()}, ${user?.firstName || "User"}!`}>
        <div className={styles.gridContainer}>
          <Card className={styles.highlightCard}>
            <h3 className={styles.cardTitle}>{t("dashboard.weeklyAIReady")}</h3>
            <p className={styles.cardDescription}>
              {t("dashboard.weeklyAIDescription")}
            </p>
            <Link to="/weekly-review" className={styles.highlightLink}>
              {t("dashboard.viewMyReview")}
            </Link>
          </Card>

          {/* Card 1: Today's Tasks */}
          <Card>
            <h3 className={styles.cardTitle}>{t("dashboard.todaysFocusTasks")}</h3>
            {tasks.length > 0 ? (
              <ul className={styles.quickTaskList}>
                {tasks.map((task) => (
                  <li key={task.id}>{task.description}</li>
                ))}
              </ul>
            ) : (
              <EmptyState
                compact
                icon="✅"
                title={t("dashboard.noPendingTasks")}
                description={t("dashboard.noPendingTasksDescription")}
              />
            )}
            <Link to="/tasks" className={styles.viewAllLink}>
              {t("dashboard.manageAllTasks")}
            </Link>
          </Card>

          {/* Card 2: Today's Habits */}
          <Card>
            <h3 className={styles.cardTitle}>{t("dashboard.habitsToComplete")}</h3>
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
              <EmptyState
                compact
                icon="🌟"
                title={t("dashboard.allHabitsCompleted")}
                description={t("dashboard.allHabitsCompletedDescription")}
              />
            )}
            <Link to="/habits" className={styles.viewAllLink}>
              {t("dashboard.goToHabits")}
            </Link>
          </Card>

          {/* Card 3: Quick Balance */}
          <Card>
            <h3 className={styles.cardTitle}>{t("dashboard.currentBalance")}</h3>
            <div className={styles.balanceDisplay}>
              ${financialSummary.balance.toFixed(2)}
            </div>
            <p className={styles.balanceSubtitle}>
              <span className={styles.income}>
                ${financialSummary.income.toFixed(2)} {t("dashboard.income")}
              </span>
              {" - "}
              <span className={styles.expense}>
                ${financialSummary.expense.toFixed(2)} {t("dashboard.expense")}
              </span>
            </p>
            <Link to="/finance" className={styles.viewAllLink}>
              {t("dashboard.viewFinancialDetails")}
            </Link>
          </Card>
        </div>
      </PageLayout>
    </ErrorBoundary>
  );
}

export default DashboardPage;
