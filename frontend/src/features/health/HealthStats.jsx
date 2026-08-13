import { useTranslation } from "react-i18next";
import Card from "../../components/Card";
import styles from "./HealthStats.module.css";

const METRIC_TYPES = ["WEIGHT", "WATER", "SLEEP", "EXERCISE"];

function latestByType(metrics, type) {
  return metrics
    .filter((metric) => metric.type === type)
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
}

function HealthStats({ metrics, metricTypeLabel, formatMetricDate }) {
  const { t } = useTranslation();

  return (
    <Card>
      <h3 className={styles.title}>{t("health.stats.title")}</h3>
      <div className={styles.list}>
        {METRIC_TYPES.map((type) => {
          const latest = latestByType(metrics, type);
          return (
            <div key={type} className={styles.row}>
              <span className={styles.type}>{metricTypeLabel(type)}</span>
              {latest ? (
                <span className={styles.value}>
                  {latest.value} {latest.unit}
                  <span className={styles.date}>{formatMetricDate(latest.date)}</span>
                </span>
              ) : (
                <span className={styles.noEntry}>{t("health.stats.noEntry")}</span>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export default HealthStats;
