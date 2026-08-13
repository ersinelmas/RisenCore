import { useState, useEffect, useMemo, useCallback } from "react";
import toast from "react-hot-toast";
import transactionService from "../services/transactionService";
import styles from "./FinancePage.module.css";
import Card from "../components/Card";
import PageLayout from "../components/layout/PageLayout";
import AddButton from "../components/common/AddButton";
import Modal from "../components/common/Modal";
import { useModal } from "../hooks/useModal";
import LoadingIndicator from "../components/common/LoadingIndicator";
import EmptyState from "../components/common/EmptyState";
import ErrorBoundary from "../components/common/ErrorBoundary";
import ExpenseChart from "../components/charts/ExpenseChart";
import TransactionForm from "../features/finance/TransactionForm";
import TransactionTable from "../features/finance/TransactionTable";
import FinanceSummary from "../features/finance/FinanceSummary";
import { FiAlertTriangle, FiBarChart2 } from "react-icons/fi";
import { useTranslation } from "react-i18next";

function FinancePage() {
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState([]);
  const [expenseSummary, setExpenseSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {
    isOpen: isAddModalOpen,
    openModal: openAddModal,
    closeModal: closeAddModal,
  } = useModal();

  const fetchFinancialData = useCallback(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      transactionService.getAllTransactions(),
      transactionService.getExpenseSummary(),
    ])
      .then(([transactionsResponse, summaryResponse]) => {
        setTransactions(transactionsResponse.data);
        setExpenseSummary(summaryResponse.data);
      })
      .catch((err) => {
        toast.error(t("finance.loadError"));
        setError(t("finance.loadError"));
        console.error("Error fetching financial data:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [t]);

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

  if (loading) {
    return (
      <PageLayout title={t("finance.title")}>
        <LoadingIndicator fullHeight messageKey="finance.loading" />
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title={t("finance.title")}>
        <EmptyState
          icon={<FiAlertTriangle />}
          title={t("finance.loadError")}
          description={t("finance.loadErrorDescription")}
          actionLabel={t("common.retry")}
          onAction={fetchFinancialData}
        />
      </PageLayout>
    );
  }

  return (
    <ErrorBoundary>
      <PageLayout
        title={t("finance.title")}
        headerAction={<AddButton label={t("finance.addTransaction")} onClick={openAddModal} />}
      >
        <div className={styles.overviewGrid}>
          <FinanceSummary summary={summary} />

          <div className={styles.chartColumn}>
            {expenseSummary.length > 0 ? (
              <Card className={styles.fullHeightCard}>
                <h2 className={styles.chartTitle}>{t("finance.expenseByCategory")}</h2>
                <ExpenseChart data={expenseSummary} />
              </Card>
            ) : (
              <Card className={styles.fullHeightCard}>
                <EmptyState
                  compact
                  icon={<FiBarChart2 />}
                  title={t("finance.noExpenseData")}
                  description={t("finance.noExpenseDataDescription")}
                  actionLabel={t("common.retry")}
                  onAction={fetchFinancialData}
                />
              </Card>
            )}
          </div>
        </div>

        <div className={styles.tableSection}>
          <TransactionTable
            transactions={transactions}
            loading={loading}
            onTransactionDeleted={fetchFinancialData}
          />
        </div>
      </PageLayout>

      <Modal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        title={t("finance.addNewTransaction")}
      >
        <TransactionForm
          onTransactionAdded={() => {
            fetchFinancialData();
            closeAddModal();
          }}
        />
      </Modal>
    </ErrorBoundary>
  );
}

export default FinancePage;
