import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import healthService from "../services/healthService";
import PageLayout from "../components/layout/PageLayout";
import Card from "../components/Card";
import LoadingIndicator from "../components/common/LoadingIndicator";
import EmptyState from "../components/common/EmptyState";
import ErrorBoundary from "../components/common/ErrorBoundary";
import styles from "./HealthPage.module.css";
import { toTitleCase } from "../utils/stringUtils";
import { useTranslation } from "react-i18next";

const METRIC_TYPES = ["WEIGHT", "WATER", "SLEEP", "EXERCISE"];

function HealthPage() {
  const { t } = useTranslation();
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    type: "WEIGHT",
    value: "",
    unit: "kg",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const fetchMetrics = useCallback(async () => {
    try {
      const response = await healthService.getAllMetrics();
      setMetrics(response.data);
    } catch (error) {
      console.error("Error fetching health metrics:", error);
      toast.error(t("health.loadError"));
      setError(t("health.loadError"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading(t("health.adding"));
    try {
      await healthService.createMetric(form);
      toast.success(t("health.added"), { id: toastId });
      fetchMetrics();
      setForm((prev) => ({
        ...prev,
        value: "",
        notes: "",
      }));
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error(t("health.addError"), { id: toastId });
    }
  };

  if (loading) {
    return (
      <PageLayout title={t("health.title")}>
        <LoadingIndicator fullHeight messageKey="health.loading" />
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title={t("health.title")}>
        <EmptyState
          icon="⚠️"
          title={t("health.loadError")}
          description={t("health.loadErrorDescription")}
          actionLabel={t("common.retry")}
          onAction={fetchMetrics}
        />
      </PageLayout>
    );
  }

  return (
    <ErrorBoundary>
      <PageLayout title={t("health.title")}>
        <div className={styles.container}>
          <Card className={styles.formCard}>
            <h2>{t("health.logMetric")}</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.label}>{t("health.metricType")}</label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleInputChange}
                  className={styles.select}
                >
                  {METRIC_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {toTitleCase(type)}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>{t("health.value")}</label>
                <input
                  type="number"
                  name="value"
                  value={form.value}
                  onChange={handleInputChange}
                  step="0.01"
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>{t("health.unit")}</label>
                <input
                  type="text"
                  name="unit"
                  value={form.unit}
                  onChange={handleInputChange}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>{t("health.date")}</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleInputChange}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>{t("health.notes")}</label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleInputChange}
                  className={styles.textarea}
                  rows="3"
                />
              </div>

              <button type="submit" className={styles.button}>
                {t("health.submit")}
              </button>
            </form>
          </Card>

          <h2>{t("health.recentEntries")}</h2>
          <div className={styles.grid}>
            {metrics.length > 0 ? (
              metrics.map((metric) => (
                <Card key={metric.id} className={styles.metricCard}>
                  <div className={styles.metricHeader}>
                    <span className={styles.metricType}>
                      {toTitleCase(metric.type)}
                    </span>
                    <span className={styles.metricDate}>{metric.date}</span>
                  </div>
                  <div>
                    <span className={styles.metricValue}>{metric.value}</span>
                    <span className={styles.metricUnit}>{metric.unit}</span>
                  </div>
                  {metric.notes && <p>{metric.notes}</p>}
                </Card>
              ))
            ) : (
              <EmptyState
                compact
                icon="🩺"
                title={t("health.noMetrics")}
                description={t("health.noMetricsDescription")}
                actionLabel={t("common.retry")}
                onAction={fetchMetrics}
              />
            )}
          </div>
        </div>
      </PageLayout>
    </ErrorBoundary>
  );
}

export default HealthPage;
