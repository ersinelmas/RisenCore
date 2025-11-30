import Card from "../../components/Card";
import styles from "./FinanceSummary.module.css";

function FinanceSummary({ summary }) {
    return (
        <div className={styles.summaryContainer}>
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
    );
}

export default FinanceSummary;
