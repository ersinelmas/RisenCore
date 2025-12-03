import Card from "../../components/Card";
import styles from "./FinanceSummary.module.css";
import { useTranslation } from "react-i18next";

function FinanceSummary({ summary }) {
    const { t } = useTranslation();

    return (
        <div className={styles.summaryContainer}>
            <Card>
                <h4>{t("finance.totalIncome")}</h4>
                <p className={`${styles.amount} ${styles.income}`}>
                    ${summary.income.toFixed(2)}
                </p>
            </Card>
            <Card>
                <h4>{t("finance.totalExpense")}</h4>
                <p className={`${styles.amount} ${styles.expense}`}>
                    ${summary.expense.toFixed(2)}
                </p>
            </Card>
            <Card>
                <h4>{t("finance.currentBalance")}</h4>
                <p className={styles.amount}>${summary.balance.toFixed(2)}</p>
            </Card>
        </div>
    );
}

export default FinanceSummary;
