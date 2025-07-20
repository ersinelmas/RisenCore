import { useState, useEffect, useMemo, useCallback } from "react";
import toast from "react-hot-toast";
import transactionService from "../services/transactionService";
import styles from "./FinancePage.module.css";
import Card from "../components/Card";
import PageLayout from "../components/layout/PageLayout";
import ExpenseChart from "../components/charts/ExpenseChart";
import { FiTrash2 } from "react-icons/fi";
import Modal from "../components/common/Modal";
import { useModal } from "../hooks/useModal";
import modalStyles from "../components/common/Modal.module.css";

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

function FinancePage() {
  const [transactions, setTransactions] = useState([]);
  const [expenseSummary, setExpenseSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    description: "",
    amount: "",
    type: "EXPENSE",
    category: "OTHER",
    transactionDate: new Date().toISOString().split("T")[0],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State and hooks for the delete confirmation modal
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const {
    isOpen: isDeleteModalOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();

  const fetchFinancialData = useCallback(() => {
    setLoading(true);
    Promise.all([
      transactionService.getAllTransactions(),
      transactionService.getExpenseSummary(),
    ])
      .then(([transactionsResponse, summaryResponse]) => {
        setTransactions(transactionsResponse.data);
        setExpenseSummary(summaryResponse.data);
      })
      .catch((err) => {
        toast.error("Failed to load financial data.");
        console.error("Error fetching financial data:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchFinancialData();
  }, [fetchFinancialData]);

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
      fetchFinancialData();
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

  const handleDeleteClick = (transaction) => {
    setTransactionToDelete(transaction);
    openDeleteModal();
  };

  const confirmDeleteTransaction = useCallback(async () => {
    if (!transactionToDelete) return;

    closeDeleteModal();
    const toastId = toast.loading("Deleting transaction...");
    try {
      await transactionService.deleteTransaction(transactionToDelete.id);
      toast.success("Transaction deleted!", { id: toastId });
      fetchFinancialData(); // Re-fetch all data to update everything
    } catch (error) {
      toast.error("Failed to delete transaction.", { id: toastId });
      console.error("Error deleting transaction:", error);
    } finally {
      setTransactionToDelete(null);
    }
  }, [transactionToDelete, closeDeleteModal, fetchFinancialData]);

  const summary = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "INCOME")
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expense;
    return { income, expense, balance };
  }, [transactions]);

  return (
    <>
      <PageLayout title="Financial Overview">
        <div className={styles.overviewGrid}>
          <div className={styles.summaryColumn}>
            <Card>
              <h4>Total Income</h4>
              <p className={`${styles.amount} ${styles.income}`}>
                ${summary.income.toFixed(2)}
              </p>
            </Card>
            <Card>
              <h4>Total Expense</h4>
              <p className={`${styles.amount} ${styles.expense}`}>
                ${summary.expense.toFixed(2)}
              </p>
            </Card>
            <Card>
              <h4>Current Balance</h4>
              <p className={styles.amount}>${summary.balance.toFixed(2)}</p>
            </Card>
          </div>

          <div className={styles.chartColumn}>
            {expenseSummary.length > 0 ? (
              <Card className={styles.fullHeightCard}>
                <ExpenseChart data={expenseSummary} />
              </Card>
            ) : (
              <Card className={styles.fullHeightCard}>
                <p>No expense data available to display a chart.</p>
              </Card>
            )}
          </div>
        </div>

        <Card className={styles.formCard}>
          <h2>Add New Transaction</h2>
          <form onSubmit={handleSubmit} className={styles.transactionForm}>
            <div className={`${styles.formGroup} ${styles.descriptionGroup}`}>
              <label htmlFor="description" className={styles.label}>
                Description
              </label>
              <input
                type="text"
                name="description"
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
                value={form.type}
                onChange={handleInputChange}
                required
                className={styles.select}
              >
                {TRANSACTION_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
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
                value={form.category}
                onChange={handleInputChange}
                required
                className={styles.select}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
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

        <Card>
          <h2>Recent Transactions</h2>
          {loading ? (
            <p style={{ textAlign: "center", padding: "2rem" }}>
              Loading transactions...
            </p>
          ) : (
            <div className={styles.tableContainer}>
              <table className={styles.transactionTable}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length > 0 ? (
                    transactions.map((t) => (
                      <tr key={t.id}>
                        <td>{t.transactionDate}</td>
                        <td>{t.description}</td>
                        <td>{t.category}</td>
                        <td>{t.type}</td>
                        <td
                          className={`${styles.amount} ${
                            t.type === "INCOME" ? styles.income : styles.expense
                          }`}
                        >
                          {t.type === "EXPENSE" ? "-" : ""}$
                          {t.amount.toFixed(2)}
                        </td>
                        <td>
                          <button
                            className={styles.deleteButton}
                            onClick={() => handleDeleteClick(t)}
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        style={{ textAlign: "center", padding: "2rem" }}
                      >
                        No transactions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </PageLayout>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        title="Delete Transaction"
        actions={
          <>
            <button
              className={modalStyles.actionButton}
              onClick={closeDeleteModal}
            >
              Cancel
            </button>
            <button
              className={`${modalStyles.actionButton} ${modalStyles.confirmButton}`}
              onClick={confirmDeleteTransaction}
            >
              Delete
            </button>
          </>
        }
      >
        <p>
          Are you sure you want to delete this transaction: "
          <strong>{transactionToDelete?.description}</strong>"?
        </p>
      </Modal>
    </>
  );
}

export default FinancePage;
