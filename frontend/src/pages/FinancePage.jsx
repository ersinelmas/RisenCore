import { useState, useEffect, useMemo, useCallback } from "react";
import toast from "react-hot-toast";
import transactionService from "../services/transactionService";
import styles from "./FinancePage.module.css";
import Card from "../components/Card";
import PageLayout from "../components/layout/PageLayout";
import ExpenseChart from "../components/charts/ExpenseChart";
import TransactionForm from "../features/finance/TransactionForm";
import TransactionTable from "../features/finance/TransactionTable";
import FinanceSummary from "../features/finance/FinanceSummary";

function FinancePage() {
  const [transactions, setTransactions] = useState([]);
  const [expenseSummary, setExpenseSummary] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <PageLayout title="Financial Overview">
      <div className={styles.overviewGrid}>
        <FinanceSummary summary={summary} />

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

      <TransactionForm onTransactionAdded={fetchFinancialData} />

      <div style={{ marginTop: "2rem" }}>
        <TransactionTable
          transactions={transactions}
          loading={loading}
          onTransactionDeleted={fetchFinancialData}
        />
      </div>
    </PageLayout>
  );
}

export default FinancePage;
