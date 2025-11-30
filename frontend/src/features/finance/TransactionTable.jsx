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

function TransactionTable({ transactions, loading, onTransactionDeleted }) {
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
        const toastId = toast.loading("Deleting transaction...");
        try {
            await transactionService.deleteTransaction(transactionToDelete.id);
            toast.success("Transaction deleted!", { id: toastId });
            onTransactionDeleted();
        } catch (error) {
            toast.error("Failed to delete transaction.", { id: toastId });
            console.error("Error deleting transaction:", error);
        } finally {
            setTransactionToDelete(null);
        }
    }, [transactionToDelete, closeDeleteModal, onTransactionDeleted]);

    return (
        <>
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
                                            No transactions found.
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

export default TransactionTable;
