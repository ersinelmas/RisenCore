import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { FiTrash2 } from "react-icons/fi";
import healthService from "../services/healthService";
import PageLayout from "../components/layout/PageLayout";
import Card from "../components/Card";
import LoadingIndicator from "../components/common/LoadingIndicator";
import EmptyState from "../components/common/EmptyState";
import ErrorBoundary from "../components/common/ErrorBoundary";
import Modal from "../components/common/Modal";
import modalStyles from "../components/common/Modal.module.css";
import { useModal } from "../hooks/useModal";
import styles from "./HealthPage.module.css";
import { toTitleCase } from "../utils/stringUtils";
import { useTranslation } from "react-i18next";

const METRIC_TYPES = ["WEIGHT", "WATER", "SLEEP", "EXERCISE"];

function HealthPage() {
  const { t } = useTranslation();
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [metricToDelete, setMetricToDelete] = useState(null);
  const {
    isOpen: isDeleteModalOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();
  const [form, setForm] = useState({
    type: "WEIGHT",
    value: "",
    unit: "kg",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const fetchMetrics = useCallback(async () => {
    setError(null);
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
    setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (metric) => {
    setMetricToDelete(metric);
    openDeleteModal();
  };

  const confirmDeleteMetric = useCallback(async () => {
    if (!metricToDelete) return;

    closeDeleteModal();
    const toastId = toast.loading(t("health.deleting"));
    try {
      await healthService.deleteMetric(metricToDelete.id);
      toast.success(t("health.deleted"), { id: toastId });
      fetchMetrics();
    } catch (error) {
      console.error("Error deleting health metric:", error);
      toast.error(t("health.deleteError"), { id: toastId });
    } finally {
      setMetricToDelete(null);
    }
  }, [metricToDelete, closeDeleteModal, fetchMetrics, t]);

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
                <label htmlFor="health-type" className={styles.label}>
                  {t("health.metricType")}
                </label>
                <select
                  id="health-type"
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
                <label htmlFor="health-value" className={styles.label}>
                  {t("health.value")}
                </label>
                <input
                  id="health-value"
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
                <label htmlFor="health-unit" className={styles.label}>
                  {t("health.unit")}
                </label>
                <input
                  id="health-unit"
                  type="text"
                  name="unit"
                  value={form.unit}
                  onChange={handleInputChange}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="health-date" className={styles.label}>
                  {t("health.date")}
                </label>
                <input
                  id="health-date"
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleInputChange}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="health-notes" className={styles.label}>
                  {t("health.notes")}
                </label>
                <textarea
                  id="health-notes"
                  name="notes"
                  value={form.notes}
                  onChange={handleInputChange}
                  className={styles.textarea}
                  rows="3"
                />
              </div>

              <button
                type="submit"
                className={styles.button}
                disabled={isSubmitting}
              >
                {isSubmitting ? t("health.adding") : t("health.submit")}
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
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDeleteClick(metric)}
                      aria-label={t("health.deleteMetric")}
                    >
                      <FiTrash2 size={16} />
                    </button>
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

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        title={t("health.deleteMetric")}
        actions={
          <>
            <button className={modalStyles.actionButton} onClick={closeDeleteModal}>
              {t("common.cancel")}
            </button>
            <button
              className={`${modalStyles.actionButton} ${modalStyles.confirmButton}`}
              onClick={confirmDeleteMetric}
            >
              {t("common.delete")}
            </button>
          </>
        }
      >
        <p>{t("health.deleteMetricConfirm")}</p>
      </Modal>
    </ErrorBoundary>
  );
}

export default HealthPage;
