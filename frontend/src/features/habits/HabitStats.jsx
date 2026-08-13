import { useTranslation } from "react-i18next";
import Card from "../../components/Card";
import styles from "./HabitStats.module.css";

const formatDate = (date) => date.toISOString().split("T")[0];

const getCurrentWeekDates = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const firstDayOfWeek = new Date(today);
  firstDayOfWeek.setDate(today.getDate() + diff);

  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(firstDayOfWeek);
    day.setDate(day.getDate() + i);
    return formatDate(day);
  });
};

function isHabitOnTrackToday(habit) {
  const todayString = formatDate(new Date());
  if (habit.frequency === "DAILY") {
    return habit.completionDates.includes(todayString);
  }
  const currentWeekDates = getCurrentWeekDates();
  const weeklyCount = habit.completionDates.filter((date) =>
    currentWeekDates.includes(date)
  ).length;
  return weeklyCount >= habit.targetCount;
}

function HabitStats({ habits }) {
  const { t } = useTranslation();
  const total = habits.length;
  const onTrack = habits.filter(isHabitOnTrackToday).length;

  return (
    <Card>
      <h3 className={styles.title}>{t("habits.stats.title")}</h3>
      <p className={styles.progress}>
        {t("habits.stats.onTrack", { done: onTrack, total })}
      </p>
    </Card>
  );
}

export default HabitStats;
