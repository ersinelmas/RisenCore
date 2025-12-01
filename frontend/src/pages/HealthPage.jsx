import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import healthService from "../services/healthService";
import PageLayout from "../components/layout/PageLayout";
import Card from "../components/Card";
import styles from "./HealthPage.module.css";
import { toTitleCase } from "../utils/stringUtils";

const METRIC_TYPES = ["WEIGHT", "WATER", "SLEEP", "EXERCISE"];

function HealthPage() {
  const [metrics, setMetrics] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    type: "WEIGHT",
    value: "",
    unit: "kg",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const fetchMetrics = async () => {
    try {
      const response = await healthService.getAllMetrics();
      setMetrics(response.data);
    } catch (error) {
      console.error("Error fetching health metrics:", error);
      toast.error("Failed to load health data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Adding metric...");
    try {
      await healthService.createMetric(form);
      toast.success("Metric added!", { id: toastId });
      fetchMetrics();
      setForm((prev) => ({
        ...prev,
        value: "",
        notes: "",
      }));
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("Failed to add metric.", { id: toastId });
    }
  };

  return (
    <PageLayout title="Health Tracker">
      <div className={styles.container}>
        <Card className={styles.formCard}>
          <h2>Log Health Metric</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Type</label>
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
              <label className={styles.label}>Value</label>
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
              <label className={styles.label}>Unit</label>
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
              <label className={styles.label}>Date</label>
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
              <label className={styles.label}>Notes</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleInputChange}
                className={styles.textarea}
                rows="3"
              />
            </div>

            <button type="submit" className={styles.button}>
              Add Entry
            </button>
          </form>
        </Card>

        <h2>Recent Entries</h2>
        <div className={styles.grid}>
          {metrics.map((metric) => (
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
          ))}
        </div>
      </div>
    </PageLayout>
  );
}

export default HealthPage;
