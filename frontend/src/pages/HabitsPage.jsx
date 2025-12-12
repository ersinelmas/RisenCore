import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import PageLayout from "../components/layout/PageLayout";
import Card from "../components/Card";
import LoadingIndicator from "../components/common/LoadingIndicator";
import EmptyState from "../components/common/EmptyState";
import ErrorBoundary from "../components/common/ErrorBoundary";
import habitService from "../services/habitService";
import styles from "./HabitsPage.module.css";
import HabitItem from "../features/habits/HabitItem";
import CreateHabitForm from "../features/habits/CreateHabitForm";
import { useTranslation } from "react-i18next";

function HabitsPage() {
  const { t } = useTranslation();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHabits = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await habitService.getAllHabits();
      setHabits(response.data);
    } catch (error) {
      toast.error(t("habits.loadError"));
      setError(t("habits.loadError"));
      console.error("Failed to fetch habits:", error);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const handleHabitUpdate = (habitId, newCompletionDates) => {
    setHabits((currentHabits) =>
      currentHabits.map((h) =>
        h.id === habitId ? { ...h, completionDates: newCompletionDates } : h
      )
    );
  };

  const handleHabitDelete = (habitIdToDelete) => {
    setHabits((currentHabits) =>
      currentHabits.filter((h) => h.id !== habitIdToDelete)
    );
  };

  const handleHabitCreated = () => {
    fetchHabits();
  };

  if (loading) {
    return (
      <PageLayout title={t("habits.title")}>
        <LoadingIndicator fullHeight messageKey="habits.loading" />
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title={t("habits.title")}>
        <EmptyState
          icon="⚠️"
          title={t("habits.loadError")}
          description={t("habits.loadErrorDescription")}
          actionLabel={t("common.retry")}
          onAction={fetchHabits}
        />
      </PageLayout>
    );
  }

  return (
    <ErrorBoundary>
      <PageLayout title={t("habits.title")}>
        <div className={styles.pageContent}>
          <Card>
            <h2 className={styles.sectionTitle}>{t("habits.addNew")}</h2>
            <CreateHabitForm onHabitCreated={handleHabitCreated} />
          </Card>

          <div>
            <h2 className={styles.sectionTitle}>{t("habits.myHabits")}</h2>
            {habits.length > 0 ? (
              <div className={styles.habitListContainer}>
                {habits.map((habit) => (
                  <HabitItem
                    key={habit.id}
                    habit={habit}
                    onUpdate={handleHabitUpdate}
                    onDelete={handleHabitDelete}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <EmptyState
                  compact
                  icon="🧭"
                  title={t("habits.noHabits")}
                  description={t("habits.noHabitsDescription")}
                  actionLabel={t("common.retry")}
                  onAction={fetchHabits}
                />
              </Card>
            )}
          </div>
        </div>
      </PageLayout>
    </ErrorBoundary>
  );
}

export default HabitsPage;
