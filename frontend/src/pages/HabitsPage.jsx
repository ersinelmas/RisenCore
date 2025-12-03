import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import PageLayout from "../components/layout/PageLayout";
import Card from "../components/Card";
import habitService from "../services/habitService";
import styles from "./HabitsPage.module.css";
import HabitItem from "../features/habits/HabitItem";
import CreateHabitForm from "../features/habits/CreateHabitForm";
import { useTranslation } from "react-i18next";

function HabitsPage() {
  const { t } = useTranslation();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHabits = useCallback(async () => {
    setLoading(true);
    try {
      const response = await habitService.getAllHabits();
      setHabits(response.data);
    } catch (error) {
      toast.error(t("habits.loadError"));
      console.error("Failed to fetch habits:", error);
    } finally {
      setLoading(false);
    }
  }, []);

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
        <div>{t("habits.loading")}</div>
      </PageLayout>
    );
  }

  return (
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
              <p style={{ textAlign: "center", padding: "2rem" }}>
                {t("habits.noHabits")}
              </p>
            </Card>
          )}
        </div>
      </div>
    </PageLayout>
  );
}

export default HabitsPage;
