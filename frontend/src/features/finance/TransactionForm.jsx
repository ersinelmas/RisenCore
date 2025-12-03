import { useState } from "react";
import toast from "react-hot-toast";
import transactionService from "../../services/transactionService";
import styles from "./TransactionForm.module.css";
import { toTitleCase } from "../../utils/stringUtils";
import Card from "../../components/Card";
import { useTranslation } from "react-i18next";

const TRANSACTION_TYPES = ["INCOME", "EXPENSE"];
const CATEGORIES = [
  "SALARY",
  "FREELANCE",
  "RENT",
  "GROCERIES",
  "UTILITIES",
  "TRANSPORTATION",
  "DINING_OUT",
  "ENTERTAINMENT",
  "HEALTHCARE",
  "SHOPPING",
  "SAVINGS",
  "OTHER",
];

function TransactionForm({ onTransactionAdded }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    description: "",
    amount: "",
    type: "EXPENSE",
    category: "OTHER",
    transactionDate: new Date().toISOString().split("T")[0],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading(t("finance.adding"));
    try {
      await transactionService.createTransaction(form);
      toast.success(t("finance.transactionAdded"), { id: toastId });
      onTransactionAdded();
      setForm({
        description: "",
        amount: "",
        type: "EXPENSE",
        category: "OTHER",
        transactionDate: new Date().toISOString().split("T")[0],
      });
    } catch (err) {
      toast.error(err.response?.data?.message || t("finance.addTransactionError"), {
        id: toastId,
      });
      console.error("Transaction creation failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <h2>{t("finance.addNewTransaction")}</h2>
      <form onSubmit={handleSubmit} className={styles.transactionForm}>
        <div className={`${styles.formGroup} ${styles.descriptionGroup}`}>
          <label htmlFor="description" className={styles.label}>
            {t("finance.description")}
          </label>
          <input
            type="text"
            name="description"
            id="description"
            value={form.description}
            onChange={handleInputChange}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="amount" className={styles.label}>
            {t("finance.amount")}
          </label>
          <input
            type="number"
            name="amount"
            id="amount"
            value={form.amount}
            onChange={handleInputChange}
            required
            step="0.01"
            min="0.01"
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="transactionDate" className={styles.label}>
            {t("finance.date")}
          </label>
          <input
            type="date"
            name="transactionDate"
            id="transactionDate"
            value={form.transactionDate}
            onChange={handleInputChange}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="type" className={styles.label}>
            {t("finance.type")}
          </label>
          <select
            name="type"
            id="type"
            value={form.type}
            onChange={handleInputChange}
            required
            className={styles.select}
          >
            {TRANSACTION_TYPES.map((type) => (
              <option key={type} value={type}>
                {toTitleCase(type)}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="category" className={styles.label}>
            {t("finance.category")}
          </label>
          <select
            name="category"
            id="category"
            value={form.category}
            onChange={handleInputChange}
            required
            className={styles.select}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {toTitleCase(cat)}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.formActions}>
          <button
            type="submit"
            disabled={isSubmitting}
            className={styles.button}
          >
            {isSubmitting ? t("finance.adding") : t("finance.addTransaction")}
          </button>
        </div>
      </form>
    </Card>
  );
}

export default TransactionForm;
