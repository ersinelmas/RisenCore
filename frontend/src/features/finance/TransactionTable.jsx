import { useState, useCallback } from "react";
import { FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";
import transactionService from "../../services/transactionService";
import styles from "./TransactionTable.module.css";
import { toTitleCase } from "../../utils/stringUtils";
import Card from "../../components/Card";
import Modal from "../../components/common/Modal";
import { useModal } from "../../hooks/useModal";
import modalStyles from "../../components/common/Modal.module.css";
import { useTranslation } from "react-i18next";

function TransactionTable({ transactions, loading, onTransactionDeleted }) {
    const { t } = useTranslation();
    const [transactionToDelete, setTransactionToDelete] = useState(null);
    const {
        isOpen: isDeleteModalOpen,
        openModal: openDeleteModal,
        closeModal: closeDeleteModal,
    } = useModal();

    const handleDeleteClick = (transaction) => {
        setTransactionToDelete(transaction);
        openDeleteModal();
    };

    const confirmDeleteTransaction = useCallback(async () => {
        if (!transactionToDelete) return;

        closeDeleteModal();
        const toastId = toast.loading(t("admin.deleting") + "...");
        try {
            await transactionService.deleteTransaction(transactionToDelete.id);
            toast.success(t("finance.transactionDeleted"), { id: toastId });
            onTransactionDeleted();
        } catch (error) {
            toast.error(t("finance.deleteTransactionError"), { id: toastId });
            console.error("Error deleting transaction:", error);
        } finally {
            setTransactionToDelete(null);
        }
    }, [transactionToDelete, closeDeleteModal, onTransactionDeleted, t]);

    return (
        <>
            <Card>
                <h2>{t("finance.recentTransactions")}</h2>
                {loading ? (
                    <p style={{ textAlign: "center", padding: "2rem" }}>
                        {t("common.loading")}
                    </p>
                ) : (
                    <div className={styles.tableContainer}>
                        <table className={styles.transactionTable}>
                            <thead>
                                <tr>
                                    <th>{t("finance.date")}</th>
                                    <th>{t("finance.description")}</th>
                                    <th>{t("finance.category")}</th>
                                    <th>{t("finance.type")}</th>
                                    <th>{t("finance.amount")}</th>
                                    <th>{t("admin.actions")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.length > 0 ? (
                                    transactions.map((t) => (
                                        <tr key={t.id}>
                                            <td>{t.transactionDate}</td>
                                            <td>{t.description}</td>
                                            <td>{toTitleCase(t.category)}</td>
                                            <td>{toTitleCase(t.type)}</td>
                                            <td
                                                className={`${styles.amount} ${t.type === "INCOME" ? styles.income : styles.expense
                                                    }`}
                                            >
                                                {t.type === "EXPENSE" ? "-" : ""}${t.amount.toFixed(2)}
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
                                            {t("finance.noTransactions")}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                title={t("finance.deleteTransaction")}
                actions={
                    <>
                        <button
                            className={modalStyles.actionButton}
                            onClick={closeDeleteModal}
                        >
                            {t("common.cancel")}
                        </button>
                        <button
                            className={`${modalStyles.actionButton} ${modalStyles.confirmButton}`}
                            onClick={confirmDeleteTransaction}
                        >
                            {t("common.delete")}
                        </button>
                    </>
                }
            >
                <p>
                    {t("finance.deleteTransactionConfirm")} "
                    <strong>{transactionToDelete?.description}</strong>"?
                </p>
            </Modal>
        </>
    );
}

export default TransactionTable;
