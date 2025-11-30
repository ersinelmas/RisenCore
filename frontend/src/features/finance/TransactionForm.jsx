import { useState } from "react";
import toast from "react-hot-toast";
import transactionService from "../../services/transactionService";
import styles from "./TransactionForm.module.css";
import { toTitleCase } from "../../utils/stringUtils";
import Card from "../../components/Card";

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
    const toastId = toast.loading("Adding transaction...");
    try {
      await transactionService.createTransaction(form);
      toast.success("Transaction added!", { id: toastId });
      onTransactionAdded();
      setForm({
        description: "",
        amount: "",
        type: "EXPENSE",
        category: "OTHER",
        transactionDate: new Date().toISOString().split("T")[0],
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add transaction.", {
        id: toastId,
      });
      console.error("Transaction creation failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <h2>Add New Transaction</h2>
      <form onSubmit={handleSubmit} className={styles.transactionForm}>
        <div className={`${styles.formGroup} ${styles.descriptionGroup}`}>
          <label htmlFor="description" className={styles.label}>
            Description
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
            Amount
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
            Date
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
            Type
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
            Category
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
            {isSubmitting ? "Adding..." : "Add Transaction"}
          </button>
        </div>
      </form>
    </Card>
  );
}

export default TransactionForm;
