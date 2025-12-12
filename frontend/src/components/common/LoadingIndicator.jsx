import { useTranslation } from "react-i18next";
import styles from "./LoadingIndicator.module.css";

const LoadingIndicator = ({ message, messageKey = "common.loadingData", fullHeight = false }) => {
  const { t } = useTranslation();
  const label = message || t(messageKey);

  return (
    <div className={`${styles.container} ${fullHeight ? styles.fullHeight : ""}`}>
      <div className={styles.spinner} role="status" aria-live="polite" />
      <p className={styles.message}>{label}</p>
    </div>
  );
};

export default LoadingIndicator;
