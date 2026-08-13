import { useTranslation } from "react-i18next";
import Card from "../../components/Card";
import styles from "./TaskStats.module.css";

function TaskStats({ tasks }) {
  const { t } = useTranslation();
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const pending = total - completed;

  return (
    <Card>
      <div className={styles.statRow}>
        <span className={styles.statLabel}>{t("tasks.stats.total")}</span>
        <span className={styles.statValue}>{total}</span>
      </div>
      <div className={styles.statRow}>
        <span className={styles.statLabel}>{t("tasks.stats.pending")}</span>
        <span className={styles.statValue}>{pending}</span>
      </div>
      <div className={styles.statRow}>
        <span className={styles.statLabel}>{t("tasks.stats.completed")}</span>
        <span className={styles.statValue}>{completed}</span>
      </div>
    </Card>
  );
}

export default TaskStats;
